const CLOSING_COMMENT = '//';
const COMMENT_PREFIX = '(vue-hubble)';

export const get = (obj, path, defaultValue) => {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => {
        // istanbul ignore next
        return res !== null && res !== undefined ? res[key] : res;
      }, obj);

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  return result === undefined || result === obj ? defaultValue : result;
};

const getComponentNamespace = component => {
  const config = get(component.$options, ['hubble'], {});

  return typeof config === 'string' ? config : config.namespace;
};

export const getClosingComment = selector => {
  return `${CLOSING_COMMENT}${COMMENT_PREFIX} ${selector}`;
};

export const getOpeningComment = selector => {
  return `${COMMENT_PREFIX} ${selector}`;
};

export const getSelector = (context, value) => {
  if (!value) return '';

  const namespaces = [value];
  let enableDeepNamespacing = context.$hubble.enableDeepNamespacing;
  let namespace = getComponentNamespace(context);

  if (!enableDeepNamespacing) {
    namespaces.push(namespace);
  } else {
    let $component = context;

    do {
      const namespace = getComponentNamespace($component);

      if (namespace) {
        namespaces.push(namespace);
      }
      $component = $component.$parent;
    } while ($component);
  }

  return (
    (context.$hubble.prefix ? `${context.$hubble.prefix}--` : '') +
    namespaces
      .filter(namespace => !!namespace)
      .reverse()
      .join('--')
  );
};

const handleHook = (element, { arg, value, oldValue }, { context }) => {
  if (!context.$hubble.environment.includes(process.env.NODE_ENV)) return;

  const newSelector = getSelector(context, value);
  const oldSelector = getSelector(context, oldValue);

  const parent = element.parentElement;

  if (context.$hubble.enableComments && parent) {
    const newClosingComment = getClosingComment(newSelector);
    const newOpeningComment = getOpeningComment(newSelector);
    const oldClosingComment = getClosingComment(oldSelector);
    const oldOpeningComment = getOpeningComment(oldSelector);
    const nodes = parent.childNodes;

    for (let i = 0; i < nodes.length; i++) {
      const nextSibling = nodes[i + 1];
      const prevSibling = nodes[i - 1];

      if (
        nodes[i] === element &&
        nextSibling &&
        nextSibling.nodeType === 8 &&
        nextSibling.textContent === oldClosingComment
      ) {
        parent.removeChild(nextSibling);
      }

      if (
        nodes[i] === element &&
        prevSibling &&
        prevSibling.nodeType === 8 &&
        prevSibling.textContent === oldOpeningComment
      ) {
        parent.removeChild(prevSibling);
      }
    }

    if (value && value.length) {
      const commentAfter = document.createComment(newClosingComment);
      const commentBefore = document.createComment(newOpeningComment);
      parent.insertBefore(commentBefore, element);
      parent.insertBefore(commentAfter, element.nextSibling);
    }
  }

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
