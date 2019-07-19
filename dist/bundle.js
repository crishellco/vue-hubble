'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getRealValue(context, value) {
  if (context.$options && context.$options.hubble) {
    const namespace = context.$options.hubble.namespace;
    return namespace ? `${namespace}--${value}` : value;
  } else {
    return value;
  }
}
function handleHook(element, { arg, value, oldValue }, { context }) {
  if (process.env.NODE_ENV !== 'test') return;

  oldValue = getRealValue(context, oldValue);
  value = getRealValue(context, value);

  arg = arg || context.$hubble.defaultSelectorType;

  switch (arg) {
    case 'class':
      element.classList.remove(oldValue);
      element.classList.add(value);
      break;

    case 'id':
      element.id = value;
      break;

    case 'attr':
      element.removeAttribute(oldValue);
      element.setAttributeNode(element.ownerDocument.createAttribute(value));
      break;

    default:
      console.warn(`${arg} is not a value selector type, using attr instead`);
      element.removeAttribute(oldValue);
      element.setAttributeNode(element.ownerDocument.createAttribute(value));
      break;
  }
}

var directive = {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook,
};

let installed = false;

const defaultConfig = {
  defaultSelectorType: 'attr',
};

function install(Vue, options = {}) {
  Vue.prototype.$hubble = Object.assign({}, defaultConfig, options);

  if (!installed) {
    Vue.directive('hubble', directive);
    installed = true;
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

exports.default = install;
exports.directive = directive;
