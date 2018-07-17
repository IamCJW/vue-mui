<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入企业名称或统一信用代码" v-model="message")
        i(v-show="message.length !==0" @tap="clearMessage").iconfont.icon-shutdown
      span.search(@tap="search()") 搜索
    .mui-content
      loading(ref="loading")
      .pro-group(v-show="dataLock")
        .none(v-show="companyData.result.length === 0")
          i.iconfont.icon-jianzhuqiye
          span 暂无该词条信息~
        .scroll-wrapper#companyGroup(v-show="companyData.result.length !== 0")
          .scroll-box
            .search-result(v-if="total") 共收录该词条建筑企业{{companyData.total}}家
            .com-group
              .com-item(v-for="item in companyData.result", @tap="openDetail('companyDetail',{rid:item.rid})")
                .com-name {{item.company_name}}
                .com-sign
                  span 资质:{{item.qualify_num}}
                  span 建造师:{{item.builder_num}}
                  span 中标:{{item.tender_sucess_num}}
                  span.fr 最近中标:{{item.tender_last_date}}
                .com-records
                  span(v-for="sign in item.province_list")
                    i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                    span {{sign.name}}

</template>
<style lang="stylus" scoped>
  @import "searchCompany.styl"
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
        total: false,
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
                url: api.search_company,
                data: {
                  cur_page: vueThis.companyData.cur_page,
                  search: vueThis.message
                },
                success: (data) => {
                  if (data.total_page === vueThis.companyData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.companyData.result = vueThis.companyData.result.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                noFind:()=>{
                  this.endPullupToRefresh(true);
                }
              });
            }
          }
        }],
        beforeback: () => {
          vueThis.dataLock = false;
          vueThis.message = '';
          vueThis.companyData = {
            cur_page:1,
            result:[]
          };
          return true;
        }
      });
    },
    methods: {
      // 搜索事件
      search() {
        mui('#companyGroup').pullRefresh().refresh(true);
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.search_company,
          data: {search: this.message},
          success: (data) => {
            this.total = true;
            this.companyData = data;
            this.$refs.loading.hide();
            this.dataLock = true;
          },
          noFind:(data)=>{
            this.total = true;
            this.companyData.result = [];
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
      //清除输入内容
      clearMessage(){
        this.message = '';
      },
    }
  }
</script>
