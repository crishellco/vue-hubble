import { default as directive } from './directive';
import api from './api';

export const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  enableSelectorPicker: false,
  environment: 'test',
  enableGroupedSelectors: true,
  prefix: '',
};

function install(Vue, options = {}) {
  const merged = Object.assign(defaultConfig, options);
  merged.environment = [].concat(merged.environment);
  Object.defineProperty(merged, 'NODE_ENV', { value: process.env['NODE_ENV'], writable: false });

  let globalData = new Vue({
    data: { $hubble: merged },
  });

  Vue.mixin({
    computed: {
      $hubble: {
        get() {
          return { ...globalData.$data.$hubble };
        },

        set($hubble) {
          globalData.$data.$hubble = {
            ...$hubble,
            environment: [].concat($hubble.environment),
          };
        },
      },
    },
  });

  window.$hubble = {
    ...api,
    options: globalData.$data.$hubble,
  };

  Vue.directive('hubble', directive);
}

export default install;

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
