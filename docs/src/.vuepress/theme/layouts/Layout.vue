<template>
  <div>
    <div class="banner">
      <a href="https://vue-hubble.crishell.co/">Vue Hubble 4.0 has been released for Vue 3 🚀</a>
    </div>
    <ParentLayout />
  </div>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue';

export default {
  name: 'Layout',

  components: { ParentLayout },

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="stylus" scoped>
.banner
  height 3rem
  display flex
  justify-content center
  align-items center
  background-color #6366f1

  a
    color white
</style>

<style lang="stylus">
.navbar
  position fixed
  z-index 20
  top 3rem
  left 0
  right 0
  height $navbarHeight
  background-color #fff
  box-sizing border-box
  border-bottom 1px solid $borderColor

.sidebar
  top 6.6rem
</style>
