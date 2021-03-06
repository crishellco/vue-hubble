export const CLOSING_COMMENT = '//';
export const DATASET_KEY = 'vueHubbleSelector';
export const NAMESPACE = 'vue-hubble';

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

export const getClosingComment = querySelector => {
  return `${CLOSING_COMMENT} ${querySelector}`;
};

export const getComponentNamespace = component => {
  const config = get(component.$options, ['hubble'], {});

  return typeof config === 'string' ? config : config.namespace;
};

export const getGenericSelector = (context, value) => {
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

export const getOpeningComment = querySelector => {
  return `${querySelector}`;
};

export const getQuerySelector = (selector, selectorType) => {
  switch (selectorType) {
    case 'class':
      return `[${NAMESPACE}].${selector}`;
    case 'id':
      return `[${NAMESPACE}]#${selector}`;
    case 'attr':
      return `[${NAMESPACE}][${selector}]`;
    default:
      return `[${NAMESPACE}][${selector}]`;
  }
};

export const handleComments = ({ newQuerySelector, oldQuerySelector, element, value, parent }) => {
  const newClosingComment = getClosingComment(newQuerySelector);
  const newOpeningComment = getOpeningComment(newQuerySelector);
  const nodes = parent.childNodes;

  removeExistingCommentElements({ nodes, element, parent, oldQuerySelector });

  /**
   * Add new opening and closing comment elements
   */
  if (value && value.length) {
    const commentAfter = document.createComment(newClosingComment);
    const commentBefore = document.createComment(newOpeningComment);

    parent.insertBefore(commentBefore, element);
    parent.insertBefore(commentAfter, element.nextSibling);
  }
};

export const handleHook = (element, { arg, value, oldValue }, { context }) => {
  if (!context.$hubble.environment.includes(process.env.NODE_ENV)) return;

  arg = arg || context.$hubble.defaultSelectorType;

  const parent = element.parentElement;
  const newSelector = getGenericSelector(context, value);
  const oldSelector = getGenericSelector(context, oldValue);

  const newQuerySelector = getQuerySelector(newSelector, arg);
  const oldQuerySelector = getQuerySelector(oldSelector, arg);

  if (context.$hubble.enableComments && parent) {
    handleComments({ newQuerySelector, oldQuerySelector, element, value, parent });
  }

  handleNamespaceAttribute({ element, oldSelector, newSelector, newQuerySelector });
  handleHubbleSelector({
    arg,
    element,
    oldSelector,
    newSelector,
    newQuerySelector
  });
};

export const handleHubbleSelector = ({
  arg,
  element,
  oldSelector,
  newSelector,
  newQuerySelector
}) => {
  switch (arg) {
    case 'class':
      oldSelector && element.classList.remove(oldSelector);
      if (newSelector) {
        element.classList.add(newSelector);
        element.dataset[DATASET_KEY] = newQuerySelector;
      }
      break;

    case 'id':
      element.id = newSelector;
      break;

    case 'attr':
      oldSelector && element.removeAttribute(oldSelector);
      if (newSelector) {
        element.setAttributeNode(element.ownerDocument.createAttribute(newSelector));
      }
      break;

    default:
      console.warn(`${arg} is not a valid selector type, using attr instead`);
      oldSelector && element.removeAttribute(oldSelector);
      if (newSelector) {
        element.setAttributeNode(element.ownerDocument.createAttribute(newSelector));
      }
      break;
  }
};

export const handleNamespaceAttribute = ({
  element,
  oldSelector,
  newSelector,
  newQuerySelector
}) => {
  oldSelector && element.removeAttribute(NAMESPACE);
  element.setAttributeNode(element.ownerDocument.createAttribute(NAMESPACE));
  element.dataset[DATASET_KEY] = newSelector ? newQuerySelector : '';
};

export const removeExistingCommentElements = ({ nodes, element, parent, oldQuerySelector }) => {
  const oldClosingComment = getClosingComment(oldQuerySelector);
  const oldOpeningComment = getOpeningComment(oldQuerySelector);

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
};

export default {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook
};
