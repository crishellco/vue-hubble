# Getting Started

## Install Package

```bash
yarn add -D @crishellco/vue-hubble
```

## Add The Plugin To Your App

See the [Plugin Options](/guide/plugin-options.md) docs for more info.

```javascript
import VueHubble from '@crishellco/vue-hubble';

const options = {
  defaultSelectorType: 'attr',
  enableComments: false,
  enableDeepNamespacing: true,
  enableSelectorPicker: false,
  environment: 'test',
  enableGroupedSelectors: true,
  prefix: '',
};

Vue.use(VueHubble, options);
```
