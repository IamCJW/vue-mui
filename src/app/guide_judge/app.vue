<template lang="pug">
  #app
</template>
<style lang="stylus" scoped>
  @import "guide_judge.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import {plusKey} from "../../assets/js/locationStorage";

  export default {
    name: 'guideJudge',
    data() {
    },
    mounted() {
      mui.plusReady(() => {
        if (plus.storage.getItem(plusKey.firstOpen) !== 'open'){
          plus.storage.setItem(plusKey.firstOpen,'open');
          mui.preload({
            url:"./guide.html",
            id:"guide"
          });
          this.openWindow('guide');
        }else {
          mui.preload({
            url:"./index.html",
            id:"index"
          })
          this.openWindow('index');
        }
      });














    },
    created() {

    },
    methods: {
      openWindow: myMethods.openWindow,
    }
  }
</script>
