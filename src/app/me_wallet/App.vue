<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 我的钱包
    .wallet-wrapper
      .title 账户余额(元)
      .wallet-content
        .value 0.00
        button 账户充值
    .mui-content
      .scroll-wrapper#page1
        .scroll-box
          //全部//////////////////////////////////////////////////////////////////////////
          ul.media-view
            li.media
              .media-content
                .top
                  .type 购买保函
                  .time 2018-05-22
                .bottom
                  .value 余额：0.00
                  .pay -200.00
</template>
<style lang="stylus" scoped>
  @import "wallet.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'order',
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
      openWindow: myMethods.openWindow,
      //左滑事件
    }
  }
</script>
