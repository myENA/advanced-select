<template>
  <div :class="{ dropup, [$style['btn-group']]: true, 'btn-group': true, open: isOpen }">
    <select
      v-bind="$attrs"
      v-model="myValue"
      :multiple="multiple"
      class="hide"
    >
      <template
        v-for="option in options"
      >
        <option
          :key="option.value"
          v-if="!option.header"
          :value="option.value"
          :disabled="option.disabled"
          :class="{
            'hide': !filtered.find(e => e.value === option.value),
          }"
        >{{ option.text }}</option>
      </template>
    </select>
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false"
      v-bind="$attrs"
      @click="computeDropup">
      <span v-if="values.length" v-html="valuesText"></span>
      <span v-else :class="$style.placeholder">{{texts.placeholder}}</span>
      &nbsp;<span class="caret"></span>
    </button>
    <ul
      role="menu"
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
        <ul
          :class="[$style['dropdown-menu'], 'dropdown-menu', $style.items]"
          >
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
              <a
                v-if="collapseHeaders"
                title="Toggle"
                href="#" @click.prevent.stop="toggle($event, option.header)">
                <i
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
              <i v-if="option.icon" :class="['fa', 'pos-rel', option.icon]"/>
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
      top: 8px;
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
    values() {
      return Object.values(this.selected).map(o => (o.icon ? `<i class="fa ${o.icon}"></i> ${o.text}` : o.text));
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
      return this.getOptionsMap(this.linearOptions);
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
      return this.linearOptions.filter(this.optionMatch);
    },
    /**
     * Create a linear list of all the options (headers included)
     */
    linearOptions() {
      return this.options.reduce((f, o) => {
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
      }, []);
    },
    emptyResults() {
      return this.search && this.filtered.length === 0 && this.filter;
    },
    filterRegExp() {
      return new RegExp(`${this.filter}`, 'ig');
    },
  },
  watch: {
    myValue(newVal) {
      // emit the change event with the new value
      this.$emit('input', newVal);
    },
    value(value) {
      this.myValue = value;
    },
    options: {
      immediate: true,
      handler() {
        this.validateOpions(this.options);
        this.collapsed = this.options.reduce((f, o) => {
          if (o.options) {
            // has header, set it as collapsed by default, if collapse is enabled
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
    $(this.$el).on('hidden.bs.dropdown', () => {
      this.isOpen = false;
      this.filter = '';
    });
    $(this.$el).on('shown.bs.dropdown', () => {
      this.isOpen = true;
      if (this.search) {
        $(`.${this.$style.search} input`, this.$el).focus();
      }
    });
  },
  methods: {
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
      const textMatches = this.textMatch(o.text || o.header);

      return isNotCollapsed && (this.remote || textMatches);
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
        newVal = Object.keys(this.selected).map(k => this.selected[k].value);
        if (this.selected[val]) {
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
      this.myValue = newVal;
    },
    selectAll() {
      // when selecting all, concatenate the exiting selected values
      // with the currently filtered ones
      this.myValue = [].concat(
        this.myValue || [],
        this.filtered.filter(o => !o.header && !o.disabled).map(o => o.value)
      );
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
      if (this.value !== null) {
        return this.value;
      }
      if (this.multiple) {
        return [];
      }
      return null;
    },
  },
};
</script>
