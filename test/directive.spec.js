import { mount } from '@vue/test-utils';
import Vue from 'vue';
import VueHubble from '../src';

Vue.use(VueHubble);

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('directive.js', () => {
  it('should add an attribute selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:attr="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('[selector]')).toBe(true);
  });

  it('should add a class selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:class="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('.selector')).toBe(true);
  });

  it('should add an id selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble:id="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('#selector')).toBe(true);
  });

  it('should not add a selector if NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'not-test';

    const wrapper = mount({
      template: '<div><span v-hubble:id="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('#selector')).toBe(false);
  });

  it('should use component tree to namespace the selector', () => {
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

    expect(wrapper.contains('[parent--child--selector]')).toBe(true);
  });

  it('', done => {
    let wrapper = mount({
      data() {
        return {
          selector: 'selector'
        };
      },
      template: '<div><span v-hubble="selector"></span></div>'
    });

    expect(wrapper.contains('[selector]')).toBe(true);

    wrapper.setData({
      selector: ''
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.contains('[selector]')).toBe(false);
      done();
    });
  });

  it('', done => {
    let wrapper = mount({
      data() {
        return {
          selector: 'old'
        };
      },
      template: '<div><span v-hubble:class="selector"></span></div>'
    });

    expect(wrapper.contains('.old')).toBe(true);

    wrapper.setData({
      selector: 'new'
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.contains('.new')).toBe(true);
      done();
    });
  });

  it('', done => {
    let wrapper = mount({
      data() {
        return {
          selector: ''
        };
      },
      template: '<div><span v-hubble:class="selector"></span></div>'
    });

    expect(wrapper.contains('.new')).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.contains('.new')).toBe(true);
      done();
    });
  });

  it('', done => {
    let wrapper = mount({
      data() {
        return {
          selector: ''
        };
      },
      template: '<div><span v-hubble:fake="selector"></span></div>'
    });

    expect(wrapper.contains('.new')).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.contains('.new')).toBe(false);
      done();
    });
  });

  it('', done => {
    let wrapper = mount({
      data() {
        return {
          selector: 'old'
        };
      },
      template: '<div><span v-hubble:fake="selector"></span></div>'
    });

    expect(wrapper.contains('.old')).toBe(false);

    wrapper.setData({
      selector: 'new'
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.contains('.new')).toBe(false);
      done();
    });
  });
});
