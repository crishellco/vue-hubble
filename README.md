# Vue Hubble

![Build](https://github.com/crishellco/vue-hubble/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/crishellco/vue-hubble/branch/master/graph/badge.svg?token=IKcXpNL84k)](https://codecov.io/gh/crishellco/vue-hubble)
[![Maintainability](https://api.codeclimate.com/v1/badges/e1f2536b9be3c32e6fef/maintainability)](https://codeclimate.com/github/crishellco/vue-hubble/maintainability)

A better way to select elements for UI testing in Vue.

Vue Hubble makes it simple to add selectors (only in your testing environment)
and target component elements in tests without worrying
about collisions, extraneous classes, etc.

Check out the [demo](https://vue-hubble.netlify.app/)

## Table of Contents

* [Getting Started](#getting-started)
  * [Install Package](#install-package)
  * [Add The Plugin To Your App](#add-the-plugin-to-your-app)
* [Plugin Options](#plugin-options)
* [Usage](#usage)
  * [Directive](#directive)
    * [Template Example](#template-example)
    * [Resulting Markup](#resulting-markup)
  * [Writing Tests](#writing-tests)
* [Advanced](#advanced)
  * [Deep Namespacing](#deep-namespacing)
    * [Generated Selector Naming Convention](#generated-selector-naming-convention)
    * [Example](#example)
  * [Shallow Namespacing](#shallow-namespacing)
    * [Example](#example-1)
* [Api](#api)
  * [window.$hubble.all(): HTMLElement\[\]](#windowhubbleall-htmlelement)
  * [window.$hubble.allMapped(): { \[string\]: HTMLElement }](#windowhubbleallmapped--string-htmlelement-)
  * [window.$hubble.find(string selector): HTMLElement\[\]](#windowhubblefindstring-selector-htmlelement)
  * [window.$hubble.findMapped(string selector): { \[string\]: HTMLElement }](#windowhubblefindmappedstring-selector--string-htmlelement-)
  * [window.$hubble.first(string selector): HTMLElement | undefined](#windowhubblefirststring-selector-htmlelement--undefined)
  * [window.$hubble.options: { \[string\]: Array | Boolean | String }](#windowhubbleoptions--string-array--boolean--string-)
* [Selector Picker](#selector-picker)
  * [Preview](#preview)
  * [Enable Selector Picker](#enable-selector-picker)
* [Lint](#lint)
* [Test](#test)
* [Build Dist](#build-dist)
* [How to Contribute](#how-to-contribute)
  * [Pull Requests](#pull-requests)
* [License](#license)

## Getting Started

### Install Package

```bash
yarn add -D @crishellco/vue-hubble
```

### Add The Plugin To Your App

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

## Plugin Options

| Name                     | Type              | Default | Description                                                                                                                           |
| ------------------------ | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultSelectorType`    | `String`          | `attr`  | Defines the selector type if not passed into the directive `v-hubble:attr`                                                            |
| `enableComments`         | `Boolean`         | `false` | Enables or disables comments around elements with hubble selectors                                                                    |
| `enableDeepNamespacing`  | `Boolean`         | `true`  | Enables or disables auto recursive namespacing                                                                                        |
| `enableSelectorPicker`   | `Boolean`         | `false` | Enables or disables the selector picker feature                                                                                       |
| `environment`            | `String or Array` | `test`  | Defines the environment(s) in which these selectors are added                                                                         |
| `enableGroupedSelectors` | `Boolean`         | `true`  | Enables or disables grouping the `vue-hubble-selector` attribute value with `[vue-hubble]`                                            |
| `prefix`                 | `String`          |         | Prefixes all selectors with the value and `--`, if value exists. For example, if `prefix = 'qa'`, all selectors well begin with`qa--` |

## Usage

### Directive

Use the directive to add test selectors to elements you wish to test.

#### Template Example

```html
<template>
  <!-- Attribute selectors are recommended as class and ID selectors are susceptible to collisions -->

  <!-- Generates a selector of type `options.defaultSelectorType` (default is attr) -->
  <div v-hubble="'attribute-selector'"></div>

  <!-- Generates an attribute selector -->
  <div v-hubble:attr="'explicit-attribute-selector'"></div>

  <!-- Generates a class selector -->
  <div v-hubble:class="'class-selector'"></div>

  <!-- Generates an id selector -->
  <div v-hubble:id="'id-selector'"></div>
</template>
```

#### Resulting Markup

```html
<div vue-hubble-selector="[vue-hubble][attribute-selector]" vue-hubble attribute-selector></div>

<div vue-hubble-selector="[vue-hubble][explicit-attribute-selector]" vue-hubble explicit-attribute-selector></div>

<div vue-hubble-selector="[vue-hubble].class-selector" vue-hubble class="class-selector"></div>

<div vue-hubble-selector="[vue-hubble]#id-selector" vue-hubble id="id-selector"></div>
```

### Writing Tests

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

## Advanced

### Deep Namespacing

If the install option `enableDeepNamespacing` is `true` (default), Vue Hubble will automatically
namespace all selectors in a given component by using it's own and it's ancestral
component namespaces. Deep namespacing recurses up the component
tree, ignoring missing or empty namespace values, to create
a selector prefixed by joined(`--` delimiter)
ancestral namespaces.

#### Generated Selector Naming Convention

`{parent namespace}--{child namespace}--{directive hubble selector}`

#### Example

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

<div vue-hubble-selector="[vue-hubble][login--form--attribute-selector]" vue-hubble login--form--attribute-selector></div>
```

### Shallow Namespacing

If the install option `enableDeepNamespacing` is `false`, Vue Hubble will automatically namespace
all selectors in a given component by using only it's own component namespace.

#### Example

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

<div vue-hubble-selector="[vue-hubble][form--attribute-selector]" vue-hubble form--attribute-selector></div>
```

## Api

### window.$hubble.all(): HTMLElement\[]

Gets all elements with hubble selectors.

### window.$hubble.allMapped(): { \[string]: HTMLElement }

Gets all elements with hubble selectors, mapped by selector.

### window.$hubble.find(string selector): HTMLElement\[]

Finds all elements with hubble selectors matching the passed selector.

### window.$hubble.findMapped(string selector): { \[string]: HTMLElement }

Finds all elements with hubble selectors matching the passed selector, mapped by selector.

### window.$hubble.first(string selector): HTMLElement | undefined

Finds the first element with hubble selectors matching the passed selector.

### window.$hubble.options: { \[string]: Array | Boolean | String }

The plugin options values.

## Selector Picker

The Selector Picker is similar to the element picker in Chrome Dev Tools, except it shows a tooltip
(which copies the Vue-Hubble selector when clicked) when you
hover over an element which has Vue-Hubble applied.

### Preview

![selector-picker](https://user-images.githubusercontent.com/1878509/127924941-3e5e2d41-ed80-4892-a98d-2b210cd2a514.gif)

### Enable Selector Picker

You can enable the selector three ways:

__1. Use the [Vue Hubble Official Browser Extension](https://chrome.google.com/webstore/detail/vue-hubble/kgmcnpoibbdnlheneapenlckppkfhejh/related)__

__2. Set `enableSelectorPicker` to `true` when installing Vue-Hubble__

```javascript
Vue.use(VueHubble, { enableSelectorPicker: true });
```

__3. Use the console in dev tools to set `window.$hubble.options.enableSelectorPicker` to `true`__

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
1. Create a new branch for each feature or improvement
1. Please follow [semantic-release commit format](https://semantic-release.gitbook.io/semantic-release/#commit-message-format)
1. Send a pull request from each feature branch to the __develop__ branch

## License

[MIT](http://opensource.org/licenses/MIT)
