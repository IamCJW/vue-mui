0
<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input#search(type="search" placeholder="请输入企业名称" v-model="message")
        i(v-show="message.length !==0" @tap="clearMessage").iconfont.icon-shutdown
      span.search(@tap="search()") 搜索
    .mui-content
      .history-header(v-show="historyShow")
        .history-lable 历史记录
        .history-clear(@tap="historyClear()")
          i.iconfont.icon-Rubbish
          span 清空历史记录
      ul.media-view.history-content(v-show="historyShow")
        li.media(v-show="!historyList.length")
          .media-content 您还没搜索呢，快去搜搜看~
        li.media(v-for="item in historyList", @tap="historySearch(item)")
          .media-content {{item}}
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
  import {lsKey} from "../../assets/js/locationStorage";

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
        },
        historyShow:true,
        historyList:[],
      }
    },
    components: {
      loading: loading
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData',()=>{
        this.historyShow = true;
        this.$refs.loading.hide();
        if(localStorage.getItem(lsKey.historySearchCompanyOwn) !== null){
          this.historyList = JSON.parse(localStorage.getItem(lsKey.historySearchCompanyOwn));
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
      document.getElementById("search").addEventListener("keypress",(event)=>{
        if(event.keyCode == "13") {
          this.search();
        }
      });
    },
    methods: {
      //清除历史记录
      historyClear(){
        localStorage.removeItem(lsKey.historySearchCompanyOwn);
        this.historyList = [];
      },
      //历史查询事件
      historySearch(item){
        this.message = item;
        this.search();
      },
      // 搜索事件
      search() {
        if(!this.message){
          mui.toast('请输入关键字~');
          return
        }
        document.activeElement.blur();
        this.$refs.loading.show();
        this.dataLock = false;
        this.companyData.cur_page = 1;
        let message = this.message;
        let historyList;
        if (this.historyList.length !== 0){
          historyList = this.historyList;
        }else {
          historyList = [];
        }
        historyList.unshift(message);
        historyList.forEach((item,index)=>{
          if(item === this.message && index !== 0){
            historyList.splice(index,1)
          }
        });
        this.historyList = historyList;
        localStorage.setItem(lsKey.historySearchCompanyOwn,JSON.stringify(this.historyList));
        this.historyShow = false;
        myMethods.uploadReset('#companyGroup');
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
