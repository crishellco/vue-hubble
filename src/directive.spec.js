import { mount } from '@vue/test-utils';
import Vue from 'vue';
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

Vue.use(VueHubble);

const getWrapper = (type = 'attr', selector = 'selector', overrides = {}) => {
  global.console.warn = jest.fn();

  const wrapper = mount({
    attachToDocument: true,
    data() {
      return {
        selector,
      };
    },
    beforeMount() {
      this.$hubble = { ...defaultConfig, ...overrides };
    },
    template: `<div><span v-hubble:${type}="selector"><span v-hubble:${type}="'child'"></span></span></div>`,
  });

  return wrapper;
};

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('directive.js', () => {
  it(`should add a the ${NAMESPACE} attribute`, () => {
    const wrapper = getWrapper();

    expect(wrapper.find(`[${NAMESPACE}]`).exists()).toBe(true);
  });

  it('should add an attribute selector', () => {
    const wrapper = getWrapper();

    expect(wrapper.find(`[${NAMESPACE}][selector]`).exists()).toBe(true);
  });

  it('should add a class selector', () => {
    const wrapper = getWrapper('class');

    expect(wrapper.find(`[${NAMESPACE}].selector`).exists()).toBe(true);
  });

  it('should add an id selector', () => {
    const wrapper = getWrapper('id');

    expect(wrapper.find(`[${NAMESPACE}]#selector`).exists()).toBe(true);
  });

  it('should not add a selector if NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'not-test';

    const wrapper = getWrapper();

    expect(wrapper.find(`[${NAMESPACE}]#selector`).exists()).toBe(false);
  });

  it('should use component tree to namespace the selector', () => {
    const wrapper = mount(
      {
        hubble: 'parent',
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

    expect(wrapper.find(`[${NAMESPACE}][parent--child--selector]`).exists()).toBe(true);
  });
  it('should use component tree to namespace the selector and skip empty namespaces', () => {
    const wrapper = mount(
      {
        hubble: 'parent',
        template: '<div><span><child /></span></div>',
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />',
          },
        },
      }
    );

    expect(wrapper.find(`[${NAMESPACE}][parent--selector]`).exists()).toBe(true);
  });

  it('should handle reactive attr selectors', async () => {
    const prefix = 'qa';
    const value = 'selector';

    const wrapper = getWrapper('attr', value, { prefix, enableComments: true });

    const selector = getGenericSelector(wrapper.vm, value);
    const querySelector = getQuerySelector(selector, 'attr');
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
    const wrapper = getWrapper('class', 'old');

    expect(wrapper.find(`[${NAMESPACE}].old`).exists()).toBe(true);

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(true);
  });

  it('should handle reactive class selectors starting empty', async () => {
    const wrapper = getWrapper('class', '');

    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(true);
  });

  it('should handle reactive invalid selectors starting empty', async () => {
    const wrapper = getWrapper('invalid', '');

    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
    expect(global.console.warn).toHaveBeenCalledWith('invalid is not a valid selector type, using attr instead');

    wrapper.setData({
      selector: 'new',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
  });

  it('should handle reactive invalid selectors', async () => {
    const wrapper = getWrapper('invalid', 'old');

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
        view: window,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'target', { value: element.element, enumerable: true });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      expect(document.querySelector(`[${NAMESPACE}-tooltip]`)).toBeNull();
    });

    it('should render if enableSelectorPicker is true', async () => {
      const wrapper = getWrapper(undefined, undefined, { enableSelectorPicker: true });

      const element = wrapper.find(`[${NAMESPACE}][selector]`);

      const event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'target', { value: element.element, enumerable: true });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      expect(document.querySelector(`[${NAMESPACE}-tooltip]`)).toBeTruthy();
    });

    it('should render if a child is hovered over', async () => {
      const wrapper = getWrapper(undefined, undefined, { enableSelectorPicker: true });

      const element = wrapper.find(`[${NAMESPACE}][child]`);

      const event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'target', { value: element.element, enumerable: true });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      expect(document.querySelector(`[${NAMESPACE}-tooltip]`)).toBeTruthy();
    });

    it('should copy the selector to clipboard', async () => {
      document.execCommand = jest.fn();

      const wrapper = getWrapper(undefined, undefined, { enableSelectorPicker: true });

      const element = wrapper.find(`[${NAMESPACE}][selector]`);

      const event = new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(event, 'target', { value: element.element, enumerable: true });

      document.dispatchEvent(event);

      await wrapper.vm.$nextTick();

      const tooltip = document.querySelector(`[${NAMESPACE}-tooltip]`);

      tooltip.click();
      expect(tooltip.innerText).toBe('Copied!');

      jest.runAllTimers();

      expect(tooltip.innerText).toBe(`'[${NAMESPACE}][selector]'`);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    it('should remove event listeners', () => {
      jest.spyOn(document, 'removeEventListener');

      const wrapper = getWrapper();

      wrapper.$hubble = {
        ...wrapper.$hubble,
        enableSelectorPicker: true,
      };

      wrapper.destroy();

      expect(document.removeEventListener).toHaveBeenCalledWith('mouseover', expect.anything());
    });
  });
});
