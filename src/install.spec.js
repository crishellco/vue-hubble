import { mount } from '@vue/test-utils';
import { wrap } from 'regenerator-runtime';
import Vue from 'vue';
import VueHubble, { defaultConfig } from '../src';
import { getClosingComment, getOpeningComment, getGenericSelector } from './directive';

Vue.use(VueHubble, { defaultSelectorType: 'class', environment: ['development', 'test'] });

describe('install.js', () => {
  beforeEach(() => {
    global.console.warn = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  it('should allow the namespace to be set', () => {
    const wrapper = mount({
      hubble: {
        namespace: 'test',
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>',
    });

    expect(wrapper.find('.test--selector').exists()).toBe(true);
  });

  it('should handle an invalid defaultSelectorType to be set', () => {
    const wrapper = mount({
      beforeMount() {
        this.$hubble = { ...defaultConfig, defaultSelectorType: 'invalid' };
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>',
    });

    expect(wrapper.find('[selector]').exists()).toBe(true);
    expect(global.console.warn).toHaveBeenCalledWith('invalid is not a valid selector type, using attr instead');
  });

  it('should allow the defaultSelectorType to be set', () => {
    process.env.NODE_ENV = 'development';

    const wrapper = mount({
      hubble: {
        namespace: 'test',
      },
      beforeMount() {
        this.$hubble = { ...defaultConfig, prefix: 'qa', defaultSelectorType: 'class' };
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>',
    });

    expect(wrapper.find('.qa--test--selector').exists()).toBe(true);
  });

  it('should allow the enableComments to be set to false', () => {
    const value = 'selector';

    const wrapper = mount({
      beforeMount() {
        this.$hubble = { ...defaultConfig, enableComments: false };
      },
      template: `<div><div v-hubble="'${value}'" /></div>`,
    });
    const selector = getGenericSelector(wrapper.vm, value);
    const closingComment = getClosingComment(selector);
    const openingComment = getOpeningComment(selector);

    expect(wrapper.find(`.${selector}`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
  });

  it('should allow the enableDeepNamespacing to be set to false', () => {
    const wrapper = mount(
      {
        hubble: {
          namespace: 'parent',
        },
        beforeMount() {
          this.$hubble = { ...defaultConfig, enableDeepNamespacing: false };
        },
        template: '<div><span><child /></span></div>',
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child',
            },
          },
        },
      }
    );

    expect(wrapper.find('.parent--child--selector').exists()).toBe(false);
    expect(wrapper.find('.child--selector').exists()).toBe(true);
  });

  it('should allow the enableDeepNamespacing to be set to true', () => {
    const wrapper = mount(
      {
        hubble: {
          namespace: 'parent',
        },
        beforeMount() {
          this.$hubble = { ...defaultConfig, enableDeepNamespacing: true };
        },
        template: '<div><span><child /></span></div>',
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child',
            },
          },
        },
      }
    );

    expect(wrapper.find('.parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.child--selector').exists()).toBe(false);
  });

  it('should properly prefix selectors', () => {
    const wrapper = mount(
      {
        hubble: {
          namespace: 'parent',
        },
        beforeMount() {
          this.$hubble = { ...defaultConfig, prefix: 'qa' };
        },
        template: '<div><span><child /></span></div>',
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'">child</div>',
            hubble: {
              namespace: 'child',
            },
          },
        },
      }
    );

    expect(wrapper.find('.qa--parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.qa--child--selector').exists()).toBe(false);
  });
});
