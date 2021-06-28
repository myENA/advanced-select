<template>
  <div
    :class="{
      dropup,
      [$style['btn-group']]: true,
      'btn-group': true,
      open: isOpen,
    }"
  >
    <button
      type="button"
      :class="{
        'is-multiple': multiple,
        'is-controls': controls,
        'is-search': search,
        'is-remote': remote,
      }"
      :aria-expanded="isOpen ? 'true' : 'false'"
      class="btn btn-default dropdown-toggle"
      data-toggle="dropdown"
      aria-haspopup="true"
      v-bind="$attrs"
      @click="computeDropup">
      <span v-if="values.length" v-html="valuesText"></span>
      <span v-else :class="$style.placeholder">{{texts.placeholder}}</span>
      &nbsp;<span class="caret"></span>
    </button>
    <ul
      role="list"
      :id="listId"
      :class="[$style['dropdown-menu'], 'dropdown-menu', dropdownClass]">
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
        <input
          class="form-control"
          v-model="filter"
          aria-label="Search"
          placeholder="Search"
          autofocus="autofocus"
        />
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
        <ul
          :class="[$style['dropdown-menu'], 'dropdown-menu', $style.items]"
          >
          <li
            v-for="option in filtered"
            :key="option.value || option.header"
            :data-value="option.value"
            :class="{
              'dropdown-header': option.header,
              active: !multiple && option.selected,
              disabled: option.disabled,
              'has-header': !!option.parentHeader,
            }">
            <span
              v-if="option.header"
              @click.prevent.stop="stopClick"
              >
              {{option.header}}
              <a
                v-if="collapseHeaders"
                title="Toggle"
                href="#" @click.prevent.stop="toggle($event, option.header)">
                <i
                  class="glyphicon"
                  :class="{
                    'glyphicon-chevron-down': !collapsed[option.header],
                    'glyphicon-chevron-right': collapsed[option.header],
                  }"
                  aria-hidden="true"
                  >
                </i>
              </a>
            </span>
            <a v-else
              :title="option.text"
              href="#" @click="select($event, option.value)">
              <i
                v-if="option.icon" :class="['fa', 'pos-rel', option.icon]"
                aria-hidden="true"/>
              {{option.text}}
              <small
                v-if="option.subtext"
                class="text-muted">
                <span> &mdash; </span> {{option.subtext}}
              </small>
              <i v-if="multiple"
                class="glyphicon"
                :class="{ 'glyphicon-ok': option.selected}"
                aria-hidden="true">
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
<style scoped>
.fa.pos-rel {
  position: relative;
  top: 0;
}
.btn-group > .dropdown-toggle:not(:first-child) {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  height: 100%;
}
</style>

<script type="text/javascript">
import $ from 'jquery';
import inView from 'in-view';
import { ref, watch, isVue2 } from 'vue-demi';

inView.offset({
  top: 0,
  bottom: 300,
});

const safeTags = ['b', 'i', 'em', 'strong'];
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

const escapeTextSafe = (nonEscapedText) => {
  let text = escapeHtml(nonEscapedText);
  text = text.replace(/&lt;br(\s\/)?&gt;/ig, '<br>');
  safeTags.forEach((t) => {
    text = text.replace(new RegExp(`&lt;${t}( class=".*")&gt;`, 'ig'), `<${t}$1>`);
    text = text.replace(new RegExp(`&lt;/${t}&gt;`, 'ig'), `</${t}>`);
  });
  return text;
};

const getOptionsFromVNodes = (vnodes) => vnodes.reduce((opts, vnode) => {
  if (vnode.type === 'option') {
    // node is an option
    opts.push({
      text: vnode.children,
      ...vnode.props,
    });
  } else {
    // ignore all the rest, but warn that it's not supported
    console.warn('Passing in default slot anything else than a list of <option> tags is not supported');
  }
  return opts;
}, []);

const getOptionsFromDefaultSlot = (slots) => {
  if (!slots.default) {
    return [];
  }
  return getOptionsFromVNodes(slots.default());
};

