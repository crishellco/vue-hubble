import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '.';
import { get, getClosingComment, getOpeningComment, getSelector } from './directive';

Vue.use(VueHubble);

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  Vue.prototype.$hubble.prefix = '';
});

describe('directive.js', () => {
  it('should add a the v-hubble attribute', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:attr="\'selector\'"></span></div>'
    });

    expect(wrapper.find('[v-hubble]').exists()).toBe(true);
  });

  it('should add an attribute selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:attr="\'selector\'"></span></div>'
    });

    expect(wrapper.find('[selector]').exists()).toBe(true);
  });

  it('should add a class selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:class="\'selector\'"></span></div>'
    });

    expect(wrapper.find('.selector').exists()).toBe(true);
  });

  it('should add an id selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:id="\'selector\'"></span></div>'
    });

    expect(wrapper.find('#selector').exists()).toBe(true);
  });

  it('should not add a selector if NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'not-test';

    const wrapper = mount({
      template: '<div><span v-hubble:id="\'selector\'"></span></div>'
    });

    expect(wrapper.find('#selector').exists()).toBe(false);
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

    expect(wrapper.find('[parent--child--selector]').exists()).toBe(true);
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

    expect(wrapper.find('[parent--selector]').exists()).toBe(true);
  });

  it('should handle reactive attr selectors', async () => {
    const prefix = 'qa';
    const value = 'selector';

    Vue.prototype.$hubble.prefix = prefix;

    const selector = getSelector(Vue.prototype, value);
    const closingComment = getClosingComment(selector);
    const openingComment = getOpeningComment(selector);

    let wrapper = mount({
      data() {
        return {
          value
        };
      },
      template: '<div><span v-hubble="value"></span></div>'
    });

    expect(wrapper.find(`[${selector}]`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBeGreaterThan(0);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBeGreaterThan(0);

    wrapper.setData({
      value: ''
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find(`[${selector}]`).exists()).toBe(false);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
  });

  it('should handle reactive class selectors', async () => {
    let wrapper = mount({
      data() {
        return {
          selector: 'old'
        };
      },
      template: '<div><span v-hubble:class="selector"></span></div>'
    });

    expect(wrapper.find('.old').exists()).toBe(true);

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.new').exists()).toBe(true);
  });

  it('should handle reactive class selectors starting empty', async () => {
    let wrapper = mount({
      data() {
        return {
          selector: ''
        };
      },
      template: '<div><span v-hubble:class="selector"></span></div>'
    });

    expect(wrapper.find('.new').exists()).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.new').exists()).toBe(true);
  });

  it('should handle reactive invalid selectors starting empty', async () => {
    let wrapper = mount({
      data() {
        return {
          selector: ''
        };
      },
      template: '<div><span v-hubble:invalid="selector"></span></div>'
    });

    expect(wrapper.find('.new').exists()).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.new').exists()).toBe(false);
  });

  it('should handle reactive invalid selectors', async () => {
    let wrapper = mount({
      data() {
        return {
          selector: 'old'
        };
      },
      template: '<div><span v-hubble:invalid="selector"></span></div>'
    });

    expect(wrapper.find('.old').exists()).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.new').exists()).toBe(false);
  });

  describe('get', () => {
    it('should correctly handle defaults', () => {
      expect(get({}, ['foo'], 'bar')).toBe('bar');
      expect(get({}, ['foo'])).toBe(undefined);
    });
  });
});
