# Vue Hubble

[![Codeship Status for crishellco/vue-hubble](https://app.codeship.com/projects/383cff90-34f0-0137-f652-2a9cdaeb53f1/status?branch=master)](https://app.codeship.com/projects/332739)
![](badges/badge-branches.svg)
![](badges/badge-functionss.svg)
![](badges/badge-lines.svg)
![](badges/badge-statements.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/e1f2536b9be3c32e6fef/maintainability)](https://codeclimate.com/github/crishellco/vue-hubble/maintainability)

A better way to select elements for UI testing in Vue.

Vue Hubble makes it simple to add selectors (only in your testing environment) and target component elements in tests without worrying about collisions, extraneous classes, etc.

## Install

```bash
yarn add -D vue-hubble
# or
npm i -D vue-hubble
```

```javascript
import VueHubble from 'vue-hubble';

Vue.use(VueHubble, options);
```

## Usage

#### Implementation

```html
<template>
  <div v-hubble="'attribute-selector'"></div>
  <div v-hubble:class="'class-selector'" class="existing-class"></div>
  <div v-hubble:id="'id-selector'" id="existing-id"></div>
</template>

<!-- Resulting HTML when NODE_ENV === 'test' -->
<div attribute-selector></div>
<div class="existing-class class-selector"></div>
<div id="id-selector"></div>
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

<!-- Resulting HTML when NODE_ENV equals correct environment (see install options)-->
<div login--form--attribute-selector></div>
```

#### Writing Tests

[Examples](test/directive.spec.js)

```javascript
describe('directive.js', () => {
  it('should add an attribute selector', () => {
    const wrapper = mount({
      template: '<div><span v-hubble="\'selector\'"></span></div>'
    });

    expect(wrapper.contains('[selector]')).toBe(true);
  });
});
```

#### Install Options

| Name                    | Type              | Default | Description                                                                |
| ----------------------- | ----------------- | ------- | -------------------------------------------------------------------------- |
| `defaultSelectorType`   | `String`          | `attr`  | Defines the selector type if not passed into the directive `v-hubble:attr` |
| `enableDeepNamespacing` | `Boolean`         | `true`  | Enables or disables auto recursive namespacing                             |
| `environment`           | `String or Array` | `test`  | Defines the environment(s) in which these selectors are added              |

## Lint

```bash
yarn lint
```

## Test

```bash
yarn test
```

## Build Dist

```bash
yarn build
```

## How to Contribute

### Pull Requests

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Send a pull request from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
