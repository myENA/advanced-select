<template>
  <div>
    <h2>Default select, with a single possible value</h2>
    <div class="form-group">
      <label>Pick an option:</label>
      <div>
        <advanced-select
          v-model="value"
          :options="options"
          :disabled="disabled"
          />
          <div class="checkbox">
            <label>
              <input type="checkbox" v-model="disabled" /> Disabled
            </label>
          </div>
      </div>
    </div>
    <div>
      <pre>&lt;advanced-select
  v-model="value"
  :options="options"
  :disabled="disabled"
  /&gt;</pre>
      <pre>
export default {
  ...
  data: () => ({
    options: [
      { value: 1, text: 'One' },
      { value: 2, text: 'Two' },
    ],
    disabled: false,
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
      { value: 2, text: 'Two' },
    ],
    value: null,
    disabled: false,
  }),
  watch: {
    value(val) {
      console.log(val);
    },
  },
};
</script>
