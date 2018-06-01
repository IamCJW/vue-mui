<template lang="pug">
  #app
    .header-me
      i.iconfont.icon-management.user-setting
      .user-msg
        div.user-head
          img(src="../../assets/me-default.png")
        .user-name 布鲁斯·李
        .user-loginStation
          span 您还没有登录，请登录>
      .me-nav
        .me-nav-item
          i.iconfont.icon-wallet
          span 钱包
        .me-nav-item
          i.iconfont.icon-coupon
          span 优惠券
        .me-nav-item
          i.iconfont.icon-orders
          span 订单公司
        .me-nav-item
          i.iconfont.icon-Shippingaddress
          span 收货地址
    .mui-content
      .order-box
        .order-title 我的订单
        .order-type-group
          .type-item
            i.iconfont.icon-allorders
            span 全部
          .type-item
            i.iconfont.icon-Pendingpayment
            span 待付款
          .type-item
            i.iconfont.icon-Alreadypaid
            span 已付款
          .type-item
            i.iconfont.icon-completeds
            span 已完成
          .type-item
            i.iconfont.icon-Cancelled
            span 已取消
      ul.media-view.funList
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 系统设置
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 订阅管理
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 我的关注
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 反馈意见
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 关于我们
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 联系客服
</template>
<style lang="stylus" scoped>
  @import "me.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'me',
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
        http({
          url: api.search_company,
          success: (data) => {
            this.companyData = data;
          }
        })
      },//打开页面
      openWindow:myMethods.openWindow
    }
  }
</script>
