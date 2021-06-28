import { shallowMount, config } from '@vue/test-utils';
import Select from '@/components/AdvancedSelect.vue';
import { nextTick } from 'vue';

config.global.mocks = config.global.mocks || {};
config.global.mocks.$style = {};

describe('AdvancedSelect.vue', () => {
  describe('render', () => {
    it('button in the btn-group', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }],
        },
        attrs: {
          id: 'myId',
        },
      });
      expect(wrapper.exists('div.btn-group > button')).toBe(true);
      expect(wrapper.exists('div.btn-group > ul#myId_ul')).toBe(true);
    });
    it('the passed options', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(2);
      // change options
      wrapper.setProps({
        options: [{ text: '1', value: 1 }],
      });
      await nextTick();
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(1);
    });
    it('grouped options', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            {
              label: 'Group',
              options: [
                { text: '3', value: 3 },
              ],
            },
          ],
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(3);
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li')).toHaveLength(4);
    });
    it('an input when "search" is true', () => {
      const wrapper = shallowMount(Select, {
        props: {
          search: true,
        },
      });
      expect(wrapper.exists('div.btn-group > ul > li > input')).toBe(true);
    });
    it('btn-group when "controls" and "multiple" are true', () => {
      const wrapper = shallowMount(Select, {
        props: {
          controls: true,
          multiple: true,
        },
      });
      expect(wrapper.exists('div.btn-group > ul > li > .btn-group')).toBe(true);
    });
    it.skip('with slot', () => {
      const wrapper = shallowMount(Select, {
        slots: {
          default: '<option value="1">Text</option>',
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(2);
    });
    describe('does not render a btn-group either "controls" or "multiple" are false', () => {
      it('"controls" false', () => {
        const wrapper = shallowMount(Select, {
          props: {
            controls: false,
            multiple: true,
          },
        });
        expect(wrapper.find('div.btn-group > ul > li > .btn-group')).toBeDefined();
      });
      it('"multiple" false', () => {
        const wrapper = shallowMount(Select, {
          props: {
            controls: true,
            multiple: false,
          },
        });
        expect(wrapper.find('div.btn-group > ul > li > .btn-group')).toBeDefined();
      });
    });
    it('no selected items shows the placeholder', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).toBe('Nothing selected');
    });
    it('selected items shows the value for less than displayMax', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
          displayMax: 1,
          multiple: true,
          modelValue: [1],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).toBe('1');
    });
    it('selected items shows aggrgate text for more than displayMax', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
          displayMax: 1,
          multiple: true,
          modelValue: [1, 2],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).toBe('2 items selected');
    });
    it('disabled items', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2, disabled: true },
            { text: '3', value: 3, disabled: true },
          ],
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li.disabled').length).toBe(2);
    });
    it('items with icon', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2, icon: 'fa-check' },
          ],
          multiple: true,
          modelValue: [1, 2],
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a > i.fa').length).toBe(1);
      expect(wrapper.vm.values).toEqual(['1', '<i class="fa fa-check"></i> 2']);
    });
    it('items with alternative text', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2, altText: '2 - two' },
          ],
          multiple: true,
          modelValue: [1, 2],
        },
      });
      expect(wrapper.vm.values).toEqual(['1', '2 - two']);
    });
  });
  describe('actions', () => {
    it('Default value is set', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: 'Empty', value: '' }, { text: '0', value: 0 }, { text: '1', value: 1 }, { text: '2', value: 2 }],
          modelValue: 0,
        },
      });
      expect(wrapper.vm.myValue).toBe(0);
      wrapper.setProps({
        modelValue: '',
      });
      await nextTick();
      expect(wrapper.vm.myValue).toBe('');
    });
    it('Value is set on single type', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).toBeNull();
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      expect(wrapper.vm.myValue).toBe(1);
      links[1].trigger('click');
      expect(wrapper.vm.myValue).toBe(2);
    });
    it('Original options list is not mutated', () => {
      const options = [{ text: '1', value: 1 }, { text: '2', value: 2 }];
      const wrapper = shallowMount(Select, {
        propsData: {
          options,
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      links[1].trigger('click');
      expect(options).toEqual([{ text: '1', value: 1 }, { text: '2', value: 2 }]);
    });
    it('Value is set on grouped items', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            {
              label: 'Group',
              options: [
                { text: '3', value: 3 },
              ],
            },
          ],
        },
      });
      expect(wrapper.vm.myValue).toBeNull();
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      expect(wrapper.vm.myValue).toBe(1);
      links[2].trigger('click');
      expect(wrapper.vm.myValue).toBe(3);
    });
    it('Value is set on multiple type', () => {
      const wrapper = shallowMount(Select, {
        props: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).toEqual([]);
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      expect(wrapper.vm.myValue).toEqual([1]);
      links[1].trigger('click');
      expect(wrapper.vm.myValue).toEqual([1, 2]);
      links[1].trigger('click');
      expect(wrapper.vm.myValue).toEqual([1]);
    });
    it('Event is emmited on single type with selected value', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      await links[0].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual(1);
    });
    it('Event is emmited on multiple type with selected value', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      await links[0].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([1]);
      await links[1].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][1][0]).toEqual([1, 2]);
    });
    it('Disabled item is not triggering change', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2, disabled: true },
          ],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      await links[1].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeFalsy();
      await links[0].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(1);
    });
    it('All values are set on "Select all"', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            {
              label: 'Group',
              options: [
                { text: '3', value: 3 },
              ],
            },
          ],
          multiple: true,
          controls: true,
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li .btn-group button');
      await links[0].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([1, 2, 3]);
      expect(wrapper.emitted()['update:modelValue'][0][0].length).toBe(3);
    });
    it('Disabled values are not set on "Select all"', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            {
              label: 'Group',
              options: [
                { text: '3', value: 3 },
                { text: '4', value: 4, disabled: true },
              ],
            },
          ],
          multiple: true,
          controls: true,
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li .btn-group button');
      await links[0].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([1, 2, 3]);
      expect(wrapper.emitted()['update:modelValue'][0][0].length).toBe(3);
    });
    it('No values are set on "Select none"', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            {
              label: 'Group',
              options: [
                { text: '3', value: 3 },
              ],
            },
          ],
          multiple: true,
          controls: true,
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li .btn-group button');
      await links[1].trigger('click');
      expect(wrapper.emitted()['update:modelValue']).toBeDefined();
      expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual([]);
    });
    it('Search returns correct results', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: 'Option 1', value: 1, subtext: 'Option 1 subtext' },
            { text: 'Option 2', value: 2 },
            {
              label: 'Group',
              options: [
                { text: 'Another 3', value: 3 },
                { text: 'Another 4', value: 4 },
                { text: 'Another 5', value: 5 },
              ],
            },
          ],
          multiple: true,
          search: true,
          controls: true,
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(5);
      wrapper.vm.filter = 'opt';
      await nextTick();
      expect(wrapper.vm.filtered).toEqual([
        { text: 'Option 1', value: 1, subtext: 'Option 1 subtext', selected: false },
        { text: 'Option 2', value: 2, selected: false },
      ]);
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(2);
      wrapper.vm.filter = 'anot';
      await nextTick();
      expect(wrapper.vm.filtered).toEqual([
        { header: 'Group' },
        { parentHeader: 'Group', text: 'Another 3', value: 3, selected: false },
        { parentHeader: 'Group', text: 'Another 4', value: 4, selected: false },
        { parentHeader: 'Group', text: 'Another 5', value: 5, selected: false },
      ]);
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).toHaveLength(3);
      wrapper.vm.filter = 'subtext';
      await nextTick();
      expect(wrapper.vm.filtered).toEqual([
        { text: 'Option 1', value: 1, subtext: 'Option 1 subtext', selected: false },
      ]);
    });

    it('Filter event is triggered on search', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: 'Option 1', value: 1 },
            { text: 'Option 2', value: 2 },
          ],
          search: true,
        },
      });
      wrapper.vm.filter = 'Option 1';
      await nextTick();
      expect(wrapper.emitted().filter).toBeDefined();
      expect(wrapper.emitted().filter[0][0]).toEqual('Option 1');
    });

    it('Option groups can be collapsed', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            {
              label: 'Group',
              options: [
                { text: 'Another 3', value: 3 },
                { text: 'Another 4', value: 4 },
                { text: 'Another 5', value: 5 },
              ],
            },
          ],
          collapseHeaders: true,
        },
      });
      const headers = wrapper.findAll('div.btn-group > ul > li > ul > li > span > a');
      expect(headers).toHaveLength(1);
      headers[0].trigger('click');
      await nextTick();
      expect(wrapper.vm.collapsed).toEqual({ Group: false });
      headers[0].trigger('click');
      await nextTick();
      expect(wrapper.vm.collapsed).toEqual({ Group: true });
    });
  });
});
