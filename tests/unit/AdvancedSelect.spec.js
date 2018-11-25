import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Select from '@/components/AdvancedSelect.vue';

describe('AdvancedSelect.vue', () => {
  describe('render', () => {
    it('button in the btn-group', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }],
        },
      });
      expect(wrapper.contains('div.btn-group > button')).to.be.true;
    });
    it('the passed options', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.findAll('div.btn-group > ul > li > ul > li > a')).to.have.lengthOf(2);
    });
    it('grouped options', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
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
        propsData: {
          search: true,
        },
      });
      expect(wrapper.contains('div.btn-group > ul > li > input')).to.be.true;
    });
    it('btn-group when "controls" and "multiple" are true', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          controls: true,
          multiple: true,
        },
      });
      expect(wrapper.contains('div.btn-group > ul > li > .btn-group')).to.be.true;
    });
    describe('does not render a btn-group either "controls" or "multiple" are false', () => {
      it('"controls" false', () => {
        const wrapper = shallowMount(Select, {
          propsData: {
            controls: false,
            multiple: true,
          },
        });
        expect(wrapper.contains('div.btn-group > ul > li > .btn-group')).to.be.false;
      });
      it('"multiple" false', () => {
        const wrapper = shallowMount(Select, {
          propsData: {
            controls: true,
            multiple: false,
          },
        });
        expect(wrapper.contains('div.btn-group > ul > li > .btn-group')).to.be.false;
      });
    });
    it('no selected items shows the placeholder', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.find('div.btn-group > button > span').text()).to.equal('Nothing selected');
    });
    it('selected items shows the value for less than displayMax', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
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
        propsData: {
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
        propsData: {
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
    it('Value is set on single type', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).to.equal(null);
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links.at(0).trigger('click');
      expect(wrapper.vm.myValue).to.equal(1);
      links.at(1).trigger('click');
      expect(wrapper.vm.myValue).to.equal(2);
    });
    it('Value is set on grouped items', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
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
      links.at(0).trigger('click');
      expect(wrapper.vm.myValue).to.equal(1);
      links.at(2).trigger('click');
      expect(wrapper.vm.myValue).to.equal(3);
    });
    it('Value is set on multiple type', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).to.equal(null);
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links.at(0).trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1]);
      links.at(1).trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1, 2]);
    });
    it('Event is emmited on single type with selected value', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links.at(0).trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal(1);
    });
    it('Event is emmited on multiple type with selected value', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links.at(0).trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal([1]);
      links.at(1).trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[1][0]).to.deep.equal([1, 2]);
    });
    it('Disabled item is not triggering change', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2, disabled: true },
          ],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > ul > li > a');
      links.at(1).trigger('click');
      expect(wrapper.emitted().input).to.not.exist;
      links.at(0).trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.equal(1);
    });
    it('All values are set on "Select all"', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
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
      links.at(0).trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0].length).to.equal(3);
      expect(wrapper.emitted().input[0][0]).to.deep.equal([1, 2, 3]);
    });
    it('No values are set on "Select none"', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
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
      links.at(1).trigger('click');
      expect(wrapper.emitted().input).to.exist;
      expect(wrapper.emitted().input[0][0]).to.deep.equal([]);
    });
  });
});
