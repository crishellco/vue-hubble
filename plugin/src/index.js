import { reactive } from 'vue';

import api from './api';
import { default as directive } from './directive';

export const defaultConfig = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  enableGroupedSelectors: true,
  enableSelectorPicker: false,
  environment: 'test',
  prefix: '',
};

export default function install(vue, options = {}) {
  const merged = { ...defaultConfig, ...options };
  merged.environment = [].concat(merged.environment);
  Object.defineProperty(merged, 'NODE_ENV', { value: process.env.NODE_ENV, writable: false });

  let $hubble = reactive(merged);

  vue.mixin({
    computed: {
      $hubble: {
        get() {
          return $hubble;
        },

        set($h) {
          $hubble = {
            ...$h,
            environment: [].concat($h.environment),
          };
        },
      },
    },
  });

  window.$hubble = {
    ...api({ ...merged }),
    options: $hubble,
  };

  vue.directive('hubble', directive($hubble));
}
