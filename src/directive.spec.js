import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '.';
import {
  get,
  getClosingComment,
  getOpeningComment,
  getGenericSelector,
  getQuerySelector,
  NAMESPACE
} from './directive';

Vue.use(VueHubble);

const getWrapper = (type = 'attr', selector = 'selector') => {
  global.console.warn = jest.fn();

  return mount({
    data() {
      return {
        selector
      };
    },
    template: `<div><span v-hubble:${type}="selector"></span></div>`
  });
};

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  Vue.prototype.$hubble.prefix = '';
  Vue.prototype.$hubble.enableComments = false;
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

    expect(wrapper.find(`[${NAMESPACE}][parent--child--selector]`).exists()).toBe(true);
  });
  it('should use component tree to namespace the selector and skip empty namespaces', () => {
    const wrapper = mount(
      {
        hubble: 'parent',
        template: '<div><span><child /></span></div>'
      },
      {
        stubs: {
          child: {
            template: '<div v-hubble="\'selector\'" />'
          }
        }
      }
    );

    expect(wrapper.find(`[${NAMESPACE}][parent--selector]`).exists()).toBe(true);
  });

  it('should handle reactive attr selectors', async () => {
    const prefix = 'qa';
    const value = 'selector';

    Vue.prototype.$hubble.prefix = prefix;
    Vue.prototype.$hubble.enableComments = true;

    const selector = getGenericSelector(Vue.prototype, value);
    const querySelector = getQuerySelector(selector, 'attr');
    const closingComment = getClosingComment(querySelector);
    const openingComment = getOpeningComment(querySelector);

    let wrapper = getWrapper('attr', value);

    expect(wrapper.find(`[${NAMESPACE}][${selector}]`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBeGreaterThan(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBeGreaterThan(-1);

    wrapper.setData({
      selector: ''
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}][${selector}]`).exists()).toBe(false);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
  });

  it('should handle reactive class selectors', async () => {
    let wrapper = getWrapper('class', 'old');

    expect(wrapper.find(`[${NAMESPACE}].old`).exists()).toBe(true);

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(true);
  });

  it('should handle reactive class selectors starting empty', async () => {
    let wrapper = getWrapper('class', '');

    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(true);
  });

  it('should handle reactive invalid selectors starting empty', async () => {
    let wrapper = getWrapper('invalid', '');

    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
    expect(global.console.warn).toHaveBeenCalledWith(
      'invalid is not a valid selector type, using attr instead'
    );

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${NAMESPACE}].new`).exists()).toBe(false);
  });

  it('should handle reactive invalid selectors', async () => {
    let wrapper = getWrapper('invalid', 'old');

    expect(wrapper.find(`[${NAMESPACE}].old`).exists()).toBe(false);
    expect(global.console.warn).toHaveBeenCalledWith(
      'invalid is not a valid selector type, using attr instead'
    );

    wrapper.setData({
      selector: 'new'
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
});
