# Vue Hubble

![Build](https://github.com/crishellco/vue-hubble/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/crishellco/vue-hubble/branch/master/graph/badge.svg?token=IKcXpNL84k)](https://codecov.io/gh/crishellco/vue-hubble)
[![Maintainability](https://api.codeclimate.com/v1/badges/e1f2536b9be3c32e6fef/maintainability)](https://codeclimate.com/github/crishellco/vue-hubble/maintainability)

A better way to select elements for UI testing in Vue.

Vue Hubble makes it simple to add selectors (only in your testing environment) and target component elements in tests without worrying about collisions, extraneous classes, etc.

## Install

```bash
yarn add -D @crishellco/vue-hubble
# or
npm i -D @crishellco/vue-hubble
```

```javascript
import VueHubble from '@crishellco/vue-hubble';

Vue.use(VueHubble, options);
```

## Usage

#### Implementation

```html
<template>
  <!-- Attribute selectors are recommended as class and ID selectors are susceptible to collisions -->
  <div v-hubble="'attribute-selector'"></div>
  <div v-hubble:class="'class-selector'"></div>
  <div v-hubble:id="'id-selector'"></div>
</template>
```
#### Result

```html
<!-- The data-vue-hubble-selector attribute makes it easy to copy the full selector to your clipboard -->
<div attribute-selector vue-hubble data-vue-hubble-selector="[vue-hubble][attribute-selector]"></div>
<div class="class-selector" vue-hubble data-vue-hubble-selector="[vue-hubble].class-selector"></div>
<div id="id-selector" vue-hubble data-vue-hubble-selector="[vue-hubble]#id-selector"></div>
```

#### Namespacing

Hubble gives you the ability to namespace all selectors in a given component. Namespacing is recursive up the component tree, ignoring missing or empty namespace values. This feature is enabled by default, but can be disabled via install options.

```html
<!-- Form Component (child) -->
<template>
  <div v-hubble="'attribute-selector'"></div>
</template>

<script>
  export default {
    hubble: {
      namespace: 'form'
    }
  };
</script>

<!-- Login Component (parent) -->
<template>
  <form />
</template>

<script>
  export default {
    components: {
      Form
    },
    hubble: {
      namespace: 'login'
    }
    /**
     * Or shorthand...
     * hubble: 'login'
     **/
  };
</script>

<div login--form--attribute-selector vue-hubble data-vue-hubble-selector="[vue-hubble][login--form--attribute-selector]"></div>
```

#### Writing Tests

[Examples](src/directive.spec.js)

```javascript
describe('directive.js', () => {
  it('should add an attribute selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('[vue-hubble][selector]')).toBe(true);
  });
});
```

#### Install Options

| Name                    | Type              | Default | Description                                                                                                                           |
|-------------------------|-------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSelectorType`   | `String`          | `attr`  | Defines the selector type if not passed into the directive `v-hubble:attr`                                                            |
| `enableComments`        | `Boolean`         | `false` | Enables or disables comments around elements with hubble selectors                                                                    |
| `enableDeepNamespacing` | `Boolean`         | `true`  | Enables or disables auto recursive namespacing                                                                                        |
| `enableSelectorPicker`  | `Boolean`         | `false` | Enables or disables the selector picker feature                                                                                       |
| `environment`           | `String or Array` | `test`  | Defines the environment(s) in which these selectors are added                                                                         |
| `prefix`                | `String`          |         | Prefixes all selectors with the value and `--`, if value exists. For example, if `prefix = 'qa'`, all selectors well begin with`qa--` |

## Api

#### window.$hubble.all(): HTMLElement[]

Gets all elements with hubble selectors.

#### window.$hubble.allMapped(): { [string]: HTMLElement }

Gets all elements with hubble selectors, mapped by selector.

#### window.$hubble.find(string selector): HTMLElement[]

Finds all elements with hubble selectors matching the passed selector.

#### window.$hubble.findMapped(string selector): { [string]: HTMLElement }

Finds all elements with hubble selectors matching the passed selector, mapped by selector.

## Selector Picker

The Selector Picker is similar to the element picker in Chrome Dev Tools, except it shows a tooltip (which copies the Vue-Hubble selector when clicked) when you hover over an element which has Vue-Hubble applied. 

### Preview

![selector-picker](https://user-images.githubusercontent.com/1878509/127924941-3e5e2d41-ed80-4892-a98d-2b210cd2a514.gif)


### Enable Selector Picker

You can enable the selector three ways:

**1. Use the [Vue Hubble Official Browser Extension](https://crishellco.github.io/vue-hubble-browser-extension/)**

**2. Set `enableSelectorPicker` to `true` when installing Vue-Hubble**

``` javascript
Vue.use(VueHubble, { enableSelectorPicker: true });
```

**3. Use the console in dev tools to set `window.$hubble.options.enableSelectorPicker` to `true`**

```javascript
$ window.$hubble.options.enableSelectorPicker = true;
```

## Lint

```bash
yarn lint:js
```

## Test

```bash
yarn test:unit
```

## Build Dist

```bash
yarn build
```

## How to Contribute

### Pull Requests

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Please follow [semantic-release commit format](https://semantic-release.gitbook.io/semantic-release/#commit-message-format)
4. Send a pull request from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
