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
  align-items center
  background-color #6366f1
  display flex
  height 3rem
  justify-content center

  a
    color white
</style>

<style lang="stylus">
.navbar
  background-color #fff
  border-bottom 1px solid $borderColor
  box-sizing border-box
  height $navbarHeight
  left 0
  position fixed
  right 0
  top 3rem
  z-index 20

.sidebar
  top 6.6rem
</style>
