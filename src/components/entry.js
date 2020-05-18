import Vue from 'vue';
import AdvancedSelect from './AdvancedSelect.vue';

const components = {
  AdvancedSelect,
};

// global register components
function register() {
  Object.keys(components).forEach((name) => Vue.component(
    `${LIBNAME}${name}`,
    components[name],
    {
      name: `${LIBNAME}${name}`,
    }
  ));
}

export {
  AdvancedSelect,
};

export default register;
