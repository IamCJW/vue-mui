<template lang="pug">
  #app
    .header-me(@swiperight="openTabNav('search',2)")
      .user-setting(@tap="openNViewPreload('userData')") 个人资料
      .user-msg
        div.user-head
          img(:src="userData.icon || './static/me-default.png'")
        .user-name(v-show="!loginState") 用户昵称
        .user-name(v-show="loginState") {{userData.name || '匿名'}}
        .user-loginStation(@tap="openWindow('login')", v-show="!loginState")
          span 您还没有登录，请登录>
        .user-loginStation(v-show="loginState")
          span 您的账户已上线~
      .me-nav
        .me-nav-item(@tap="openNViewPreload('wallet')")
          i.iconfont.icon-wallet
          span 钱包
        .me-nav-item(@tap="openNViewPreload('coupon')")
          i.iconfont.icon-coupon
          span 优惠券
        .me-nav-item(@tap="openNViewPreload('orderCompany')")
          i.iconfont.icon-orders
          span 订单公司
        .me-nav-item(@tap="openNViewPreload('address')")
          i.iconfont.icon-Shippingaddress
          span 收货地址
    .mui-content(@swiperight="openTabNav('search',2)")
      .order-box
        .order-title 我的订单
        .order-type-group
          .type-item(@tap="openNViewPreload('order',{type:1})")
            i.iconfont.icon-allorders
            span 全部
          .type-item(@tap="openNViewPreload('order',{type:2})")
            i.iconfont.icon-Pendingpayment
            span 待付款
          .type-item(@tap="openNViewPreload('order',{type:3})")
            i.iconfont.icon-Alreadypaid
            span 已付款
          .type-item(@tap="openNViewPreload('order',{type:4})")
            i.iconfont.icon-completeds
            span 已完成
          .type-item(@tap="openNViewPreload('order',{type:5})")
            i.iconfont.icon-Cancelled
            span 已取消
      ul.media-view.funList
        li.media(@tap="openNViewPreload('systemSetting')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 系统设置
        li.media(@tap="openNViewPreload('subscription')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 订阅管理
        li.media(@tap="openNViewPreload('follow')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 我的关注
        li.media(@tap="openNViewPreload('advice')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 反馈意见
        li.media(@tap="openNViewPreload('aboutUS')")
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
  import {plusKey} from "../../assets/js/locationStorage";

  export default {
    name: 'me',
    data() {
      return {
        userData: {},
        loginState: false,
      }
    },
    mounted() {
      window.addEventListener('getData', () => {
        this.getData();
      });
      window.addEventListener('loginSuccess', (e) => {
        this.getData();
        mui.toast(e.detail.msg);
      });
      window.addEventListener('loginOut', (e) => {
        this.getData();
        mui.toast(e.detail.msg);
      });
      window.addEventListener('changeUserData', (e) => {
        this.getData();
        mui.toast(e.detail.msg);
      });
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        let vueThis = this;
        mui.plusReady(() => {
          if (plus.storage.getItem(plusKey.state)) {
            http({
              url: api.member_info,
              success: (data) => {
                vueThis.userData = data;
                vueThis.loginState = true;
              },
              error: (data) => {
                mui.toast(data.msg)
              }
            })
          }else {
            this.loginState = false;
            this.userData = {};
          }
        });
      },//打开页面
      openWindow: myMethods.openWindow,//打开详情
      openNViewPreload(url, data) {
        if(this.loginState){
          myMethods.openNViewPreload(url, data)
        }else{
         this.openWindow('login');
        }
      },
      openTabNav: myMethods.openTabNav,
    }
  }
</script>
