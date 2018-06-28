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
    .nav-bar
      .nav-item(v-show="sliderIndex === 0")
        img(src="../../assets/guide1_nav.png")
      .nav-item(v-show="sliderIndex === 1")
        img(src="../../assets/guide2_nav.png")
      .nav-item(v-show="sliderIndex === 2", @tap="openWindow()")
        img(src="../../assets/guide3_nav.png")

</template>
<style lang="stylus" scoped>
  @import "guide.styl"
  .mui-slider-item
    width 100%
    img
      width 100%

  .nav-bar
    position absolute
    bottom .3rem
    width 100%
    height .45rem
    z-index 999
    .nav-item
      width 1.9rem
      height .45rem
      margin 0 auto
      img
        width 100%


</style>
<script>
  /* global mui */
  /* global mui plus */
  import {plusKey} from "../../assets/js/locationStorage";
  export default {
    name: 'login',
    data() {
      return {
        image: ['../../assets/ydy.jpg', '../../assets/ydy.jpg', '../../assets/ydy.jpg'],
        sliderIndex: 0,
      }
    },
    mounted() {
      mui.plusReady(function () {
        plus.navigator.setFullscreen(true);
        plus.navigator.closeSplashscreen();
      });
      document.querySelector('.mui-slider').addEventListener('slide', (event) => {
        this.sliderIndex = event.detail.slideNumber
      });
    },
    created() {

    },
    methods: {
      openWindow() {
        mui.plusReady(() => {
          plus.storage.setItem(plusKey.firstOpen, 'true');
          plus.navigator.setFullscreen(false);
          plus.webview.currentWebview().close();
        });
      },
    }
  }
</script>
