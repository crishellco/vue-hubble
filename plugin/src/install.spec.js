import { mount } from '@vue/test-utils';

import { getClosingComment, getOpeningComment, getGenericSelector, NAMESPACE } from './directive';
import VueHubble, { defaultConfig } from '../src';

const getWrapper = (
  { mountOptions = {}, hubbleOptions = {}, overrides = {}, selector = 'selector' } = {
    hubbleOptions: {},
    mountOptions: {},
    overrides: {},
    selector: 'selector',
  }
) => {
  return mount(
    {
      hubble: {
        namespace: 'test',
      },
      template: `<div><span v-hubble="'${selector}'"></span></div>`,
      ...overrides,
    },
    {
      ...mountOptions,
      global: {
        ...(mountOptions.global || {}),
        plugins: [
          [
            VueHubble,
            {
              ...defaultConfig,
              defaultSelectorType: 'class',
              environment: ['development', 'test'],
              ...hubbleOptions,
            },
          ],
        ],
      },
    }
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
      hubbleOptions: { defaultSelectorType: 'class', prefix: 'qa' },
    });

    expect(wrapper.find('.qa--test--selector').exists()).toBe(true);
  });

  it('should allow the enableComments to be set to false', () => {
    let selector = 'selector';
    const wrapper = getWrapper();

    selector = getGenericSelector(wrapper.vm, wrapper.vm.$el.__vnode, selector);
    const closingComment = getClosingComment(selector);
    const openingComment = getOpeningComment(selector);

    expect(wrapper.find(`.${selector}`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
  });

  it('should allow the enableDeepNamespacing to be set to false', () => {
    const wrapper = getWrapper({
      hubbleOptions: { enableDeepNamespacing: false },
      mountOptions: {
        global: {
          stubs: {
            child: {
              hubble: {
                namespace: 'child',
              },
              template: '<div v-hubble="\'selector\'" />',
            },
          },
        },
      },
      overrides: {
        hubble: {
          namespace: 'parent',
        },
        template: '<div><span><child /></span></div>',
      },
    });

    expect(wrapper.find('.parent--child--selector').exists()).toBe(false);
    expect(wrapper.find('.child--selector').exists()).toBe(true);
  });

  it('should allow the enableDeepNamespacing to be set to true', () => {
    const wrapper = getWrapper({
      mountOptions: {
        global: {
          stubs: {
            child: {
              hubble: {
                namespace: 'child',
              },
              template: '<div v-hubble="\'selector\'" />',
            },
          },
        },
      },
      overrides: {
        hubble: {
          namespace: 'parent',
        },
        template: '<div><span><child /></span></div>',
      },
    });

    expect(wrapper.find('.parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.child--selector').exists()).toBe(false);
  });

  it('should properly prefix selectors', () => {
    const wrapper = getWrapper({
      hubbleOptions: { prefix: 'qa' },
      mountOptions: {
        global: {
          stubs: {
            child: {
              hubble: {
                namespace: 'child',
              },
              template: '<div v-hubble="\'selector\'" />',
            },
          },
        },
      },
      overrides: {
        hubble: {
          namespace: 'parent',
        },
        template: '<div><span><child /></span></div>',
      },
    });

    expect(wrapper.find('.qa--parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.qa--child--selector').exists()).toBe(false);
  });

  it('should allow the enableGroupedSelectors to be set to true', () => {
    let selector = 'selector';
    const wrapper = getWrapper();

    selector = getGenericSelector(wrapper.vm, wrapper.vm.$el.__vnode, selector);

    expect(wrapper.find(`[${NAMESPACE}].${selector}`).attributes(`${NAMESPACE}-selector`)).toBe(
      `[${NAMESPACE}].${selector}`
    );
  });

  it('should allow the enableGroupedSelectors to be set to false', () => {
    let selector = 'selector';
    const wrapper = getWrapper({ hubbleOptions: { enableGroupedSelectors: false } });

    selector = getGenericSelector(wrapper.vm, wrapper.vm.$el.__vnode, selector);

    expect(wrapper.find(`.${selector}`).attributes(`${NAMESPACE}-selector`)).toBe(`.${selector}`);
  });
});
