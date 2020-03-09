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

const getSelector = (context, value) => {
  if (!value) return '';

  const namespaces = [value];
  let enableDeepNamespacing = context.$hubble.enableDeepNamespacing;
  let namespace = get(context.$options, ['hubble', 'namespace']);

  if (namespace) {
    if (!enableDeepNamespacing) {
      namespaces.push(namespace);
    } else {
      let $component = context;

      do {
        const namespace = get($component.$options, ['hubble', 'namespace']);

        if (namespace) {
          namespaces.push(namespace);
        }
        $component = $component.$parent;
      } while ($component);
    }
  }

  return namespaces.reverse().join('--');
};

const handleHook = (element, { arg, value, oldValue }, { context }) => {
  if (!context.$hubble.environment.includes(process.env.NODE_ENV)) return;

  const oldSelector = getSelector(context, oldValue);
  const newSelector = getSelector(context, value);

  arg = arg || context.$hubble.defaultSelectorType;

  oldSelector && element.removeAttribute('v-hubble');
  newSelector && element.setAttributeNode(element.ownerDocument.createAttribute('v-hubble'));

  switch (arg) {
    case 'class':
      oldSelector && element.classList.remove(oldSelector);
      newSelector && element.classList.add(newSelector);
      break;

    case 'id':
      element.id = newSelector;
      break;

    case 'attr':
      oldSelector && element.removeAttribute(oldSelector);
      newSelector && element.setAttributeNode(element.ownerDocument.createAttribute(newSelector));
      break;

    default:
      console.warn(`${arg} is not a valid selector type, using attr instead`);
      oldSelector && element.removeAttribute(oldSelector);
      newSelector && element.setAttributeNode(element.ownerDocument.createAttribute(newSelector));
      break;
  }
};

export default {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook
};
