import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '../src';
import { getClosingComment, getOpeningComment, getGenericSelector } from './directive';

describe('install.js', () => {
  beforeEach(() => {
    global.console.warn = jest.fn();
    process.env.NODE_ENV = 'test';
    Vue.use(VueHubble, { defaultSelectorType: 'class', environment: ['development', 'test'] });
    Vue.prototype.$hubble.prefix = '';
  });

  it('should allow the namespace to be set', () => {
    const wrapper = mount({
      hubble: {
        namespace: 'test'
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.find('.test--selector').exists()).toBe(true);
  });

  it('should handle an invalid defaultSelectorType to be set', () => {
    Vue.prototype.$hubble.defaultSelectorType = 'invalid';

    const wrapper = mount({
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.find('[selector]').exists()).toBe(true);
    expect(global.console.warn).toHaveBeenCalledWith(
      'invalid is not a valid selector type, using attr instead'
    );
  });

  it('should allow the defaultSelectorType to be set', () => {
    Vue.prototype.$hubble.defaultSelectorType = 'class';
    Vue.prototype.$hubble.prefix = 'qa';

    process.env.NODE_ENV = 'development';

    const wrapper = mount({
      hubble: {
        namespace: 'test'
      },
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.find('.qa--test--selector').exists()).toBe(true);
  });

  it('should allow the enableComments to be set to false', () => {
    Vue.prototype.$hubble.enableComments = false;

    const value = 'selector';
    const selector = getGenericSelector(Vue.prototype, value);
    const closingComment = getClosingComment(selector);
    const openingComment = getOpeningComment(selector);

    const wrapper = mount({
      template: `<div><div v-hubble="'${value}'" /></div>`
    });

    expect(wrapper.find(`.${selector}`).exists()).toBe(true);
    expect(wrapper.html().indexOf(`<!--${openingComment}-->`)).toBe(-1);
    expect(wrapper.html().indexOf(`<!--${closingComment}-->`)).toBe(-1);
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

    expect(wrapper.find('.parent--child--selector').exists()).toBe(false);
    expect(wrapper.find('.child--selector').exists()).toBe(true);
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

    expect(wrapper.find('.parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.child--selector').exists()).toBe(false);
  });

  it('should properly prefix selectors', () => {
    Vue.prototype.$hubble.prefix = 'qa';

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
            template: '<div v-hubble="\'selector\'">child</div>',
            hubble: {
              namespace: 'child'
            }
          }
        }
      }
    );
    expect(wrapper.find('.qa--parent--child--selector').exists()).toBe(true);
    expect(wrapper.find('.qa--child--selector').exists()).toBe(false);
  });
});
