# Selector Picker

The Selector Picker is similar to the element picker in Chrome Dev Tools, except it shows a tooltip
(which copies the Vue-Hubble selector when clicked) when you
hover over an element which has Vue-Hubble applied.

## Preview

![selector-picker](https://user-images.githubusercontent.com/1878509/127924941-3e5e2d41-ed80-4892-a98d-2b210cd2a514.gif)

## Enable Selector Picker

You can enable the selector three ways:

__1. Use the [Vue Hubble Official Browser Extension](https://chrome.google.com/webstore/detail/vue-hubble/kgmcnpoibbdnlheneapenlckppkfhejh/related)__

__2. Set `enableSelectorPicker` to `true` when installing Vue-Hubble__

```javascript
Vue.use(VueHubble, { enableSelectorPicker: true });
```

__3. Use the console in dev tools to set `window.$hubble.options.enableSelectorPicker` to `true`__

```javascript
$ window.$hubble.options.enableSelectorPicker = true;