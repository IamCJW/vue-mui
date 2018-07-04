<template lang="pug">
  .none(v-if="show")
    i.iconfont(:class="icon")
    span {{msg}}
</template>
<style lang="stylus" scoped>
  @import "../stylus/_mixin.styl"
  .none
    width 100%
    height 100vw
    display-flex()
    flex-direction(column)
    flex-align-item(center)
    flex-justify-content(center)
    color $text-color-light-xxx
    line-height 1
    .iconfont
      font-size 1.5rem
      margin-bottom .12rem
</style>
<script>
  export default {
    name: "warn",
    props: {
      icon:{
        type:String,
        require:true
      },
      msg:{
        type:String,
        require:true
      },
      show:{
        require:true
      }
    },
    data(){
      return{

      }
    },
    methods: {

    }
  }
</script>
