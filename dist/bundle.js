'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function handleHook(element, { arg, value, oldValue }) {
  if (process.env.NODE_ENV !== 'test') return;

  if (arg === 'class') {
    element.classList.remove(oldValue);
    element.classList.add(value);
  } else if (arg === 'id') {
    element.id = value;
  } else {
    element.removeAttribute(oldValue);
    element.setAttributeNode(element.ownerDocument.createAttribute(value));
  }
}

var directive = {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook,
};

function install(Vue) {
  Vue.directive('hubble', directive);
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

exports.default = install;
exports.directive = directive;
