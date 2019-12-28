<template>
  <div
    ref="el"
    :class="{ dropup, [$style['btn-group']]: true, 'btn-group': true, open: isOpen }">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false"
      v-bind="$attrs"
      @click="computeDropup">
      <span v-if="values.length">{{valuesText}}</span>
      <span v-else :class="$style.placeholder">{{texts.placeholder}}</span>
      &nbsp;<span class="caret"></span>
    </button>
    <select
      v-bind="$attrs"
      v-model="myValue"
      :multiple="multiple"
      class="hide"
    >
      <template
        v-for="option in filtered"
      >
        <option
          :key="option.value"
          v-if="!option.header"
          :value="option.value"
          :disabled="option.disabled"
        >{{ option.text }}</option>
      </template>
    </select>
    <ul :class="[$style['dropdown-menu'], 'dropdown-menu', dropdownClass]">
      <li v-if="controls && multiple" :class="$style.controls">
        <div class="btn-group btn-group-justified" role="group" aria-label="global actions">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default"
              @click.stop.prevent="selectAll">
              {{texts.selectAll}}
            </button>
          </div>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-default"
              @click.stop.prevent="selectNone">
              {{texts.selectNone}}
            </button>
          </div>
        </div>
      </li>
      <li v-if="search" :class="$style.search">
        <input class="form-control" v-model="filter" placeholder="Search" autofocus="autofocus" />
      </li>
      <li v-if="search && !filter && remote" :class="$style.empty">
        <span class="text-muted">
          {{texts.remoteSearch}}
        </span>
      </li>
      <li v-else-if="emptyResults" :class="$style.empty">
        <span class="text-muted">
          {{texts.empty}}
        </span>
      </li>
      <li v-else>
        <ul :class="[$style['dropdown-menu'], 'dropdown-menu', $style.items]">
          <li
            v-for="option in filtered"
            :key="option.value || option.header"
            :data-value="option.value"
            :class="{
              'dropdown-header': option.header,
              active: !multiple && !!selected[option.value],
              disabled: option.disabled,
              'has-header': !!option.parentHeader,
            }">
            <span
              v-if="option.header"
              @click.prevent.stop="stopClick"
              >
              {{option.header}}
              <a title="Toggle"
                href="#" @click.prevent.stop="toggle($event, option.header)">
                <i v-if="collapseHeaders"
                  class="glyphicon"
                  :class="{
                    'glyphicon-chevron-down': !collapsed[option.header],
                    'glyphicon-chevron-right': collapsed[option.header],
                  }">
                </i>
              </a>
            </span>
            <a v-else
              :title="option.text"
              href="#" @click="select($event, option.value)">
              {{option.text}}
              <i v-if="multiple"
                class="glyphicon"
                :class="{ 'glyphicon-ok': !!selected[option.value] }">
              </i>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style lang="less" module>
