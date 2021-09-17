import { DATASET_KEY, NAMESPACE } from './directive';

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

  first(selector) {
    return this.find(selector).shift();
};

function mapResults(nodes) {
  return [...nodes].reduce((result, node) => {
    return {
      ...result,
      [node.dataset[DATASET_KEY]]: node,
    };
  }, {});
}

export default api;
