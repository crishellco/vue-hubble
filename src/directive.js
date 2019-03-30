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

export default {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook,
};
