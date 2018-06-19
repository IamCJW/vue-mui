<template lang="pug">
  .loading(v-show="showStatus")
    i.iconfont.icon-loading
</template>
<style lang="stylus" scoped>
  @import "../stylus/_mixin.styl"
  .loading
    position absolute
    width 100%
    text-align center
    margin-top .1rem
    z-index $z-index-navigation
    i
      display-inline-flex()
      background #fff
      box-shadow 0 0.03rem 0.03rem rgba(0, 0, 0, .05);
      border-radius 100%
      height .3rem
      width .3rem
      color #04a3ee
      font-size: .24rem
      overflow hidden
      &:before
        animation: rotateAnimation .3s infinite
  @keyframes rotateAnimation
    0%
      transform rotate(0deg)
    100%
      transform rotate(360deg)

</style>
<script>
  export default {
    name: "loading",
    data(){
      return {
        showStatus:false
      }
    },
    methods:{
      show(){
        this.showStatus = true;
      },
      hide(){
        this.showStatus = false;
      }
    }
  }
</script>

<style scoped>

</style>
