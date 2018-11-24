<template>
  <div id="app" class="container-fluid">
    <advanced-select
      :value="value"
      :options="options"
      :search="search"
      :multiple="multiple"
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
    ],
    value: [1],
    multiple: true,
    search: true,

  }),
  async created() {
  },
  methods: {
    change(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="less">
</style>
