<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" v-hubble="'image'" />
    <hello-world />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  hubble: 'parent',

  components: {
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
