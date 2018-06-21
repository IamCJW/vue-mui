<template lang="pug">
  #app
    .header-me
      .user-setting(@tap="openDetail('userData')") 个人资料
      .user-msg
        div.user-head
          img(src="../../assets/me-default.png")
        .user-name {{userData.name || '用户昵称'}}
        .user-loginStation(@tap="openDetail('login')")
          span 您还没有登录，请登录>
      .me-nav
        .me-nav-item(@tap="openDetail('wallet')")
          i.iconfont.icon-wallet
          span 钱包
        .me-nav-item(@tap="openDetail('coupon')")
          i.iconfont.icon-coupon
          span 优惠券
        .me-nav-item(@tap="openDetail('orderCompany')")
          i.iconfont.icon-orders
          span 订单公司
        .me-nav-item(@tap="openDetail('address')")
          i.iconfont.icon-Shippingaddress
          span 收货地址
    .mui-content
      .order-box
        .order-title 我的订单
        .order-type-group
          .type-item(@tap="openDetail('order',{type:1})")
            i.iconfont.icon-allorders
            span 全部
          .type-item(@tap="openDetail('order',{type:2})")
            i.iconfont.icon-Pendingpayment
            span 待付款
          .type-item(@tap="openDetail('order',{type:3})")
            i.iconfont.icon-Alreadypaid
            span 已付款
          .type-item(@tap="openDetail('order',{type:4})")
            i.iconfont.icon-completeds
            span 已完成
          .type-item(@tap="openDetail('order',{type:5})")
            i.iconfont.icon-Cancelled
            span 已取消
      ul.media-view.funList
        li.media(@tap="openDetail('systemSetting')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 系统设置
        li.media(@tap="openDetail('subscription')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 订阅管理
        li.media(@tap="openDetail('follow')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 我的关注
        li.media(@tap="openWindowNView('advice')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 反馈意见
        li.media(@tap="openDetail('aboutUs')")
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
        userData: {}
      }
    },
    mounted() {
      let arr = ['coupon','userData','orderCompany','address','order','systemSetting','subscription','follow','wallet','aboutUs'];
      myMethods.NVpreload(arr);
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_info,
          success: (data) => {
            this.userData = data;
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,//打开详情
      openWindowNView:myMethods.openWindowNView,
      //跳转详情
      openDetail(url, data) {
        mui.plusReady(function () {
          let detailPage = plus.webview.getWebviewById(url);
          if (!detailPage) {
            mui.toast('目标正在初始化，请稍候~');
            return;
          }
          mui.fire(detailPage, 'getData', data);
          myMethods.openWindow(url);
        });
      },
    }
  }
</script>
