import Vue from 'vue';
import Hubble from '../../plugin/src';
import App from './App.vue';

Vue.use(Hubble, { enableSelectorPicker: true, prefix: 'demo' });

Vue.config.productionTip = false;

new Vue({
  render: function(h) {
    return h(App);
  },
}).$mount('#app');
