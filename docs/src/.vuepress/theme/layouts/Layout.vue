<template>
  <div>
    <div class="banner">
      You are viewing the documentation for 4.x (Vue 3.x). For Vue 2.x head over to the&nbsp;<a
        href="https://vue-hubble-3x.crishell.co/"
        >3.x documentation</a
      >
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
  color white
  display flex
  height 3rem
  justify-content center

  a
    color white

    &:hover
      text-decoration underline
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
