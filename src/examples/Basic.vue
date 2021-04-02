<template>
  <div>
    <h2>Default select, with a single possible value</h2>
    <div class="form-group">
      <label>Pick an option:</label>
      <div>
        <advanced-select
          id="basic-setup"
          v-model="value"
          :options="options"
          :disabled="disabled"
          >
        </advanced-select>
      </div>
    </div>
    <div class="form-group">
      <label>Change your option:</label>
      <div>
        <advanced-select
          class="form-control"
          v-model="secondValue"
          :disabled="disabled"
          >
          <option value="1">Text</option>
          <option value="2">Text 2</option>
        </advanced-select>
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="disabled" /> Disabled
          </label>
        </div>
      </div>
    </div>
    <div>
      Options can be passed as props
      <pre>&lt;advanced-select
  id="basic-setup"
  v-model="value"
  :options="options"
  :disabled="disabled"
  /&gt;</pre>
      Or as the default slot <br>
      <strong>Note: only list of options can be passed like this and changes are NOT detected.</strong>
      Using props is recommended.
      <pre>&lt;advanced-select
  v-model="secondValue"
  :disabled="disabled"
  &gt;
  &lt;option value="1"&gt;Text&lt;/option&gt;
  &lt;option value="2"&gt;Text 2&lt;/option&gt;
&lt;/advanced-select&gt;</pre>

      <pre>
export default {
  ...
  data: () => ({
    options: [
      { value: 1, text: 'One' },
      { value: 2, text: 'Two' },
    ],
    value: null,
    secondValue: '1',
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
    secondValue: '1',
    disabled: false,
  }),
  watch: {
    value(val) {
      console.log(val);
    },
  },
};
</script>
