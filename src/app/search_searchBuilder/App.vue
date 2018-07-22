<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(type="text" placeholder="请输入建造师姓名或证书号" v-model="message" v-focus)
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
      .pro-group(v-show="dataLock")
        .none(v-show="builderData.result.length === 0")
          i.iconfont.icon-jianzhuqiye
          span 暂无该词条信息~
        .scroll-wrapper#companyGroup(v-show="builderData.result.length !== 0")
          .scroll-box
            .search-result(v-if="total") 共收录该词条建造师{{builderData.total}}名
            .bui-group
              .bui-item(v-for="item in builderData.result", @tap="openDetail('builderDetail',{rid:item.rid})")
                .bui-top
                  .bui-name {{item.user_name}}
                  .bui-id 注册号:{{item.register_no}}
                  div 中标数量:{{item.tender_sucess_num}}
                .bui-mid
                  span.bui-sign {{item.level}}
                  span.fr
                    span 专业数:{{item.professional_num}}
                    span 最近中标:{{item.tender_last_date}}
                .bui-company {{item.company_name}}
                .bui-records
                  span(v-for="sign in item.province_list")
                    i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                    span {{sign.name}}

</template>
<style lang="stylus" scoped>
  @import "searchBuilder.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api'
  import myMethods from '../../assets/js/methods'
  import loading from "../../components/loading";
  import {lsKey} from "../../assets/js/locationStorage";

  export default {
    name: 'searchCompany',
    components: {loading:loading},
    data() {
      return {
        dataLock:false,
        total:false,
        message: '',
        builderData: {
          cur_page:1,
          result:[]
        },
        historyShow:true,
        historyList:[],
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
    mounted() {
      let vueThis = this;
      let province = localStorage.getItem(lsKey.locationProvince);
      window.addEventListener('getData',()=>{
        this.historyShow = true;
        if(localStorage.getItem(lsKey.historySearchBuilder) !== null){
          this.historyList = JSON.parse(localStorage.getItem(lsKey.historySearchBuilder));
        }
      });
      mui.init({
        pullRefresh: [{
          container: '#companyGroup',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.builderData.cur_page += 1;
              http({
                url: api.search_company,
                data: {
                  search: vueThis.message,
                  province:province,
                  cur_page: vueThis.builderData.cur_page,
                }, success: (data) => {
                  if (data.total_page <= vueThis.builderData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.builderData.result = vueThis.builderData.result.concat(data.result);
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
          vueThis.builderData = {
            cur_page:1,
              result:[]
          };
          return true;
        }
      });
    },
    methods: {
      //清除历史记录
      historyClear(){
        localStorage.removeItem(lsKey.historySearchBuilder);
        this.historyList = [];
      },
      //历史查询事件
      historySearch(item){
        this.message = item;
        this.search();
      },
      // 搜索事件
      search() {
        if (this.message === '') {
          mui.toast('请输入要搜索的关键字~');
          return
        }
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
        localStorage.setItem(lsKey.historySearchBuilder,JSON.stringify(this.historyList));
        this.historyShow = false;
        let province = localStorage.getItem(lsKey.locationProvince);
        mui('#companyGroup').pullRefresh().refresh(true);
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.search_builder_search,
          data: {search: this.message,province:province},
          success: (data) => {
            this.total = true;
            this.builderData = data;
            this.$refs.loading.hide();
            this.dataLock = true;
          },
          noFind:(data)=>{
            this.total = true;
            this.builderData.result = [];
            this.$refs.loading.hide();
            this.dataLock = true;
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow,//跳转详情
      openDetail:myMethods.openDetail,
      //清除输入内容
      clearMessage(){
        this.message = '';
      },
    },
  }
</script>
