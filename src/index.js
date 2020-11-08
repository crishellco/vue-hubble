import directive from './directive';

let installed = false;

const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: true,
  enableDeepNamespacing: true,
  environment: 'test',
  prefix: ''
};

function install(Vue, options = {}) {
  Vue.prototype.$hubble = Object.assign(defaultConfig, options);
  Vue.prototype.$hubble.environment = [].concat(Vue.prototype.$hubble.environment);

  if (!installed) {
    Vue.directive('hubble', directive);
    installed = true;
  }
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
