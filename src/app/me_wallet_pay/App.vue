<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 余额充值
      span 联系客服
    .mui-content
      .module
        .module-title 选择充值金额
        .module-content
          .pay-list
            .pay-item(v-for="item in payList", :class="{active:needPay === item}", @tap="changePay(item)") {{item}}
          .pay-discount
            i.iconfont.icon-broadcast
            span 充值优惠满500减3
      .module
        .module-title 选择支付方式
        .module-content
          ul.media-view
            li.media
              .media-content.iconfont(:class="{active:payType === 0}", @tap="changePayType(0)")
                .pay-type
                  i.iconfont.icon-wechats
                  span 微信支付
            li.media.border-none
              .media-content.iconfont(:class="{active:payType === 1}", @tap="changePayType(1)")
                .pay-type
                  i.iconfont.icon-Alipay
                  span 支付宝支付
      button.fixed-bottom-btn 确认支付￥{{needPay}}
</template>
<style lang="stylus" scoped>
  @import "wallet_pay.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'walletpay',
    data() {
      return {
        payList:[300,500,1000,2000,3000,50000,60000,10000],
        needPay:300,
        payType:0
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
      openWindow: myMethods.openWindow,
      changePay(pay){
        this.needPay = pay
      },
      changePayType(type){
        this.payType = type
      }
    }
  }
</script>
