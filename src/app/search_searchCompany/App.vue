<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(type="text",placeholder="请输入企业名称或统一信用代码" v-model="message")
        i(v-show="message.length !==0" @tap="clearMessage").iconfont.icon-shutdown
      span.search(@tap="search()") 搜索
    .mui-content
      .history-header(v-show="historyShow && !connectionState")
        .history-lable 历史记录
        .history-clear(@tap="historyClear()")
          i.iconfont.icon-Rubbish
          span 清空历史记录
      ul.media-view.history-content(v-show="historyShow && !connectionState")
        li.media(v-show="!historyList.length")
          .media-content 您还没搜索呢，快去搜搜看~
        li.media(v-for="item in historyList", @tap="historySearch(item)")
          .media-content {{item}}
      loading(ref="loading")
      warn(v-if="connectionState")
      .pro-group(v-show="dataLock")
        warn(v-show="companyData.result.length === 0" , icon="icon-jianzhuqiye" , msg="暂无该词条信息~")
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
                  span.fr 最近中标:{{item.tender_last_date ? item.tender_last_date : '未知'}}
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
  import warn from '../../components/warn'
  import {lsKey} from "../../assets/js/locationStorage";

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
        },
        historyShow: true,
        historyList: [],
      }
    },
    components: {
      loading: loading,
      warn: warn,
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData', () => {
        this.historyShow = true;
        this.$refs.loading.hide();
        if (localStorage.getItem(lsKey.historySearchCompany) !== null) {
          this.historyList = JSON.parse(localStorage.getItem(lsKey.historySearchCompany));
        }
      });
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
                  if (data.total_page < vueThis.companyData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.companyData.result = vueThis.companyData.result.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                noFind: () => {
                  this.endPullupToRefresh(true);
                },
                connectionNone:()=>{
                  vueThis.companyData.cur_page -= 1;
                  this.endPullupToRefresh(false);
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
      //清除历史记录
      historyClear() {
        localStorage.removeItem(lsKey.historySearchCompany);
        this.historyList = [];
      },
      //历史查询事件
      historySearch(item) {
        this.message = item;
        this.search();
      },
      // 搜索事件
      search() {
        if (this.message === '') {
          mui.toast('请输入要搜索的关键字~');
          return
        }
        myMethods.uploadReset('#companyGroup');
        this.companyData.cur_page = 1;
        let message = this.message;
        let historyList;
        if (this.historyList.length !== 0) {
          historyList = this.historyList;
        } else {
          historyList = [];
        }
        historyList.unshift(message);
        historyList.forEach((item, index) => {
          if (item === this.message && index !== 0) {
            historyList.splice(index, 1)
          }
        });
        this.historyList = historyList;
        localStorage.setItem(lsKey.historySearchCompany, JSON.stringify(this.historyList));
        this.historyShow = false;
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.search_company,
          data: {search: this.message},
          success: (data) => {
            this.total = true;
            this.companyData = data;
            this.connectionOnline();
          },
          noFind: (data) => {
            this.total = true;
            this.companyData.result = [];
            this.connectionOnline();
          },
          connectionNone:()=>{
            this.connectionUnline();
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow,//跳转详情
      openDetail: myMethods.openDetail,
      //清除输入内容
      clearMessage() {
        this.message = '';
      },
    }
  }
</script>
