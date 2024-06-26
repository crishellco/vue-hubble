# Namespacing

## Deep Namespacing

If the [Plugin Option](/guide/plugin-options.md) `enableDeepNamespacing` is `true` (default),
Vue Hubble will automatically namespace all selectors in a given component by using
it's own and it's ancestral component namespaces. Deep namespacing recurses
up the component tree, ignoring missing or empty namespace values,
to create a selector prefixed by joined(`--` delimiter)
ancestral namespaces.

### Generated Selector Naming Convention

`{parent namespace}--{child namespace}--{directive hubble selector}`

### Example

#### Options API

```html
<!-- Form Component (child) -->
<template>
  <div v-hubble="'attribute-selector'"></div>
</template>

<script>
export default {
  hubble: 'login'
};
</script>

<!-- Login Component (parent) -->
<template>
  <Form />
</template>

<script>
export default {
  hubble: 'login',
  components: {
    Form
  }
};
</script>

<div vue-hubble-selector="[vue-hubble][login--form--attribute-selector]" vue-hubble login--form--attribute-selector></div>
```

#### Composition API

```html
<!-- Form Component (child) -->
<template>
  <div v-hubble="'attribute-selector'"></div>
</template>

<script setup>
const hubble = 'form';
</script>


<!-- Login Component (parent) -->
<template>
  <Form />
</template>

<script setup>
const hubble = 'login';
</script>

<div vue-hubble-selector="[vue-hubble][login--form--attribute-selector]" vue-hubble login--form--attribute-selector></div>
```

## Shallow Namespacing

If the [Plugin Option](/guide/plugin-options.md) `enableDeepNamespacing` is `false`,
Vue Hubble will automatically namespace all selectors in a given
component by using only it's own component namespace.

### Example

#### Options API

```html
<!-- Form Component (child) -->
<template>
  <div v-hubble="'attribute-selector'"></div>
</template>

<script>
export default {
  hubble: 'login'
};
</script>

<!-- Login Component (parent) -->
<template>
  <Form />
</template>

<script>
export default {
  hubble: 'login',
  components: {
    Form
  }
};
</script>

<div vue-hubble-selector="[vue-hubble][form--attribute-selector]" vue-hubble form--attribute-selector></div>
```

#### Composition API
```html
<!-- Form Component (child) -->
<template>
  <div v-hubble="'attribute-selector'"></div>
</template>

<script setup>
const hubble = 'form';
</script>

<!-- Login Component (parent) -->
<template>
  <Form />
</template>

<script setup>
const hubble = 'login';
</script>

<div vue-hubble-selector="[vue-hubble][form--attribute-selector]" vue-hubble form--attribute-selector></div>
```
