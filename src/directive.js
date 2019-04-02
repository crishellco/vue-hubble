import _ from 'lodash';

function getRealValue(context, value) {
  const namespace = _.get(context, '$options.hubble.namespace');

  return namespace ? `${namespace}--${value}` : value;
}

function handleHook(element, { arg, value, oldValue }, { context }) {
  if (process.env.NODE_ENV !== 'test') return;

  oldValue = getRealValue(context, oldValue);
  value = getRealValue(context, value);

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

export default {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook,
};
