<template>
  <div class="btn-group">
    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
      <span v-if="values.length">{{valuesText}}</span>
      <span v-else :class="$style.placeholder">{{texts.placeholder}}</span>
      &nbsp;<span class="caret"></span>
    </button>
    <ul :class="[$style['dropdown-menu'], 'dropdown-menu']">
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
        <input class="form-control" v-model="filter" placeholder="Search" />
      </li>
      <li v-if="emptyResults" :class="$style.empty">
        <span class="text-muted">
          {{texts.empty}}
        </span>
      </li>
      <li v-else>
        <ul :class="[$style['dropdown-menu'], 'dropdown-menu', $style.items]">
          <li v-for="option in filtered" :key="option.value || option.header"
            :class="{
              'dropdown-header': option.header,
              active: !multiple && !!selected[option.value]
            }">
            <span v-if="option.header">
              {{option.header}}
            </span>
            <a v-else
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
.dropdown-menu {
  min-width: 204px;
  > li {
    > a {
      position: relative;
      padding-right: 26px;
      > i {
        position: absolute;
        top: 6px;
        right: 6px;
      }
    }
  }
}
.search, .controls {
  padding: 3px 10px;
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
  overflow: auto;
}
</style>

<script type="text/javascript">
export default {
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
    controls: {
      default: true,
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
      }),
      type: Object,
    },
  },
  data() {
    return {
      myValue: this.value,
      filter: '',
    };
  },
  computed: {
    values() {
      return Object.values(this.selected).map(o => o.text);
    },
    valuesText() {
      if (this.displayMax && this.displayMax < this.values.length) {
        return this.displayText.replace('{0}', this.values.length);
      }
      return this.values.join(', ');
    },
    optionsMap() {
      return this.getOptionsMap(this.filtered);
    },
    selected() {
      let selected = {};
      if (this.myValue) {
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
    filtered() {
      return this.options.reduce((f, o) => {
        if (o.options) {
          // filter this group
          const group = o.options.filter(this.optionMatch);
          if (this.textMatch(o.label) || group.length) {
            // push the header
            f.push({
              header: o.label,
            });
            // push the rest of the items
            if (group.length) {
              f.push(...group);
            } else {
              f.push(...o.options);
            }
          }
        } else if (this.optionMatch(o)) {
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
      this.$emit('change', newVal);
    },
  },
  methods: {
    getOptionsMap(options, map = {}) {
      return options.reduce((m, o) => {
        if (!o.header) {
          Object.assign(m, { [o.value]: o });
        }
        return m;
      }, map);
    },
    optionMatch(o) {
      return this.textMatch(o.text);
    },
    textMatch(text) {
      return this.filterRegExp.test(text);
    },
    select(e, val) {
      let newVal;
      // for multiple, don't close the menu
      if (this.multiple) {
        e.preventDefault();
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
      this.myValue = this.filtered.map(o => o.value);
    },
    selectNone() {
      this.myValue = [];
    },
  },
};
</script>
