import { default as directive } from './directive';
import api from './api';

let installed = false;

export const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  enableSelectorPicker: false,
  environment: 'test',
  includeHubblePrefix: true,
  prefix: '',
};

function install(Vue, options = {}) {
  if (!installed) {
    const merged = Object.assign(defaultConfig, options);
    merged.environment = [].concat(merged.environment);

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
    installed = true;
  }
}

export default install;

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
