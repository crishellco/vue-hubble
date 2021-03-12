'use strict';

const CLOSING_COMMENT = '//';
const DATASET_KEY = 'vueHubbleSelector';
const NAMESPACE = 'vue-hubble';

const get = (obj, path, defaultValue) => {
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

const getClosingComment = querySelector => {
  return `${CLOSING_COMMENT} ${querySelector}`;
};

const getComponentNamespace = component => {
  const config = get(component.$options, ['hubble'], {});

  return typeof config === 'string' ? config : config.namespace;
};

const getGenericSelector = (context, value) => {
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

const getOpeningComment = querySelector => {
  return `${querySelector}`;
};

const getQuerySelector = (selector, selectorType) => {
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

const handleComments = ({ newQuerySelector, oldQuerySelector, element, value, parent }) => {
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

const handleHook = (element, { arg, value, oldValue }, { context }) => {
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

const handleHubbleSelector = ({
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

const handleNamespaceAttribute = ({
  element,
  oldSelector,
  newSelector,
  newQuerySelector
}) => {
  oldSelector && element.removeAttribute(NAMESPACE);
  element.setAttributeNode(element.ownerDocument.createAttribute(NAMESPACE));
  element.dataset[DATASET_KEY] = newSelector ? newQuerySelector : '';
};

const removeExistingCommentElements = ({ nodes, element, parent, oldQuerySelector }) => {
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

var directive = {
  bind: handleHook,
  inserted: handleHook,
  update: handleHook
};

const api = {
  all() {
    return [...document.querySelectorAll(`[${NAMESPACE}]`)];
  },

  allMapped() {
    return mapResults(this.all());
  },

  find(selector) {
    return [
      ...document.querySelectorAll(`[${NAMESPACE}][${selector}]`),
      ...document.querySelectorAll(`[${NAMESPACE}][class*="${selector}"]`),
      ...document.querySelectorAll(`[${NAMESPACE}][id*="${selector}"]`)
    ];
  },

  findMapped(selector) {
    return mapResults(this.find(selector));
  }
};

function mapResults(nodes) {
  return [...nodes].reduce((result, node) => {
    return {
      ...result,
      [node.dataset[DATASET_KEY]]: node
    };
  }, {});
}

let installed = false;

const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  environment: 'test',
  prefix: ''
};

function install(Vue, options = {}) {
  Vue.prototype.$hubble = Object.assign(defaultConfig, options);
  Vue.prototype.$hubble.environment = [].concat(Vue.prototype.$hubble.environment);

  if (!installed) {
    window.$hubble = api;

    Vue.directive('hubble', directive);
    installed = true;
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

module.exports = install;
