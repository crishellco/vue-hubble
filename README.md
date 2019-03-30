# Vue Hubble
[![Codeship Status for crishellco/vue-hubble](https://app.codeship.com/projects/383cff90-34f0-0137-f652-2a9cdaeb53f1/status?branch=master)](https://app.codeship.com/projects/332739)

A better way to select elements for UI testing in Vue.

Vue Hubble makes it simple to add selectors and target component elements in tests without worrying about collisions, extranous classes, etc.

**Only if `NODE_ENV === 'test'` will the selectors be added.**

## Install

```bash
yarn add -D vue-hubble
# or
npm i -D vue-hubble
```

```javascript
import VueHubble from 'vue-hubble';

Vue.use(VueHubble);
```

## Usage

#### Implementation
```html
<div v-hubble="'attribute-selector'"></div>
<div v-hubble:class="'class-selector'" class="existing-class"></div>
<div v-hubble:id="'id-selector'" id="existing-id"></div>
```

#### Result
```html
<div attribute-selector></div>
<div class="existing-class class-selector"></div>
<div id="id-selector"></div>
```

#### Tests
[Examples](test/directive.spec.js)

## Lint
```bash
yarn lint
```

## Test
```bash
yarn test
```

## How to Contribute

### Pull Requests

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Send a pull request from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