.btn-group {
  margin-bottom: 0;
  padding: 0;
  border: none;
  min-width: 200px;
  > button {
    position: relative;
    width: 100%;
    z-index: 1;
    white-space: nowrap;
    span[class="caret"] {
      display: block;
      position: absolute;
      right: 10px;
      top: 15px;
    }
    span:not([class="caret"]) {
      text-align: left;
      display: block;
      position: absolute;
      right: 20px;
      left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .dropdown-menu {
    min-width: 300px;
    width: 100%;
    > li {
      > a {
        position: relative;
        padding-right: 26px;
        text-overflow: ellipsis;
        overflow: hidden;
        > i {
          position: absolute;
          top: 6px;
          right: 6px;
        }
      }
      > span {
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
        position: relative;
        > a {
          position: absolute;
          right: 0;
        }
      }
    }
  }
  > .dropdown-menu {
    min-width: 302px;
  }
}
.search, .controls {
  padding: 3px 10px;
}
.search {
  :global {
    input.form-control {
      width: 100%;
    }
  }
}
.empty {
  padding: 3px 20px;
}
.placeholder {
  color: #777777;
}
.items {
  display: block;
  position: relative;
  padding: 0;
  margin: 0;
  border: 0;
  box-shadow: none;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: transparent;
  > li {
    margin-right: 2px;
  }
}
</style>

<script type="text/javascript">
import $ from 'jquery';
import inView from 'in-view';
import Vue from 'vue';
import VueCompositionApi, {
  reactive,
  computed,
  toRefs,
  ref,
  watch,
  onMounted,
} from '@vue/composition-api';

Vue.use(VueCompositionApi);

inView.offset({
  top: 0,
  bottom: 300,
});

function getOptionsFromVNodes(vnodes) {
  return vnodes.reduce((opts, vnode) => {
    if (vnode.tag === 'option') {
      // node is an option
      opts.push(Object.assign({
        text: vnode.children[0].text,
      }, vnode.data.attrs, vnode.data.domProps));
    } else if (vnode.tag === 'optgroup') {
      opts.push(Object.assign({
        options: getOptionsFromVNodes(vnode.children),
      }, vnode.data.attrs, vnode.data.domProps));
    } else {
      // ignore all the rest
    }
    return opts;
  }, []);
}

const getDefaultValue = (props) => {
  if (props.value !== null) {
    return props.value;
  }
  if (props.multiple) {
    return [];
  }
  return null;
};

const getOptionsMap = (options, map = {}) => options.reduce((m, o) => {
  if (!o.header) {
    Object.assign(m, { [o.value]: o });
  }
  return m;
}, map);


const getState = (props) => {
  const collapsed = ref({});
  const filter = ref('');
  const filterRegExp = computed(() => new RegExp(`${filter.value}`, 'ig'));
  const textMatch = text => (text ? text.match(filterRegExp.value) !== null : true);

  const optionMatch = (o) => {
    const isNotCollapsed = (!o.parentHeader || !collapsed.value[o.parentHeader]);
    const textMatches = textMatch(o.text || o.header);

    return isNotCollapsed && (props.remote || textMatches);
  };

  const state = reactive({
    myValue: getDefaultValue(props),
    filter,
    dropup: false,
    isOpen: false,
    collapsed,
    values: computed(() => Object.values(state.selected).map(o => o.text)),
    valuesText: computed(() => {
      if (props.displayMax && props.displayMax < state.values.length) {
        return props.displayText.replace('{0}', state.values.length);
      }
      return state.values.join(', ');
    }),
    optionsMap: computed(() =>
      // For the optionsMap, use all options, not just the filtered ones
      // so that selecting values searches entire list
      getOptionsMap(state.linearOptions)),
    selected: computed(() => {
      let selected = {};
      if (state.myValue != null) {
        let { myValue } = state;
        if (!props.multiple) {
          myValue = [state.myValue];
        }
        selected = myValue.reduce((s, v) => {
          if (state.optionsMap[v]) {
            Object.assign(s, {
              [v]: state.optionsMap[v],
            });
          }
          return s;
        }, {});
      }
      return selected;
    }),
    /**
     * Create a list of the filtered options; i.e. those that match the search
     */
    filtered: computed(() => state.linearOptions.filter(optionMatch)),
    /**
     * Create a linear list of all the options (headers included)
     */
    linearOptions: computed(() => props.options.reduce((f, o) => {
      if (o.options) {
        // push the header
        f.push({
          header: o.label,
        });
        f.push(...o.options.map(opt => Object.assign(opt, { parentHeader: o.label })));
      } else {
        // it's an item without group, push it to the list
        f.push(o);
      }
      return f;
    }, [])),
    emptyResults: computed(() => props.search && state.filtered.length === 0 &&
      state.filter.value),
    filterRegExp,
  });

  return state;
};

const getMethods = (props, context, state) => {
  const methods = {
    computeDropup() {
      state.dropup = !inView.is(context.refs.el);
    },
    select(e, val) {
      e.preventDefault();
      if (state.optionsMap[val].disabled) {
        e.stopPropagation();
        return;
      }
      let newVal;
      // for multiple, don't close the menu
      if (props.multiple) {
        e.stopPropagation();
        // update the new selected items
        newVal = Object.keys(state.selected).map(k => state.selected[k].value);
        if (state.selected[val]) {
          // remove it
          newVal = newVal.filter(k => k !== val);
        } else {
          // add it
          newVal.push(val);
        }
      } else {
        // for single mode, just set it directly
        newVal = val;
      }
      state.myValue = newVal;
    },
    selectAll() {
      // when selecting all, concatenate the exiting selected values
      // with the currently filtered ones
      state.myValue = [].concat(
        state.myValue || [],
        state.filtered.filter(o => !o.header && !o.disabled).map(o => o.value)
      );
    },
    selectNone() {
      state.myValue = [];
    },
    toggle(event, label) {
      state.collapsed[label] = !state.collapsed[label];
    },
    stopClick() {},
    validateOpions(options, l = 0) {
      options.forEach((o, i) => {
        if (o.options) {
          if (!o.label) {
            console.warn(`No label specified for entry at position ${i}, level ${l}`);
          }
          methods.validateOpions(o.options, l + 1);
        } else if (!o.text) {
          console.warn(`No text specified for entry at position ${i}, level ${l}`);
        }
      });
    },
  };

  return methods;
};

const setupWatches = (props, context, state, methods) => {
  watch(() => state.myValue, () => {
    context.emit('input', state.myValue);
  }, { lazy: true });
  watch(() => props.value, () => {
    state.myValue = props.value;
  }, { lazy: true });
  watch(() => state.filter, () => {
    context.emit('filter', state.filter);
  });
  watch(() => props.options, () => {
    methods.validateOpions(props.options);
    state.collapsed = props.options.reduce((f, o) => {
      if (o.options) {
        // has header, set it as collapsed by default, if collapse is enabled
        // eslint-disable-next-line no-param-reassign
        f[o.label] = props.collapseHeaders;
      }
      return f;
    }, {});
  });
};
function onMountedHook() {
  this.computeDropup();
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        this.computeDropup();
        ticking = false;
      });
      ticking = true;
    }
  });
  $(this.$el).on('hidden.bs.dropdown', () => {
    this.isOpen = false;
  });
  $(this.$el).on('shown.bs.dropdown', () => {
    this.isOpen = true;
  });
}

export default {
  inheritAttrs: false,
  props: {
    value: {
      default: null,
    },
    multiple: {
      default: false,
      type: Boolean,
    },
    search: {
      default: false,
      type: Boolean,
    },
    remote: {
      default: false,
      type: Boolean,
    },
    controls: {
      default: false,
      type: Boolean,
    },
    collapseHeaders: {
      default: false,
      type: Boolean,
    },
    displayMax: {
      default: 0,
      type: Number,
    },
    displayText: {
      default: '{0} items selected',
      type: String,
    },
    dropdownClass: {
      default: '',
      type: String,
    },
    options: {
      default() {
        if (this.$slots.default) {
          return getOptionsFromVNodes(this.$slots.default);
        }
        return [];
      },
      type: Array,
    },
    texts: {
      default: () => ({
        placeholder: 'Nothing selected',
        empty: 'No results',
        selectAll: 'Select all',
        selectNone: 'Select none',
        remoteSearch: 'Start typing to load options',
      }),
      type: Object,
    },
  },
  setup(props, context) {
    const state = getState(props);

    const methods = getMethods(props, context, state);

    setupWatches(props, context, state, methods);

    onMounted(onMountedHook);

    return {
      ...toRefs(state),
      ...methods,
    };
  },
};
</script>
