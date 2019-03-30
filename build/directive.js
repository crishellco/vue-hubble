'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function handleHook(element, _ref) {
  var arg = _ref.arg,
      value = _ref.value,
      oldValue = _ref.oldValue;

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

exports.default = {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook
};