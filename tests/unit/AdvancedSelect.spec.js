import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Select from '@/components/AdvancedSelect.vue';

describe('AdvancedSelect.vue', () => {
  describe('render', () => {
    it('button in the btn-group', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }],
        },
      });
      expect(wrapper.exists('div.btn-group > button')).to.be.true;
    });
    it('the passed options', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(2);
      // change options
      wrapper.setProps({
        options: [{ text: '1', value: 1 }],
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(1);
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
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(3);
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li')).to.have.lengthOf(4);
    });
    it('an input when "search" is true', () => {
      const wrapper = shallowMount(Select, {
        props: {
          search: true,
        },
      });
      expect(wrapper.exists('div.btn-group > ul > li > input')).to.be.true;
    });
    it('btn-group when "controls" and "multiple" are true', () => {
      const wrapper = shallowMount(Select, {
        props: {
          controls: true,
          multiple: true,
        },
      });
      expect(wrapper.exists('div.btn-group > ul > li > .btn-group')).to.be.true;
    });
    it.skip('with slot', () => {
      const wrapper = shallowMount(Select, {
        slots: {
          default: '<option value="1">Text</option>',
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(2);
    });
    describe('does not render a btn-group either "controls" or "multiple" are false', () => {
      it('"controls" false', () => {
        const wrapper = shallowMount(Select, {
          props: {
            controls: false,
            multiple: true,
          },
        });
        expect(wrapper.find('div.btn-group > ul > li > .btn-group')).to.exist;
      });
      it('"multiple" false', () => {
        const wrapper = shallowMount(Select, {
          props: {
            controls: true,
            multiple: false,
          },
        });
        expect(wrapper.find('div.btn-group > ul > li > .btn-group')).to.exist;
      });
    });
    it('no selected items shows the placeholder', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).to.equal('Nothing selected');
    });
    it('selected items shows the value for less than displayMax', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
          displayMax: 1,
          multiple: true,
          value: [1],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).to.equal('1');
    });
    it('selected items shows aggrgate text for more than displayMax', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
          displayMax: 1,
          multiple: true,
          value: [1, 2],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).to.equal('2 items selected');
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
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li.disabled').length).to.equal(2);
    });
  });
  describe('actions', () => {
    it('Default value is set', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: 'Empty', value: '' }, { text: '0', value: 0 }, { text: '1', value: 1 }, { text: '2', value: 2 }],
          value: 0,
        },
      });
      expect(wrapper.vm.myValue).to.equal(0);
      wrapper.setProps({
        value: '',
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.myValue).to.equal('');
    });
    it('Value is set on single type', () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).to.equal(null);
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      expect(wrapper.vm.myValue).to.equal(1);
      links[1].trigger('click');
      expect(wrapper.vm.myValue).to.equal(2);
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
      expect(wrapper.vm.myValue).to.equal(null);
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      expect(wrapper.vm.myValue).to.equal(1);
      links[2].trigger('click');
      expect(wrapper.vm.myValue).to.equal(3);
    });
    it('Value is set on multiple type', () => {
      const wrapper = shallowMount(Select, {
        props: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).to.deep.equal([]);
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links[0].trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1]);
      links[1].trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1, 2]);
      links[1].trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1]);
    });
    it('Event is emmited on single type with selected value', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      await links[0].trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal(1);
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
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal([1]);
      await links[1].trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[1][0]).to.deep.equal([1, 2]);
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
      expect(wrapper.emitted().input).to.not.exist;
      await links[0].trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.equal(1);
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
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal([1, 2, 3]);
      expect(wrapper.emitted().input[0][0].length).to.equal(3);
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
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal([1, 2, 3]);
      expect(wrapper.emitted().input[0][0].length).to.equal(3);
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
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal([]);
    });
    it('Search returns correct results', async () => {
      const wrapper = shallowMount(Select, {
        props: {
          options: [
            { text: 'Option 1', value: 1 },
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
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(5);
      wrapper.vm.filter = 'opt';
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.filtered).to.deep.equal([
        { text: 'Option 1', value: 1 },
        { text: 'Option 2', value: 2 },
      ]);
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(2);
      wrapper.vm.filter = 'anot';
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.filtered).to.deep.equal([
        { parentHeader: 'Group', text: 'Another 3', value: 3 },
        { parentHeader: 'Group', text: 'Another 4', value: 4 },
        { parentHeader: 'Group', text: 'Another 5', value: 5 },
      ]);
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(3);
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
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().filter).to.exist;
      expect(wrapper.emitted().filter[0][0]).to.deep.equal('Option 1');
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
      expect(headers).to.have.lengthOf(1);
      headers[0].trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.collapsed).to.deep.eq({ Group: false });
      headers[0].trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.collapsed).to.deep.eq({ Group: true });
    });
  });
});
