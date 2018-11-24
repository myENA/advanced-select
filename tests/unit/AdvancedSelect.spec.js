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
      expect(wrapper.findAll('div.btn-group > ul > li > a')).to.have.lengthOf(2);
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
  });
  describe('actions', () => {
    it('Value is set on single type', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).to.equal(null);
      const links = wrapper.findAll('div.btn-group > ul > li > a');
      const firstItem = links.at(0);
      firstItem.trigger('click');
      expect(wrapper.vm.myValue).to.equal(1);
      const secondItem = links.at(1);
      secondItem.trigger('click');
      expect(wrapper.vm.myValue).to.equal(2);
    });
    it('Value is set on multiple type', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      expect(wrapper.vm.myValue).to.equal(null);
      const links = wrapper.findAll('div.btn-group > ul > li > a');
      const firstItem = links.at(0);
      firstItem.trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1]);
      const secondItem = links.at(1);
      secondItem.trigger('click');
      expect(wrapper.vm.myValue).to.deep.equal([1, 2]);
    });
    it('Event is emmited on single type with selected value', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > a');
      const firstItem = links.at(0);
      firstItem.trigger('click');
      expect(wrapper.emitted().change).to.exist;
      expect(wrapper.emitted().change[0][0]).to.deep.equal(1);
    });
    it('Event is emmited on multiple type with selected value', () => {
      const wrapper = shallowMount(Select, {
        propsData: {
          multiple: true,
          options: [{ text: '1', value: 1 }, { text: '2', value: 2 }],
        },
      });
      const links = wrapper.findAll('div.btn-group > ul > li > a');
      links.at(0).trigger('click');
      expect(wrapper.emitted().change).to.exist;
      expect(wrapper.emitted().change[0][0]).to.deep.equal([1]);
      links.at(1).trigger('click');
      expect(wrapper.emitted().change).to.exist;
      expect(wrapper.emitted().change[1][0]).to.deep.equal([1, 2]);
    });
  });
});
