import { createApp, h } from 'vue';

import App from './App.vue';
import Hubble from '../../plugin/src';

const app = createApp({
  name: 'DemoMain',

  render() {
    return h(App);
  },
});

app.use(Hubble, { enableSelectorPicker: true, environment: ['development', 'production', 'test'], prefix: 'demo' });
app.mount('#app');
