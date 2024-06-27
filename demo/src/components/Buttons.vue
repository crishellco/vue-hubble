<template>
  <div>
    <button v-hubble="'submit'">Submit</button>
    <button v-hubble="'cancel'">Cancel</button>
  </div>
</template>

<script>
export default {
  name: 'Buttons',

  setup() {
    const hubble = 'buttons';

    return {
      hubble,
    };
  },
};
</script>

<style scoped>
button {
  margin: 10px;
}
</style>
