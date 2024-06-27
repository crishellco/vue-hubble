<template>
  <div id="app">
    <img v-hubble="'image'" alt="Vue logo" src="./assets/logo.png" />
    <hello-world v-hubble="'hello-world'">
      <buttons v-hubble="'buttons'" />
    </hello-world>
  </div>
</template>

<script>
import Buttons from './components/Buttons.vue';
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'DemoApp',

  hubble: 'parent',

  components: {
    Buttons,
    HelloWorld,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
