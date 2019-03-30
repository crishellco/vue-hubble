import directive from './directive';

function install(Vue) {
  Vue.directive('hubble', directive);
}

export default install;
export { directive };

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}
