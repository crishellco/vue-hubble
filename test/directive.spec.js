import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '@/src';

Vue.use(VueHubble);

describe('directive.js', () => {
  beforeEach(() => {

  });

  it('should add an attribute selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble="\'selector\'"></span></div>',
    });

    expect(wrapper.contains('[selector]')).toBe(true);
  });

  it('should add a class selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:class="\'selector\'"></span></div>',
    });

    expect(wrapper.contains('.selector')).toBe(true);
  });

  it('should add an id selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:id="\'selector\'"></span></div>',
    });

    expect(wrapper.contains('#selector')).toBe(true);
  });
});
