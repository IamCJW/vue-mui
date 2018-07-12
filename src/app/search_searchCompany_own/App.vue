0<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入企业名称" v-model="message")
      span.search(@tap="search()") 搜索
    .mui-content
      loading(ref="loading")
      .box(v-show="dataLock")
        .none(v-show="total === 0")
          i.iconfont.icon-jianzhuqiye
          span 暂无该词条信息~
        .scroll-wrapper#companyGroup(v-show="total !== 0 !== 0")
          .scroll-box
            .search-result(v-if="total !== 0") 某招标共收录业主企业{{total}}家
            .pro-group
              transition-group(name='domItem')
                .pro-item(v-for="item in companyData.result", :key="item.rid"  , @tap="openDetail('companyDetail_own',{rid:item.rid})")
                  .pro-content
                    .pro-main
                      .pro-name.mui-ellipsis-2 {{item.company_name}}
                    .pro-assist
                      .pro-price
                        span 招标：{{item.info_num}}
                      .pro-endTime {{item.province}}

</template>
<style lang="stylus" scoped>
  @import "searchCompany_own.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api'
  import myMethods from '../../assets/js/methods'
  import loading from '../../components/loading'

  export default {
    name: 'searchCompany',
    data() {
      return {
        dataLock: false,
        total: 0,
        message: '',
        companyData: {
          cur_page: 1,
          result: []
        }
      }
    },
    components: {
      loading: loading
    },
    mounted() {
      let vueThis = this;
      mui.init({
        pullRefresh: [{
          container: '#companyGroup',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.companyData.cur_page += 1;
              http({
                url: api.search_tender_company,
                data: {
                  cur_page: vueThis.companyData.cur_page,
                  search: vueThis.message
                }, success: (data) => {
                  vueThis.companyData.result = vueThis.companyData.result.concat(data.result);
                  if (data.total_page === vueThis.companyData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }]
      });
    },
    methods: {
      // 搜索事件
      search() {
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.search_tender_company,
          data: {search: this.message},
          success: (data) => {
            this.total = data.total;
            this.companyData = data;
            this.$refs.loading.hide();
            this.dataLock = true;
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow,//跳转详情
      openDetail(url, data) {
        mui.plusReady(function () {
          let detailPage = plus.webview.getWebviewById(url);
          if (!detailPage) {
            mui.toast('目标正在初始化，请稍候~')
          }
          mui.fire(detailPage, 'getData', data);
          myMethods.openWindow(url);
        });
      },
    }
  }
</script>
