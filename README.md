# advanced-select

![CircleCI (all branches)](https://img.shields.io/circleci/project/github/myENA/advanced-select.svg)
![npm (scoped)](https://img.shields.io/npm/v/@myena/advanced-select.svg)
![npm (tag)](https://img.shields.io/npm/v/@myena/advanced-select/alpha)
![](https://img.shields.io/npm/dt/@myena/advanced-select.svg)
![NpmLicense](https://img.shields.io/npm/l/@myena/advanced-select.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@myena/advanced-select.svg)
![David](https://img.shields.io/david/peer/myena/advanced-select.svg)
![David](https://img.shields.io/david/dev/myena/advanced-select.svg)


## What's this
Component to render a "select" with advanced interactions (search, select/deselect all, etc) for websites built with Vue and Bootstrap 3

## Install
```
npm install @myena/advanced-select@alpha
```

## Dependencies

- Vue 3
- Bootstrap 3

## Demo

https://myena-advanced-select.netlify.app/

## Usage

Options can be passed as props

```html
<AdvancedSelect
  v-model="value"
  :options="options"
  :disabled="disabled"
  />
```
Or as the default slot

```html
<AdvancedSelect
  v-model="secondValue"
  :disabled="disabled"
  >
  <option value="1">Text</option>
  <option value="2">Text 2</option>
</AdvancedSelect>
```

```javascript
import AdvancedSelect from 'advanced-select';

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
};
```

## Props

Prop | Type | Default | Description
-------|------|---------|-------------
`v-model` | any | `null` | Pass `v-model` to the component to have the reference to the current selected value
`:options` | Array | `[]` | The options to display. A list of objects in the form: `{ value: 1, text: 'One' }` or `{ label: 'Group 1',  options: [ { value: 1, text: 'One' } ]`. If not passed as prop, it tries to read them from the component default slot, where they can be specified as HTML standard `option|optgroup` list.
`:search` | Boolean | `false` | Show or not a search field to filter the options
`:multiple` | Boolean | `false` | Single or multiple select
`:controls` | Boolean | `false` | Show or not a couple control buttons at the top for (de)selecting all items
`:collapseHeaders` | Boolean | `false` | Show or not a link on the headers to toggle items under them
`:displayMax` | Number | `0` | How many selected items to display on the button in multiple mode. 0 means all
`:displayText` | String | `"{0} items selected"` | Text to display if `displayMax` is reached. "{0}" will be replaced by the total number
`:dropdownClass` | String | `''` | Class to use for the dropdown menu. EG: `'dropdown-menu-right'`
`:texts` | Object | `{ placeholder: 'Nothing selected', empty: 'No results', selectAll: 'Select all', selectNone: 'Select none', }` | Texts used

All other DOM attributes are inherited by the component button. For example: `:disabled="true"` will disable the button.

