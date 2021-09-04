import { mount } from '@vue/test-utils';
import { wrap } from 'regenerator-runtime';
import Vue from 'vue';
import VueHubble, { defaultConfig } from '../src';
import { getClosingComment, getOpeningComment, getGenericSelector } from './directive';

Vue.use(VueHubble, { defaultSelectorType: 'class', environment: ['development', 'test'] });

const getWrapper = (
  { moutOptions = {}, hubbleOptions = {}, overrides = {}, selector = 'selector' } = {
    moutOptions: {},
    hubbleOptions: {},
    overrides: {},
    selector: 'selector',
  }
) => {
  return mount(
    {
      hubble: {
        namespace: 'test',
      },

      template: `<div><span v-hubble="\'${selector}\'"></span></div>`,

      ...overrides,

      beforeMount() {
        this.$hubble = { ...defaultConfig, prefix: '', enableComments: false, ...hubbleOptions };
      },
    },
    moutOptions
  );
};

describe('install.js', () => {
  beforeEach(() => {
    global.console.warn = jest.fn();
    process.env.NODE_ENV = 'test';
  });

  it('should allow the namespace to be set', () => {
    const wrapper = getWrapper();

    expect(wrapper.find('.test--selector').exists()).toBe(true);
  });

  it('should handle an invalid defaultSelectorType to be set', () => {
    const wrapper = getWrapper({
      hubbleOptions: { defaultSelectorType: 'invalid' },
    });

    expect(wrapper.find('[test--selector]').exists()).toBe(true);
    expect(global.console.warn).toHaveBeenCalledWith('invalid is not a valid selector type, using attr instead');
  });

  it('should allow the defaultSelectorType to be set', () => {
    process.env.NODE_ENV = 'development';

    const wrapper = getWrapper({
      hubbleOptions: { prefix: 'qa', defaultSelectorType: 'class' },
    });

    expect(wrapper.find('.qa--test--selector').exists()).toBe(true);
  });

  it('should allow the enableComments to be set to false', () => {
    let selector = 'selector';
    const wrapper = getWrapper();

    selector = getGenericSelector(wrapper.vm, selector);
    const closingComment = getClosingComment(selector);
    const openingComment = getOpeningComment(selector);

    expect(wrapper.find(`.${selector}`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
  });

  it('should allow the enableDeepNamespacing to be set to false', () => {
    const wrapper = getWrapper({
      hubbleOptions: { enableDeepNamespacing: false },
      overrides: {
        hubble: {
          namespace: 'parent',
        },
        template: '<div><span><child /></span></div>',
      },
      moutOptions: {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child',
            },
          },
        },
      },
    });

    expect(wrapper.find('.parent--child--selector').exists()).toBe(false);
    expect(wrapper.find('.child--selector').exists()).toBe(true);
  });

  it('should allow the enableDeepNamespacing to be set to true', () => {
    const wrapper = getWrapper({
      overrides: {
        hubble: {
          namespace: 'parent',
        },
        template: '<div><span><child /></span></div>',
      },
      moutOptions: {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child',
            },
          },
        },
      },
    });

    expect(wrapper.find('.parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.child--selector').exists()).toBe(false);
  });

  it('should properly prefix selectors', () => {
    const wrapper = getWrapper({
      hubbleOptions: { prefix: 'qa' },
      overrides: {
        hubble: {
          namespace: 'parent',
        },
        template: '<div><span><child /></span></div>',
      },
      moutOptions: {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
            hubble: {
              namespace: 'child',
            },
          },
        },
      },
    });

    expect(wrapper.find('.qa--parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.qa--child--selector').exists()).toBe(false);
  });
});