export default {
  inheritAttrs: false,
  props: {
    ...(isVue2 ? {
      value: {
        default: null,
      },
    } : {
      modelValue: {
        default: null,
      },
    }),
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
      default: () => ([]),
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
  data() {
    return {
      myValue: this.getDefaultValue(),
      filter: '',
      dropup: false,
      isOpen: false,
      collapsed: {},
    };
  },
  computed: {
    listId() {
      if (this.$attrs.id) {
        return `${this.$attrs.id}_ul`;
      }
      return null;
    },
    values() {
      return Object.values(this.selected).map((o) => (o.icon ? `<i class="fa ${o.icon}"></i> ${o.altText || o.text}` : (o.altText || o.text)));
    },
    valuesText() {
      if (this.displayMax && this.displayMax < this.values.length) {
        return this.displayText.replace('{0}', this.values.length);
      }
      return escapeTextSafe(this.values.join(', '));
    },
    optionsMap() {
      // For the optionsMap, use all options, not just the filtered ones
      // so that selecting values searches entire list
      return this.getOptionsMap(this.getLinearOptions(this.myOptions));
    },
    selected() {
      let selected = {};
      if (this.myValue != null) {
        let { myValue } = this;
        if (!this.multiple) {
          myValue = [this.myValue];
        }
        selected = myValue.reduce((s, v) => {
          if (this.optionsMap[v]) {
            Object.assign(s, {
              [v]: this.optionsMap[v],
            });
          }
          return s;
        }, {});
      }
      return selected;
    },
    /**
     * Create a list of the filtered options; i.e. those that match the search
     */
    filtered() {
      return this.getLinearOptions(this.filterOptions(this.myOptions));
    },
    emptyResults() {
      return this.search && this.filtered.length === 0 && this.filter;
    },
    filterRegExp() {
      const string = this.filter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      return new RegExp(`${string}`, 'ig');
    },
  },
  watch: {
    myValue(newVal) {
      // emit the change event with the new value
      if (isVue2) {
        this.$emit('input', newVal);
      } else {
        this.$emit('update:modelValue', newVal);
      }
    },
    modelValue(value) {
      this.myValue = value;
    },
    value(value) {
      this.myValue = value;
    },
    myOptions: {
      immediate: true,
      handler() {
        this.validateOpions(this.myOptions);
        this.collapsed = this.myOptions.reduce((f, o) => {
          if (o.options) {
            // has header, set it as collapsed by default, if collapse is enabled
            // eslint-disable-next-line no-param-reassign
            f[o.label] = this.collapseHeaders;
          }
          return f;
        }, {});
      },
    },
    filter() {
      this.$emit('filter', this.filter);
    },
  },
  mounted() {
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
    $(this.$el).on('hidden.bs.dropdown', this.onHide);
    $(this.$el).on('shown.bs.dropdown', this.onShow);
  },
  methods: {
    onHide() {
      this.isOpen = false;
      this.filter = '';
    },
    onShow() {
      this.isOpen = true;
      if (this.search) {
        $(`.${this.$style.search} input`, this.$el).focus();
      }
    },
    valueIsSelected(value) {
      if (!this.myValue) {
        return false;
      }
      if (this.multiple) {
        return this.myValue.indexOf(value) > -1;
      }
      return this.myValue === value;
    },
    computeDropup() {
      this.dropup = !inView.is(this.$el);
    },
    getOptionsMap(options, map = {}) {
      return options.reduce((m, o) => {
        if (!o.header) {
          Object.assign(m, { [o.value]: o });
        }
        return m;
      }, map);
    },
    optionMatch(o) {
      const isNotCollapsed = (!o.parentHeader || !this.collapsed[o.parentHeader]);
      const textMatches = this.textMatch(o.text || o.header || o.label);
      const subtextMatches = o.subtext ? this.textMatch(o.subtext) : false;

      return isNotCollapsed && (this.remote || textMatches || subtextMatches);
    },
    textMatch(text) {
      return text ? text.match(this.filterRegExp) !== null : true;
    },
    select(e, val) {
      e.preventDefault();
      if (this.optionsMap[val].disabled) {
        e.stopPropagation();
        return;
      }
      let newVal;
      // for multiple, don't close the menu
      if (this.multiple) {
        e.stopPropagation();
        // update the new selected items
        newVal = Object.keys(this.selected).map((k) => this.selected[k].value);
        if (this.selected[val]) {
          // remove it
          newVal = newVal.filter((k) => k !== val);
        } else {
          // add it
          newVal.push(val);
        }
      } else {
        // for single mode, just set it directly
        newVal = val;
      }
      this.myValue = newVal;
    },
    selectAll() {
      // when selecting all, concatenate the exiting selected values
      // with the currently filtered ones
      this.myValue = [...new Set([].concat(
        this.myValue || [],
        this.filtered.filter((o) => !o.header && !o.disabled).map((o) => o.value)
      ))];
    },
    selectNone() {
      this.myValue = [];
    },
    toggle(event, label) {
      this.collapsed[label] = !this.collapsed[label];
    },
    stopClick() {},
    validateOpions(options, l = 0) {
      options.forEach((o, i) => {
        if (o.options) {
          if (!o.label) {
            console.warn(`No label specified for entry at position ${i}, level ${l}`);
          }
          this.validateOpions(o.options, l + 1);
        } else if (!o.text) {
          console.warn(`No text specified for entry at position ${i}, level ${l}`);
        }
      });
    },
    getDefaultValue() {
      if (isVue2 && this.value !== null) {
        return this.value;
      }
      if (!isVue2 && this.modelValue !== null) {
        return this.modelValue;
      }
      if (this.multiple) {
        return [];
      }
      return null;
    },
    filterOptions(options) {
      return options.reduce((acc, o) => {
        const groupMatch = this.optionMatch(o);
        if (groupMatch) {
          acc.push(o);
        }
        if (!groupMatch && o.options) {
          const matches = o.options.filter(this.optionMatch);
          if (matches.length > 0) {
            acc.push({
              label: o.label,
              options: matches,
            });
          }
        }
        return acc;
      }, []);
    },
    getLinearOptions(options) {
      return options.reduce((f, o) => {
        if (o.options) {
          // push the header
          f.push({
            header: o.label,
          });
          f.push(...o.options.map((opt) => ({ ...opt,
            parentHeader: o.label,
            selected: this.valueIsSelected(opt.value) })));
        } else {
          // it's an item without group, push it to the list
          f.push({ ...o, selected: this.valueIsSelected(o.value) });
        }
        return f;
      }, []);
    },
  },
  setup(props, ctx) {
    const options = ref(props.options && props.options.length
      ? props.options
      : getOptionsFromDefaultSlot(ctx.slots));

    watch(() => props.options, () => {
      options.value = props.options;
    });

    return {
      myOptions: options,
    };
  },
};
</script>
