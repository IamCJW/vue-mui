<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入建造师姓名或证书号" v-model="message" v-focus)
        i(v-show="message.length !==0" @tap="clearMessage").iconfont.icon-shutdown
      span.search(@tap="search()") 搜索
    .mui-content
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
    mounted() {
      let vueThis = this;
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
                  cur_page: vueThis.builderData.cur_page,
                }, success: (data) => {
                  vueThis.builderData.result = vueThis.builderData.result.concat(data.result);
                  if (data.total_page === vueThis.builderData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
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
      // 搜索事件
      search() {
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
    },
  }
</script>
