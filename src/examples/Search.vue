<template>
<div>
    <h2>Multiple select, with groups, search and controls</h2>
    <div class="form-group">
      <label>Pick an option:</label>
      <div>
        <advanced-select
          v-model="value"
          :options="options"
          :multiple="multiple"
          :search="search"
          :controls="controls"
          />
      </div>
    </div>
    <div>
      <pre>&lt;advanced-select
  v-model="value"
  :options="options"
  :multiple="multiple"
  :search="search"
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
    options: [
      { value: 1, text: 'One' },
      {
        label: 'Group 1',
        options: [
          { value: 3, text: 'Three' },
          { value: 4, text: 'Four' },
          { value: 5, text: 'Five' },
        ],
      },
      {
        label: 'Group 2',
        options: [
          { value: 6, text: 'Six' },
          { value: 7, text: 'Seven', disabled: true },
          { value: 8, text: 'Eight' },
        ],
      },
    ],
    value: null,
    multiple: true,
    search: true,
    controls: true,
  }),
};
</script>
