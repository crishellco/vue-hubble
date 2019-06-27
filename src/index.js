import _ from 'lodash';

import directive from './directive';

let installed = false;

const defaultConfig = {
  defaultSelectorType: 'attr',
};

function install(Vue, options = {}) {
  Vue.prototype.$hubble = _.defaults(options, defaultConfig);

  if (!installed) {
    Vue.directive('hubble', directive);
    installed = true;
  }
}

export default install;
export { directive };

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
