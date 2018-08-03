<template lang="pug">
  div
    .none
      i.iconfont(:class="icon")
      span {{msg}}
    button.mid-btn(v-if="remakeDo", @tap="remake") 重新尝试
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
      icon: {
        type: String,
        default: 'icon-wuwangluo',
      },
      msg: {
        type: String,
        default:'服务突然抽风了，请查看网络设置或稍候重试~'
      },
      remakeDo: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {}
    },
    methods: {
      remake() {
        this.$parent.getData();
      }
    }
  }
</script>
