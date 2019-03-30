'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directive = undefined;

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function install(Vue) {
  Vue.directive('hubble', _directive2.default);
}

exports.default = install;
exports.directive = _directive2.default;


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}