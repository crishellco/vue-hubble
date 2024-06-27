# Usage

## Directive

Use the directive to add test selectors to elements you wish to test.

### Template Example

```vue
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

### Resulting Markup

```html
<div vue-hubble-selector="[vue-hubble][attribute-selector]" vue-hubble attribute-selector></div>

<div vue-hubble-selector="[vue-hubble][explicit-attribute-selector]" vue-hubble explicit-attribute-selector></div>

<div vue-hubble-selector="[vue-hubble].class-selector" vue-hubble class="class-selector"></div>

<div vue-hubble-selector="[vue-hubble]#id-selector" vue-hubble id="id-selector"></div>
```

## Writing Tests

[Examples](https://github.com/crishellco/vue-hubble/blob/master/plugin/src/directive.spec.js)

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
