<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 个人资料
    .mui-content
      ul.media-view
        li.media
          .media-content 个人资料
        li.media
          .media-content.iconfont.icon-right
            .media-lable 头像
            .media-value
              .user-head
                img(:src="userHeadSrc")
        li.media
          .media-content
            .media-lable 姓名
            .media-value
              input(placeholder='请输入姓名')
        li.media
          .media-content.iconfont.icon-right
            .media-lable 性别
            .media-value 请选择性别
      ul.media-view
        li.media
          .media-content 公司信息
        li.media
          .media-content.iconfont.icon-right
            .media-lable 公司名称
            .media-value 公司名字设置
        li.media
          .media-content.iconfont.icon-right
            .media-lable 资质条件
            .media-value 条件设置
        li.media
          .media-content
            .media-lable 担任职位
            .media-value
              input(placeholder='请输入职位')
        li.media
          .media-content
            .media-lable 固定电话
            .media-value
              input(placeholder='请输入电话')
      .box
        vueCropper(ref="cropper", :img="option.img", :outputSize="option.size", :outputType="option.outputType")
      .button
        button(@tap="a") 截图
</template>
<style lang="stylus" scoped>
  @import "userData.styl"
  .box
    width 100%
    height .6rem
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import Cropper from 'vue-cropper'

  export default {
    name: 'userData',
    data() {
      return {
        userHeadSrc: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/a2cc7cd98d1001e92c517af6b30e7bec55e797dd.jpg',
        option:{
          img:'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/a2cc7cd98d1001e92c517af6b30e7bec55e797dd.jpg',
          size:0.8,
          outputType:'png',
          autoCrop:true
        }
      }
    },
    components: {
      vueCropper:Cropper
    },
    mounted() {

    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.search_company,
          success: (data) => {
            this.companyData = data;
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,
      a(){
        this.$refs.cropper.startCrop()
      }
    }
  }
</script>
