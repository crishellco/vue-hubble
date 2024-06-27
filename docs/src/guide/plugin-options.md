# Plugin Options

| Name                     | Type              | Default | Description                                                                                                                           |
| ------------------------ | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultSelectorType`    | `string`          | `attr`  | Defines the selector type if not passed into the directive `v-hubble:attr`                                                            |
| `enableComments`         | `boolean`         | `false` | Enables or disables comments around elements with hubble selectors                                                                    |
| `enableDeepNamespacing`  | `boolean`         | `true`  | Enables or disables auto recursive namespacing                                                                                        |
| `enableSelectorPicker`   | `boolean`         | `false` | Enables or disables the selector picker feature                                                                                       |
| `environment`            | `string or array` | `test`  | Defines the environment(s) in which these selectors are added                                                                         |
| `enableGroupedSelectors` | `boolean`         | `true`  | Enables or disables grouping the `vue-hubble-selector` attribute value with `[vue-hubble]`                                            |
| `prefix`                 | `string`          | `''`    | Prefixes all selectors with the value and `--`, if value exists. For example, if `prefix = 'qa'`, all selectors well begin with`qa--` |
