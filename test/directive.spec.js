import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '../src';
import { get } from '../src/directive';

Vue.use(VueHubble);

beforeEach(() => {
  process.env.NODE_ENV = 'test';
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

  it('should handle reactive attr selectors', done => {
    let wrapper = mount({
      data() {
        return {
          selector: 'selector'
        };
      },
      template: '<div><span v-hubble="selector"></span></div>'
    });

    expect(wrapper.find('[selector]').exists()).toBe(true);

    wrapper.setData({
      selector: ''
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('[selector]').exists()).toBe(false);
      done();
    });
  });

  it('should handle reactive class selectors', done => {
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

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.new').exists()).toBe(true);
      done();
    });
  });

  it('should handle reactive class selectors starting empty', done => {
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

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.new').exists()).toBe(true);
      done();
    });
  });

  it('should handle reactive invalid selectors starting empty', done => {
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

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.new').exists()).toBe(false);
      done();
    });
  });

  it('should handle reactive invalid selectors', done => {
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

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.new').exists()).toBe(false);
      done();
    });
  });

  describe('get', () => {
    it('should correctly handle defaults', () => {
      expect(get({}, ['foo'], 'bar')).toBe('bar');
      expect(get({}, ['foo'])).toBe(undefined);
    });
  });
});
