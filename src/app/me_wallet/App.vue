<template lang="pug">
  #app
    .wallet-wrapper
      .title 账户余额(元)
      .wallet-content
        .value {{cur_je}}
        button(@tap="openNViewPreload('wallet_pay')") 账户充值
    .mui-content
      loading(ref="loading")
      .content-page(v-show="dataLock")
        .none(v-show="dataList.data.length === 0")
          i.iconfont.icon-wallet
          span 暂无交易记录~
        .scroll-wrapper#page1(v-show="dataList.data.length !== 0")
          .scroll-box
            //全部//////////////////////////////////////////////////////////////////////////
            ul.media-view
              transition-group(name="domItem")
                li.media(v-for="(item,index) in dataList.data", :key="index")
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
  import loading from '../../components/loading'

  export default {
    name: 'wallet',
    data() {
      return {
        dataLock: false,
        cur_je: '0.00',
        dataList: {
          pageNum: 1,
          data: {}
        }
      }
    },
    components: {loading},
    mounted() {
      let vueThis = this;
      window.addEventListener("getData", () => {
        vueThis.getData();
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
      });
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.member_wallet,
          success: (data) => {
            this.cur_je = data.cur_je;
            this.dataList.data = data.result;
            this.$refs.loading.hide();
            this.dataLock = true;
            mui('#page1').pullRefresh().scrollTo(0,0,100);
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,
      openNViewPreload:myMethods.openNViewPreload,
    }
  }
</script>
