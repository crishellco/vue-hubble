import { default as directive } from './directive';
import api from './api';

let installed = false;

const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  enableSelectorPicker: false,
  environment: 'test',
  prefix: '',
};

function install(Vue, options = {}) {
  Vue.prototype.$hubble = Object.assign(defaultConfig, options);
  Vue.prototype.$hubble.environment = [].concat(Vue.prototype.$hubble.environment);

  if (!installed) {
    window.$hubble = {
      ...api,
      options: Vue.prototype.$hubble,
    };

    Vue.directive('hubble', directive);
    installed = true;
  }
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
