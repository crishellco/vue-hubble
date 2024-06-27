import { mount } from '@vue/test-utils';

import VueHubble, { defaultConfig } from '.';
import {
  get,
  getClosingComment,
  getOpeningComment,
  getGenericSelector,
  getQuerySelector,
  NAMESPACE,
} from './directive';

jest.useFakeTimers();

const getWrapper = (
  { mountOptions = {}, hubbleOptions = {}, overrides = {}, selector = 'selector' } = {
    hubbleOptions: {},
    mountOptions: {},
    overrides: {},
    selector: 'selector',
  }
) => {
  global.console.warn = jest.fn();

  const wrapper = mount(
    {
      beforeMount() {
        this.$hubble = {
          ...defaultConfig,
          ...hubbleOptions,
        };
      },
      data() {
        return {
          selector,
        };
      },
      template: `<div><span v-hubble="selector"><span v-hubble="'child'"></span></span></div>`,
      ...overrides,
    },
    {
      ...mountOptions,
      global: {
        ...(mountOptions.global || {}),
        plugins: [[VueHubble]],
      },
    }
  );

  return wrapper;
};

describe('directive.js', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  it(`should add a the ${NAMESPACE} attribute`, () => {
    const wrapper = getWrapper();

    expect(wrapper.find(`[${NAMESPACE}]`).exists()).toBe(true);
  });

  it('should add an attribute selector', () => {
    const wrapper = getWrapper();

    expect(wrapper.find(`[${NAMESPACE}][selector]`).exists()).toBe(true);
  });

  it('should add a class selector', () => {
    const wrapper = getWrapper({ hubbleOptions: { defaultSelectorType: 'class' } });

    expect(wrapper.find(`[${NAMESPACE}].selector`).exists()).toBe(true);
  });

  it('should add an id selector', () => {
    const wrapper = getWrapper({ hubbleOptions: { defaultSelectorType: 'id' } });

    expect(wrapper.find(`[${NAMESPACE}]#selector`).exists()).toBe(true);
  });

  it('should not add a selector if NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'not-test';

    const wrapper = getWrapper();

    expect(wrapper.find(`[${NAMESPACE}]#selector`).exists()).toBe(false);
  });

  it('should use component tree to namespace the selector', () => {
    const wrapper = getWrapper({
      mountOptions: {
        global: {
          stubs: {
            child: {
              hubble: 'child',
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

    expect(wrapper.find(`[${NAMESPACE}][parent--child--selector]`).exists()).toBe(true);
  });

  it('should use component tree to namespace the selector and skip empty namespaces', () => {
    const wrapper = getWrapper({
      mountOptions: {
        global: {
          stubs: {
            child: {
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

    expect(wrapper.find(`[${NAMESPACE}][parent--selector]`).exists()).toBe(true);
  });

  it('should handle reactive attr selectors', async () => {
    const prefix = 'qa';
    const value = 'selector';

    const wrapper = getWrapper({
      hubbleOptions: { defaultSelectorType: 'attr', enableComments: true, prefix },
      selector: value,
    });

    const selector = getGenericSelector(wrapper.vm, value);
    const querySelector = getQuerySelector(selector, 'attr', wrapper.vm);
    const closingComment = getClosingComment(querySelector);
    const openingComment = getOpeningComment(querySelector);

    expect(wrapper.find(`[${NAMESPACE}][${selector}]`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBeGreaterThan(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBeGreaterThan(-1);

    wrapper.setData({
      selector: '',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}][${selector}]`).exists()).toBe(false);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
  });

  it('should handle reactive class selectors', async () => {
    const wrapper = getWrapper({ hubbleOptions: { defaultSelectorType: 'class' }, selector: 'old' });
    expect(wrapper.find(`[${NAMESPACE}].old`).exists()).toBe(true);

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(true);
  });

  it('should handle reactive class selectors starting empty', async () => {
    const wrapper = getWrapper({ hubbleOptions: { defaultSelectorType: 'class' }, selector: '' });

    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(true);
  });

  it('should handle reactive invalid selectors starting empty', async () => {
    const wrapper = getWrapper({ hubbleOptions: { defaultSelectorType: 'invalid' }, selector: '' });

    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
    expect(global.console.warn).toHaveBeenCalledWith('invalid is not a valid selector type, using attr instead');

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
  });

  it('should handle reactive invalid selectors', async () => {
    const wrapper = getWrapper({ hubbleOptions: { defaultSelectorType: 'invalid' }, selector: 'old' });

    expect(wrapper.find(`[${NAMESPACE}].old`).exists()).toBe(false);
    expect(global.console.warn).toHaveBeenCalledWith('invalid is not a valid selector type, using attr instead');

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
  });

  describe('get', () => {
    it('should correctly handle defaults', () => {
      expect(get({}, ['foo'], 'bar')).toBe('bar');
      expect(get({}, ['foo'])).toBe(undefined);
    });
  });

  describe('selector picker', () => {
    it('should not render if enableSelectorPicker is false', async () => {
      const wrapper = getWrapper();
      const element = wrapper.find(`[${NAMESPACE}][selector]`);

      const event = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      Object.defineProperty(event, 'target', { enumerable: true, value: element.element });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      expect(document.querySelector(`[${NAMESPACE}-tooltip]`)).toBeNull();
    });

    it('should render if enableSelectorPicker is true', async () => {
      const wrapper = getWrapper({
        hubbleOptions: { defaultSelectorType: undefined, enableSelectorPicker: true },
        selector: undefined,
      });

      const element = wrapper.find(`[${NAMESPACE}][selector]`);

      const event = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      Object.defineProperty(event, 'target', { enumerable: true, value: element.element });
      document.dispatchEvent(event);
      await wrapper.vm.$nextTick();
      const tooltip = document.querySelector(`[${NAMESPACE}-tooltip]`);
      expect(tooltip).toBeTruthy();

      Object.defineProperty(event, 'target', { enumerable: true, value: element.element });
      document.dispatchEvent(event);
      await wrapper.vm.$nextTick();
      expect(document.querySelector(`[${NAMESPACE}-tooltip]`)).toEqual(tooltip);
    });

    it('should render if a child is hovered over', async () => {
      const wrapper = getWrapper({
        hubbleOptions: { defaultSelectorType: undefined, enableSelectorPicker: true },
        selector: undefined,
      });

      const element = wrapper.find(`[${NAMESPACE}][child]`);

      const event = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      Object.defineProperty(event, 'target', { enumerable: true, value: element.element });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      expect(document.querySelector(`[${NAMESPACE}-tooltip]`)).toBeTruthy();
    });

    it('should copy the selector to clipboard', async () => {
      document.execCommand = jest.fn();

      const wrapper = getWrapper({
        hubbleOptions: { defaultSelectorType: undefined, enableSelectorPicker: true },
        selector: undefined,
      });

      const element = wrapper.find(`[${NAMESPACE}][selector]`);

      const event = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      Object.defineProperty(event, 'target', { enumerable: true, value: element.element });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      const tooltip = document.querySelector(`[${NAMESPACE}-tooltip]`);

      tooltip.click();
      expect(tooltip.innerText).toBe('Copied!');

      jest.runAllTimers();

      expect(tooltip.innerText).toBe(`'[${NAMESPACE}][selector]'`);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    it('should remove event listeners', async () => {
      const wrapper = getWrapper({
        hubbleOptions: { defaultSelectorType: 'attr', enableSelectorPicker: true },
        selector: 'selector',
      });

      wrapper.vm.$hubble.environment = 'woot';

      jest.spyOn(document, 'removeEventListener');
      await wrapper.vm.$forceUpdate();

      wrapper.vm.$hubble.environment = defaultConfig.environment;

      expect(document.removeEventListener).toHaveBeenCalledWith('mouseover', expect.anything());
      jest.spyOn(document, 'addEventListener');

      await wrapper.vm.$forceUpdate();

      expect(document.addEventListener).toHaveBeenCalledWith('mouseover', expect.anything());
    });

    it('should remove event listeners', () => {
      jest.spyOn(document, 'removeEventListener');

      const wrapper = getWrapper({
        hubbleOptions: { defaultSelectorType: 'attr', enableSelectorPicker: true },
        selector: 'selector',
      });

      wrapper.unmount();

      expect(document.removeEventListener).toHaveBeenCalledWith('mouseover', expect.anything());
    });
  });
});
