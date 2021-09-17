# Advanced

## Deep Namespacing

If the [plugin option](/guide/plugin-options) `enableDeepNamespacing` is `true` (default), Vue Hubble will automatically
namespace all selectors in a given component by using it's own and it's ancestral
component namespaces. Deep namespacing recurses up the component
tree, ignoring missing or empty namespace values, to create
a selector prefixed by joined(`--` delimiter)
ancestral namespaces.

### Generated Selector Naming Convention

`{parent namespace}--{child namespace}--{directive hubble selector}`

### Example

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

## Shallow Namespacing

If the [plugin option](/guide/plugin-options) `enableDeepNamespacing` is `false`, Vue Hubble will automatically namespace
all selectors in a given component by using only it's own component namespace.

### Example

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