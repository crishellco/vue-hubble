import { mount } from '@vue/test-utils'
import Vue from 'vue';
import VueHubble from '@/src';

Vue.use(VueHubble);

describe('directive.js', () => {
  beforeEach(() => {

  });

  it('should add an attribute selector', () => {
    const wrapper = mount({
      template: '<div v-hubble="\'selector\'"></div>'
    });

    expect('selector' in wrapper.attributes()).toBeTruthy();
  });

  it('should add a class selector', () => {
    const wrapper = mount({
      template: '<div v-hubble:class="\'selector\'"></div>'
    });

    expect(wrapper.classes()).toContain('selector');
  });

  it('should add an id selector', () => {
    const wrapper = mount({
      template: '<div v-hubble:id="\'selector\'"></div>'
    });

    expect(wrapper.element.id).toBe('selector');
  });
});
