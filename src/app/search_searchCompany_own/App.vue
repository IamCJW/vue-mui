0
<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(type="text" placeholder="请输入企业名称" v-model="message" v-focus)
        i(v-show="message.length !==0" @tap="clearMessage").iconfont.icon-shutdown
      span.search(@tap="search()") 搜索
    .mui-content
      loading(ref="loading")
      .box(v-show="dataLock")
        .none(v-show="total === 0")
          i.iconfont.icon-jianzhuqiye
          span 暂无该词条信息~
        .scroll-wrapper#companyGroup(v-show="total !== 0 !== 0")
          .scroll-box
            .search-result(v-if="total !== 0") 共收录该词条业主企业{{total}}家
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
    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus();
          mui.plusReady(()=>{
            plus.key.showSoftKeybord();
          });
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
                  if (data.total_page === vueThis.companyData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.companyData.result = vueThis.companyData.result.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                noFind: () => {
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
            cur_page: 1,
            result: []
          };
          return true;
        }
      });
    },
    methods: {
      // 搜索事件
      search() {
        if(!this.message){
          mui.toast('请输入关键字~');
          return
        }
        this.$refs.loading.show();
        this.dataLock = false;
        myMethods.uploadReset('#companyGroup');
        this.companyData.cur_page = 1;
        http({
          url: api.search_tender_company,
          data: {search: this.message},
          success: (data) => {
            this.total = data.total;
            this.companyData = data;
            this.$refs.loading.hide();
            this.dataLock = true;
          },
          noFind:()=>{
            this.$refs.loading.hide();
            this.dataLock = true;
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow,//跳转详情
      openDetail:myMethods.openDetail,
      //清除输入内容
      clearMessage() {
        this.message = '';
      },
    }
  }
</script>
