import { watch } from 'vue';
export const CLOSING_COMMENT = '//';
export const NAMESPACE = 'vue-hubble';

const COPY_MESSAGE_RESET_TIMEOUT = 1000;

let $hubble;

export const get = (obj, path, defaultValue) => {
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

export const inCorrectEnvironment = (instance, vnode) => {
  const $hubble = get(instance, '$hubble', get(vnode, 'ctx.setupState.$hubble'));

  return $hubble.environment.includes(process.env.NODE_ENV);
};

export const selectorPickerEnabled = (instance) => {
  return get(instance.$hubble, ['enableSelectorPicker'], false);
};

export const getClosingComment = (querySelector) => {
  return `${CLOSING_COMMENT} ${querySelector}`;
};

export const getComponentNamespace = (component) => {
  const config = get(component.$options, ['hubble'], {});

  return typeof config === 'string' ? config : config.namespace;
};

export const getGenericSelector = (instance, value) => {
  if (!value) return '';

  const namespaces = [value];
  const enableDeepNamespacing = instance.$hubble.enableDeepNamespacing;
  const namespace = getComponentNamespace(instance);

  if (!enableDeepNamespacing) {
    namespaces.push(namespace);
  } else {
    let $component = instance;

    do {
      const namespace = getComponentNamespace($component);

      if (namespace) {
        namespaces.push(namespace);
      }
      $component = $component.$parent;
    } while ($component);
  }

  return (
    (instance.$hubble.prefix ? `${instance.$hubble.prefix}--` : '') +
    namespaces
      .filter((namespace) => !!namespace)
      .reverse()
      .join('--')
  );
};

export const getOpeningComment = (querySelector) => {
  return `${querySelector}`;
};

export const getQuerySelector = (selector, selectorType, instance) => {
  const prefix = instance.$hubble.enableGroupedSelectors ? `[${NAMESPACE}]` : '';

  switch (selectorType) {
    case 'class':
      return `${prefix}.${selector}`;
    case 'id':
      return `${prefix}#${selector}`;
    case 'attr':
      return `${prefix}[${selector}]`;
    default:
      return `${prefix}[${selector}]`;
  }
};

export const handleComments = ({ newQuerySelector, oldQuerySelector, element, value, parent }) => {
  const newClosingComment = getClosingComment(newQuerySelector);
  const newOpeningComment = getOpeningComment(newQuerySelector);
  const nodes = parent.childNodes;

  removeExistingCommentElements({ element, nodes, oldQuerySelector, parent });

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

export const handleMountedAndUpdated = async (element, { instance, arg, value, oldValue }, vnode) => {
  if (!inCorrectEnvironment(instance, vnode)) {
    if (element.hubbleMouseover) {
      document.removeEventListener('mouseover', element.hubbleMouseover);
      element.hubbleMouseover = undefined;
    }

    return;
  }

  if (!element.hubbleMouseover) {
    const id = Math.random().toString(36).substr(2, 11);

    element.hubbleMouseover = handleMouseover(instance, element, id);
    document.addEventListener('mouseover', element.hubbleMouseover);
  }

  arg = arg || instance.$hubble.defaultSelectorType;

  const parent = element.parentElement;
  const newSelector = getGenericSelector(instance, value);
  const oldSelector = getGenericSelector(instance, oldValue);
  const newQuerySelector = getQuerySelector(newSelector, arg, instance);
  const oldQuerySelector = getQuerySelector(oldSelector, arg, instance);

  if (instance.$hubble.enableComments && parent) {
    handleComments({ element, newQuerySelector, oldQuerySelector, parent, value });
  } else if (parent) {
    const nodes = parent.childNodes;

    removeExistingCommentElements({ element, nodes, oldQuerySelector, parent });
  }

  handleNamespaceAttribute({ element, newQuerySelector, newSelector, oldSelector });
  handleHubbleSelector({
    arg,
    element,
    newQuerySelector,
    newSelector,
    oldSelector,
  });
};

export const handleHubbleSelector = ({ arg, element, oldSelector, newSelector, newQuerySelector }) => {
  switch (arg) {
    case 'class':
      oldSelector && element.classList.remove(oldSelector);
      if (newSelector) {
        element.classList.add(newSelector);
        element.setAttribute(`${NAMESPACE}-selector`, newQuerySelector);
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

export const handleNamespaceAttribute = ({ element, oldSelector, newSelector, newQuerySelector }) => {
  oldSelector && element.removeAttribute(NAMESPACE);
  element.setAttributeNode(element.ownerDocument.createAttribute(NAMESPACE));
  element.setAttribute(`${NAMESPACE}-selector`, newSelector ? newQuerySelector : '');
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

export const getTooltip = (selector) => {
  return `'${selector}'`;
};

export const addTooltip = (target, id) => {
  const { top, left, width } = target.getBoundingClientRect();
  const selector = target.getAttribute(`${NAMESPACE}-selector`);
  const text = getTooltip(selector);
  const tooltip = document.createElement('span');

  tooltip.style.position = 'fixed';
  tooltip.style.padding = '6px';
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
  tooltip.setAttribute(`${NAMESPACE}-tooltip-id`, id);
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
    }, COPY_MESSAGE_RESET_TIMEOUT);
  });
};

export const addHighlight = (target, id) => {
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
  highlight.style.border = '2px solid #6366F1';
  highlight.setAttribute(`${NAMESPACE}-highlight-id`, id);

  document.body.appendChild(highlight);
};

export const handleMouseover = (instance, element, id) => (event) => {
  const { target } = event;
  const oldTooltip = document.querySelector(`[${NAMESPACE}-tooltip-id="${id}"]`);
  const oldHighlight = document.querySelector(`[${NAMESPACE}-highlight-id="${id}"]`);
  const shouldRender = target === element || target === oldTooltip || element.contains(target);

  if (!shouldRender || !selectorPickerEnabled(instance)) {
    oldTooltip && oldTooltip.remove();

    return oldHighlight && oldHighlight.remove();
  }

  if (oldTooltip) return;

  addTooltip(element, id, instance);
  addHighlight(element, id);
};

export const handleCreated = async (element, { instance }, vnode) => {
  !instance.hubbleUnwatch &&
    (instance.hubbleUnwatch = watch(
      $hubble,
      function () {
        instance.$forceUpdate();
      },
      { deep: true }
    ));

  if (!inCorrectEnvironment(instance, vnode)) return;

  const id = Math.random().toString(36).substr(2, 11);

  element.hubbleMouseover = handleMouseover(instance, element, id);

  document.addEventListener('mouseover', element.hubbleMouseover);
};

export const handleUnmounted = (element, { instance }) => {
  element.hubbleMouseover && document.removeEventListener('mouseover', element.hubbleMouseover);
  instance.hubbleUnwatch && instance.hubbleUnwatch();
};

export default ($h) => {
  $hubble = $h;

  return {
    created: handleCreated,
    mounted: handleMountedAndUpdated,
    unmounted: handleUnmounted,
    updated: handleMountedAndUpdated,
  };
};
