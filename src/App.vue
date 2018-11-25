<template>
  <div id="app" class="container-fluid">
    <advanced-select
      :value="value"
      :options="options"
      :search="search"
      :multiple="multiple"
      :displayMax="displayMax"
      @change="change"
      />
  </div>
</template>

<script>
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/less/bootstrap.less';
import AdvancedSelect from './components/AdvancedSelect.vue';

export default {
  name: 'app',
  components: {
    AdvancedSelect,
  },
  data: () => ({
    options: [
      { value: 1, text: 'One' },
      { value: 2, text: 'Very long option Very long option Very long option' },
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
    displayMax: 3,
  }),
  methods: {
    change(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="less">
</style>
