const get = (obj, path, defaultValue) => {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => {
        return res !== null && res !== undefined ? res[key] : res;
      }, obj);

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  return result === undefined || result === obj ? defaultValue : result;
};

const getRealValue = (context, value) => {
  if (!value) return '';

  const namespaces = [value];
  let namespace = get(context.$options, ['hubble', 'namespace']);

  if (namespace) {
    let $component = context;

    do {
      const namespace = get($component.$options, ['hubble', 'namespace']);

      if (namespace) {
        namespaces.push(namespace);
      }
      $component = $component.$parent;
    } while ($component);
  }

  return namespaces.reverse().join('--');
};

const handleHook = (element, { arg, value, oldValue }, { context }) => {
  if (!context.$hubble.environment.includes(process.env.NODE_ENV)) return;

  oldValue = getRealValue(context, oldValue);
  value = getRealValue(context, value);

  arg = arg || context.$hubble.defaultSelectorType;

  switch (arg) {
    case 'class':
      oldValue && element.classList.remove(oldValue);
      value && element.classList.add(value);
      break;

    case 'id':
      element.id = value;
      break;

    case 'attr':
      oldValue && element.removeAttribute(oldValue);
      value && element.setAttributeNode(element.ownerDocument.createAttribute(value));
      break;

    default:
      console.warn(`${arg} is not a value selector type, using attr instead`);
      oldValue && element.removeAttribute(oldValue);
      value && element.setAttributeNode(element.ownerDocument.createAttribute(value));
      break;
  }
};

export default {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook
};
