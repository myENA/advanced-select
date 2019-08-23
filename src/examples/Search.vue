<template>
<div>
    <h2>Multiple select, with groups, search and controls</h2>
    <div class="form-group">
      <label>Pick an option:</label>
      <div>
        <advanced-select
          v-model="value"
          :options="localOptions"
          :multiple="multiple"
          :search="search"
          :controls="controls"
          />
      </div>
    </div>
    <div>
      <pre>&lt;advanced-select
  v-model="value"
  :options="localOptions"
  :multiple="multiple"
  :search="search"
  :controls="controls"
  /&gt;</pre>
      <pre>
export default {
  ...
  data: () => ({
    localOptions: [
      { value: 1, text: 'One' },
      {
        label: 'Group 1',
        options: [
          { value: 3, text: 'Three' },
          { value: 4, text: 'Four', disabled: true },
          { value: 5, text: 'Five' },
        ],
      },
      {
        label: 'Group 2',
        options: [
          { value: 6, text: 'Six' },
          { value: 7, text: 'Seven' },
          { value: 8, text: 'Eight' },
        ],
      },
    ],
    value: [1],
    multiple: true,
    search: true,
    controls: true,
  }),
};</pre>
    </div>
    <h2>"Remote" search</h2>
    <p>Search is performed by the parent. Options could be loaded remotely then served to the component</p>
    <div class="form-group">
      <label>Pick an option:</label>
      <div>
        <advanced-select
          v-model="value"
          :options="options"
          :multiple="multiple"
          :search="search"
          :controls="controls"
          :remote="remote"
          :texts="texts"
          @filter="remoteSearch"
          />
      </div>
    </div>
    <div>
  <pre>&lt;advanced-select
  v-model="value"
  :options="options"
  :multiple="multiple"
  :search="search"
  :remote="remote"
  :controls="controls"
  /&gt;</pre>
      <pre>
export default {
  ...
  data: () => ({
    options: [
      { value: 1, text: 'One' },
      {
        label: 'Group 1',
        options: [
          { value: 3, text: 'Three' },
          { value: 4, text: 'Four', disabled: true },
          { value: 5, text: 'Five' },
        ],
      },
      {
        label: 'Group 2',
        options: [
          { value: 6, text: 'Six' },
          { value: 7, text: 'Seven' },
          { value: 8, text: 'Eight' },
        ],
      },
    ],
    value: [1],
    multiple: true,
    search: true,
    remote: true,
    controls: true,
  }),
};</pre>
    </div>
  </div>
</template>
<script>
import AdvancedSelect from '@/components/AdvancedSelect.vue';

export default {
  components: {
    AdvancedSelect,
  },
  data: () => ({
    localOptions: [
      { value: 1, text: 'One' },
      {
        label: 'Group 1',
        options: [
          { value: 3, text: 'Three' },
          { value: 4, text: 'Four', disabled: true },
          { value: 5, text: 'Five' },
        ],
      },
      {
        label: 'Group 2',
        options: [
          { value: 6, text: 'Six' },
          { value: 7, text: 'Seven' },
          { value: 8, text: 'Eight' },
        ],
      },
      {
        label: '',
        options: [
          { value: 9, text: '' },
          { value: 10, text: 'Ten' },
          { value: 11, text: 'Eleven' },
        ],
      },
    ],
    remoteOptions: [],
    value: null,
    multiple: true,
    search: true,
    remote: true,
    controls: true,
    texts: {
      placeholder: 'Nothing selected',
      empty: 'Start typing to load options',
      selectAll: 'Select all',
      selectNone: 'Select none',
      remoteSearch: 'Start typing to load options',
    },
  }),
  computed: {
    options() {
      return this.remoteOptions;
    },
  },
  methods: {
    remoteSearch(filter) {
      this.remoteOptions = [];
      if (filter.length > 2) {
        // only search if bigger than 2
        const reg = new RegExp(`${filter}`, 'ig');
        // simulate async
        this.texts = {
          ...this.texts,
          empty: 'Loading ...',
        };
        setTimeout(() => {
          this.texts.empty = 'No results';
          this.remoteOptions = [
            { value: 1, text: 'Option One' },
            { value: 3, text: 'Option Three' },
            { value: 4, text: 'Option Four' },
            { value: 5, text: 'Option Five' },
            { value: 6, text: 'Option Six' },
            { value: 7, text: 'Option Seven' },
            { value: 8, text: 'Option Eight' },
          ].filter(o => reg.test(o.text));
        }, 2000);
      } else {
        this.texts = {
          ...this.texts,
          empty: 'Start typing to load options',
        };
      }
    },
  },
};
</script>
