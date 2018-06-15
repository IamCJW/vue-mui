<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 我的钱包
    .wallet-wrapper
      .title 账户余额(元)
      .wallet-content
        .value {{cur_je}}
        button(@tap="openWindow('wallet_pay')") 账户充值
    .mui-content
      .none(v-if="dataList.data.length === 0")
        i.iconfont.icon-wallet
        span 暂无交易记录~
      .content-page
        .scroll-wrapper#page1(v-if="dataList.data.length !== 0")
          .scroll-box
            //全部//////////////////////////////////////////////////////////////////////////
            ul.media-view
              li.media(v-for="item in dataList.data")
                .media-content
                  .top
                    .type {{item.trade_name}}
                    .time {{item.trade_datetime}}
                  .bottom
                    .value 余额：{{item.cur_je}}
                    .pay {{item.trade_je}}
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
    name: 'wallet',
    data() {
      return {
        cur_je:'0.00',
        dataList:{
          pageNum:1,
          data:{

          }
        }
      }
    },
    mounted() {
      let vueThis = this;
      mui.init({
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.dataList.pageNum += 1;
              http({
                url: api.member_wallet_list,
                data: {
                  cur_page: vueThis.dataList.pageNum
                }, success: (data) => {
                  vueThis.dataList.data = vueThis.dataList.data.concat(data.result);
                  if (data.total_page === vueThis.dataList.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }]
      })
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_wallet,
          success: (data) => {
            this.cur_je = data.cur_je;
            this.dataList.data = data.result;
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,
      //左滑事件
    }
  }
</script>
