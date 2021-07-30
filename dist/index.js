'use strict';

const CLOSING_COMMENT = '//';
const DATASET_KEY = 'vueHubbleSelector';
const NAMESPACE = 'vue-hubble';

const get = (obj, path, defaultValue) => {
  const travel = (regexp) =>
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

const getClosingComment = (querySelector) => {
  return `${CLOSING_COMMENT} ${querySelector}`;
};

const getComponentNamespace = (component) => {
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
      .filter((namespace) => !!namespace)
      .reverse()
      .join('--')
  );
};

const getOpeningComment = (querySelector) => {
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

const handleUpdate = async (element, { arg, value, oldValue }, { context }) => {
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
    newQuerySelector,
  });
};

const handleHubbleSelector = ({ arg, element, oldSelector, newSelector, newQuerySelector }) => {
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

const handleNamespaceAttribute = ({ element, oldSelector, newSelector, newQuerySelector }) => {
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

const addTooltip = (target, id) => {
  const { top, left, width } = target.getBoundingClientRect();
  const selector = target.getAttribute('data-vue-hubble-selector');
  const text = `'${selector}'`;
  const tooltip = document.createElement('span');

  tooltip.style.position = 'fixed';
  tooltip.style.padding = '6px 10px';
  tooltip.style.background = '#374151';
  tooltip.style.borderRadius = '2px';
  tooltip.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)';
  tooltip.style.color = '#A5B4FC';
  tooltip.style.fontWeight = '400';
  tooltip.style.userSelect = 'all';
  tooltip.style.zIndex = '99999999';
  tooltip.style.cursor = 'pointer';
  tooltip.style.fontSize = '16px';
  tooltip.style.fontFamily = 'monospace';
  tooltip.style.whiteSpace = 'nowrap';
  tooltip.style.textAlign = 'center';
  tooltip.innerText = text;
  tooltip.setAttribute('data-vue-hubble-tooltip-id', id);
  tooltip.setAttributeNode(tooltip.ownerDocument.createAttribute(`${NAMESPACE}-tooltip`));

  document.body.appendChild(tooltip);

  tooltip.style.width = `${tooltip.offsetWidth}px`;
  tooltip.style.left = `${Math.min(
    window.innerWidth - tooltip.offsetWidth,
    Math.max(0, left + width / 2 - tooltip.offsetWidth / 2)
  )}px`;
  tooltip.style.top = `${Math.min(
    window.outerHeight - tooltip.offsetHeight,
    Math.max(0, top - tooltip.offsetHeight)
  )}px`;

  tooltip.addEventListener('click', () => {
    document.execCommand('copy');
    tooltip.innerText = 'Copied!';
    setTimeout(() => {
      tooltip.innerText = text;
    }, 1000);
  });
};

const addHighlight = (target, id) => {
  const highlight = document.createElement('div');
  const { top, left, height, width } = target.getBoundingClientRect();

  highlight.style.position = 'fixed';
  highlight.style.width = `${width}px`;
  highlight.style.height = `${height}px`;
  highlight.style.left = `${left}px`;
  highlight.style.top = `${top}px`;
  highlight.style.pointerEvents = 'none';
  highlight.style.zIndex = '99999998';
  highlight.style.background = 'rgba(99, 102, 241, .1)';
  highlight.style.border = '1px solid #6366F1';
  highlight.setAttribute('data-vue-hubble-highlight-id', id);

  document.body.appendChild(highlight);
};

const handleMouseover = (element, id) => (event) => {
  const { target } = event;
  const oldTooltip = document.querySelector(`[data-vue-hubble-tooltip-id="${id}"]`);
  const oldHighlight = document.querySelector(`[data-vue-hubble-highlight-id="${id}"]`);
  const shouldRender = target === element || target === oldTooltip || element.contains(target);

  if (!shouldRender) {
    oldTooltip && oldTooltip.remove();

    return oldHighlight && oldHighlight.remove();
  }

  if (oldTooltip) return;

  addTooltip(element, id);
  addHighlight(element, id);
};

const handleBind = async (element, _, { context }) => {
  if (!context.$hubble.enableSelectorPicker) return;

  const id = Math.random().toString(36).substr(2, 11);

  element.setAttribute('data-vue-hubble-id', id);
  document.addEventListener('mouseover', handleMouseover(element, id));
};

const handleUnbind = async (element, _, { context }) => {
  if (!context.$hubble.enableSelectorPicker) return;

  document.removeEventListener('mouseover', handleMouseover(element, element.getAttribute('data-vue-hubble-id')));
};

var directive = {
  bind: handleBind,
  inserted: handleUpdate,
  update: handleUpdate,
  unbind: handleUnbind,
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
      ...document.querySelectorAll(`[${NAMESPACE}][id*="${selector}"]`),
    ];
  },

  findMapped(selector) {
    return mapResults(this.find(selector));
  },
};

function mapResults(nodes) {
  return [...nodes].reduce((result, node) => {
    return {
      ...result,
      [node.dataset[DATASET_KEY]]: node,
    };
  }, {});
}

let installed = false;

const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  enableSelectorPicker: false,
  environment: 'test',
  prefix: '',
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
