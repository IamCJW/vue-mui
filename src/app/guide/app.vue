<template lang="pug">
  #app
    .mui-slider.mui-fullscreen
      .mui-slider-group
        .mui-slider-item
          a(href="#")
            img.guider-img(src="../../assets/guide1.jpg")
        .mui-slider-item
          a(href="#")
            img.guider-img(src="../../assets/guide2.jpg")
        .mui-slider-item
          a(href="#")
            img.guider-img(src="../../assets/guide3.jpg")

</template>
<style lang="stylus" scoped>
  @import "guide.styl"
    .mui-slider-item
      width 100%
      img
        width 100%



</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'

  export default {
    name: 'login',
    data() {
      return {
        image: ['../../assets/ydy.jpg', '../../assets/ydy.jpg', '../../assets/ydy.jpg']
      }
    },
    mounted() {

    },
    created() {

    },
    methods: {
      openWindow: myMethods.openWindow,

    }
  }
</script>
