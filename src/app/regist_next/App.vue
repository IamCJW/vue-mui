<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 新用户注册
    .mui-content
      .box
        .input-group
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入密码" minlength="6")
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请再次输入")
        button.mid-btn.disabled 注册
</template>
<style lang="stylus" scoped>
  @import "regist_next.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'login',
    data() {
      return {
      }
    },
    mounted() {

    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {

      },//打开页面
      openWindow:myMethods.openWindow,
    }
  }
</script>
