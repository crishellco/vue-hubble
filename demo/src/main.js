import Vue from 'vue';
import Hubble from '../../src';
import App from './App.vue';

Vue.use(Hubble);

Vue.config.productionTip = false;

new Vue({
  render: function(h) {
    return h(App);
  }
}).$mount('#app');
