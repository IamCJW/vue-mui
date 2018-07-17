<template lang="pug">
  #app
    .mui-content
      .logo
        img(src="../../assets/logo.png")
      .version {{version || '0.0.0'}}
      ul.media-view
        li.media
          .media-content.iconfont
            .media-lable.text-color-black 微信:&nbsp;&nbsp;&nbsp;&nbsp;建设帮招标
        li.media
          .media-content.iconfont
            .media-lable.text-color-black 邮箱:&nbsp;&nbsp;&nbsp;&nbsp;kefu@jsb.red
        li.media
          .media-content.iconfont
            .media-lable.text-color-black 官网:&nbsp;&nbsp;&nbsp;&nbsp;http://www.jsb.red
        li.media
          .media-content.iconfont
            .media-lable.text-color-black 地址:&nbsp;&nbsp;&nbsp;&nbsp;深圳市南山区高新技术产业园W1-A栋515
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black
              a(href='tel:075526656735') 固话:&nbsp;&nbsp;&nbsp;&nbsp;075526656735
      .conpany Copyright&copy;2018-2018&nbsp;&nbsp;深圳市快标科技有限公司

</template>
<style lang="stylus" scoped>
  @import "aboutUS.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'aboutUS',
    data() {
      return {
        version:'',
      }
    },
    mounted() {

    },
    created() {
      let vueThis = this;
      mui.plusReady(()=>{
        vueThis.version = plus.runtime.version;
      });

    },
    methods: {

    }
  }
</script>
