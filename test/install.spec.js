import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '../src';

describe('install.js', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should allow the defaultSelectorType to be set', () => {
    Vue.use(VueHubble, { defaultSelectorType: 'class', environment: ['development', 'test'] });

    const wrapper = mount({
      hubble: {
        namespace: 'test'
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('.test--selector')).toBe(true);
  });

  it('should handle an invalid defaultSelectorType to be set', () => {
    Vue.prototype.$hubble.defaultSelectorType = 'invalid';

    const wrapper = mount({
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('[selector]')).toBe(true);
  });

  it('should allow the defaultSelectorType to be set', () => {
    Vue.prototype.$hubble.defaultSelectorType = 'class';

    process.env.NODE_ENV = 'development';

    const wrapper = mount({
      hubble: {
        namespace: 'test'
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('.test--selector')).toBe(true);
  });

  it('should allow the enableDeepNamespacing to be set to false', () => {
    Vue.prototype.$hubble.enableDeepNamespacing = false;

    const wrapper = mount(
      {
        hubble: {
          namespace: 'parent'
        },
        template: '<div><span><child /></span></div>'
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child'
            }
          }
        }
      }
    );

    expect(wrapper.contains('.parent--child--selector')).toBe(false);
    expect(wrapper.contains('.child--selector')).toBe(true);
  });

  it('should allow the enableDeepNamespacing to be set to true', () => {
    Vue.prototype.$hubble.enableDeepNamespacing = true;

    const wrapper = mount(
      {
        hubble: {
          namespace: 'parent'
        },
        template: '<div><span><child /></span></div>'
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child'
            }
          }
        }
      }
    );

    expect(wrapper.contains('.parent--child--selector')).toBe(true);
    expect(wrapper.contains('.child--selector')).toBe(false);
  });
});
