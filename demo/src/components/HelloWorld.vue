<template>
  <div class="hello">
    <h1 v-hubble="'header'">Hover over elements to see and copy selectors</h1>
    <code v-hubble="'command'">$ yarn serve --mode test</code>
    <div style="position: fixed; bottom: 0; right: 0; padding: 1rem">
      <button v-hubble="'submit'">Submit</button>
    </div>
    <div style="position: fixed; bottom: 0; left: 0; padding: 1rem">
      <button v-hubble="'cancel'">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoHelloWorld',

  hubble: 'child',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
