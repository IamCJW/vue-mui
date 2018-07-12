<template lang="pug">
  #app
    .mui-content(@swiperight="openTabNav('search',2)")
      ul.media-view.funList
        li.media(@tap="openNViewPreload('changePwd')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 修改密码
        li.media(@tap="openNViewPreload('changePhone')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 修改手机号
        li.media(@tap="openNViewPreload('safety')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 微信绑定
        li.media(@tap="openNViewPreload('systemSetting')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black QQ绑定
</template>
<style lang="stylus" scoped>
  @import "safety.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {plusKey} from "../../assets/js/locationStorage";

  export default {
    name: 'safety',
    data() {
      return {

      }
    },
    mounted() {

    },
    created() {

    },
    methods: {
      //数据请求
      getData() {

      },//打开页面
      openNViewPreload:myMethods.openNViewPreload,
    }
  }
</script>
