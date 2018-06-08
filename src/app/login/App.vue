<template lang="pug">
  #app
    .mui-content
      .box
        .logo
          img(src="../../assets/logo.png")


</template>
<style lang="stylus" scoped>
  @import "login.styl"
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
      openWindow:myMethods.openWindow
    }
  }
</script>
