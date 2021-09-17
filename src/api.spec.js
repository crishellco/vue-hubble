import { mount } from '@vue/test-utils';
import Vue from 'vue';

import VueHubble from '.';
import api from './api';
import { getQuerySelector } from './directive';

Vue.use(VueHubble);

process.env.NODE_ENV = 'test';

const attachTo = document.createElement('div');
document.body.appendChild(attachTo);

const wrapper = mount(
  {
    template: `
  <div>
    <span v-hubble:attr="'attribute-selector'"></span>
    <span v-hubble:class="'class-selector'" id="first-class"></span>
    <span v-hubble:class="'class-selector'"></span>
    <span v-hubble:id="'id-selector'"></span>
  </div>
  `,
  },
  { attachTo }
);

describe('api.js', () => {
  it('all', () => {
    const nodes = api.all();

    expect(nodes.length).toBe(4);
    expect(nodes[0].outerHTML.indexOf('attribute-selector')).toBeGreaterThan(-1);
  });

  it('allMapped', () => {
    const nodes = api.allMapped();

    expect(nodes[getQuerySelector('attribute-selector', 'attr')]).toBeTruthy();
  });

  it('find', () => {
    expect(api.find('id-selector').length).toBe(1);
    expect(api.find('not-a-selector').length).toBe(0);
  });

  it('findMapped', () => {
    expect(api.findMapped('id-selector')[getQuerySelector('id-selector', 'id')]).toBeTruthy();

  it('first', () => {
    expect(api.find('class-selector').length).toBe(2);
  });
});
