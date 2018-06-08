<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 意见反馈
    .mui-content
      .box.cell-row
        textarea(v-model="advice", placeholder="请写下您的意见或建议", maxlength="200")
        .word-num {{advice.length}}/200
      .tip.cell-row 每一条反馈我们都会认真对待，感谢您的宝贵意见~

      button.mid-btn 提交



</template>
<style lang="stylus" scoped>
  @import "advice.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'advice',
    data() {
      return {
        advice: '',
      }
    },
    components: {},
    mounted() {

    },
    created() {
    },
    methods: {

    }
  }
</script>
