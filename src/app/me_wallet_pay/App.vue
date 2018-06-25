<template lang="pug">
  #app
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
      button.fixed-bottom-btn(@tap="pay") 确认支付￥{{needPay}}
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

    },
    methods: {
      changePay(pay){
        this.needPay = pay
      },
      changePayType(type){
        this.payType = type
      },//支付
      pay(){
        mui.toast('支付成功');
        setTimeout(()=>{
          mui.back();
        },1000)
      }
    }
  }
</script>
