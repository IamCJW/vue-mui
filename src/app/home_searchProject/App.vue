<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(type="text",placeholder="请输入要查询的项目",v-model='searchMsg',)
        i(v-show="searchMsg.length !==0" @tap="clearMessage").iconfont.icon-shutdown
      span.search(@tap="searchPro") 搜索
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
      .content-page(v-show="dataLock")
        .scroll-wrapper#page1
          .scroll-box
            .none(v-if="proData.data.length === 0")
              i.iconfont.icon-xiangmu
              span 暂无相关项目信息~
            .pro-group.cell-row(v-if="proData.data.length")
              transition-group(name="domItem")
                .pro-item(v-for="(item,index) in proData.data",:key="index",@tap="openWindow('detail',item)")
                  .pro-assist
                    div
                      span.pro-style.color-icon-INTEGRATION(v-if="item.tender_types.indexOf('一体化') !== -1")
                        i.iconfont.icon-INTEGRATION
                        span &nbsp;一体化
                      span.pro-style(v-for="tender_type in item.tender_types",v-if="item.tender_types.indexOf('一体化') === -1",:class="{'color-icon-SUPERVISION':tender_type === '监理','color-icon-design':tender_type === '设计','color-icon-INVESTIGATE':tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':tender_type === '施工','color-icon-INTEGRATION':tender_type === '一体化','color-icon-OTHER':tender_type === '其他',}")
                        i.iconfont(:class="{'icon-SUPERVISION':tender_type === '监理','icon-design':tender_type === '设计','icon-INVESTIGATE':tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':tender_type === '施工','icon-INTEGRATION':tender_type === '一体化','icon-OTHER':tender_type === '其他',}")
                        span &nbsp;{{tender_type}}
                    div(:class="{'color-icon-ANSWERINGQUESTIONS':item.info_type === '答疑','color-icon-CHANGE':item.info_type === '变更','color-icon-clarify':item.info_type === '澄清','color-icon-investigate_money':item.info_type === '资审','color-icon-FLOWSTANDARD':item.info_type === '流标','color-icon-OTHER':item.info_type === '其他','color-icon-THESCRAP':item.info_type === '废标','color-icon-zhaobiaofangan':item.info_type === '招标','color-icon-tubiao-':item.info_type === '中标'}")
                      i.iconfont(:class="{'icon-ANSWERINGQUESTIONS':item.info_type === '答疑','icon-CHANGE':item.info_type === '变更','icon-clarify':item.info_type === '澄清','icon-investigate_money':item.info_type === '资审','icon-FLOWSTANDARD':item.info_type === '流标','icon-OTHER':item.info_type === '其他','icon-THESCRAP':item.info_type === '废标','icon-zhaobiaofangan':item.info_type === '招标','icon-tubiao-':item.info_type === '中标'}")
                      | {{item.info_type}}
                  .pro-main
                    .pro-name {{item.name}}
</template>
<style lang="stylus" scoped>
  @import "searchProject.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import api from '../../assets/js/api'
  import http from '../../assets/js/http.js'
  import loading from '../../components/loading'
  import myMethods from '../../assets/js/methods'

  export default {
    name: 'searchProject',
    data() {
      return {
        dataLock: false,
        searchMsg: '',
        province: '',
        city: '',
        district: '',
        proData: {
          pageNum: 1,
          data: []
        },
        historyShow: true,
        historyList: [],
      }
    },
    components: {loading: loading},
    mounted() {
      let vueThis = this;
      window.addEventListener('getData', () => {
        this.historyShow = true;
        this.$refs.loading.hide();
        if (localStorage.getItem(lsKey.historySearchProject) !== null) {
          this.historyList = JSON.parse(localStorage.getItem(lsKey.historySearchProject));
        }
      });
      this.province = localStorage.getItem(lsKey.locationProvince) || '';
      this.city = localStorage.getItem(lsKey.locationCity) || '';
      this.district = localStorage.getItem(lsKey.locationDistrict) || '';
      mui.init({
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.proData.pageNum += 1;
              console.log(JSON.stringify({
                cur_page: vueThis.proData.pageNum,
                province: vueThis.province,
                city: vueThis.city,
                district: vueThis.district,
                search: vueThis.searchMsg
              }));
              http({
                url: api.index_project_search,
                data: {
                  cur_page: vueThis.proData.pageNum,
                  province: vueThis.province,
                  city: vueThis.city,
                  district: vueThis.district,
                  search: vueThis.searchMsg
                },
                success: (data) => {
                  if (data.total_page < vueThis.proData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.proData.data = vueThis.proData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                noFind: () => {
                  this.endPullupToRefresh(true);
                },
                error: () => {
                  this.endPullupToRefresh(false);
                }
              });
            }
          }
        }],
        beforeback: () => {
          vueThis.dataLock = false;
          vueThis.searchMsg = '';
          vueThis.proData = {
            pageNum: 1,
            data: []
          };
          return true;
        }
      },)
    },
    methods: {
      //清除历史记录
      historyClear() {
        localStorage.removeItem(lsKey.historySearchProject);
        this.historyList = [];
      },
      //历史查询事件
      historySearch(item) {
        this.searchMsg = item;
        this.searchPro();
      },
      searchPro() {
        if (this.searchMsg === '') {
          mui.toast('请输入要搜索的关键字~');
          return
        }
        myMethods.uploadReset('#page1');
        this.proData.pageNum = 1;
        let searchMsg = this.searchMsg;
        let historyList;
        if (this.historyList.length !== 0) {
          historyList = this.historyList;
        } else {
          historyList = [];
        }
        historyList.unshift(searchMsg);
        historyList.forEach((item, index) => {
          if (item === this.searchMsg && index !== 0) {
            historyList.splice(index, 1)
          }
        });
        this.historyList = historyList;
        localStorage.setItem(lsKey.historySearchProject, JSON.stringify(this.historyList));
        this.historyShow = false;
        mui('#page1').pullRefresh().scrollTo(0, 0, 100);
        this.$refs.loading.show();
        http({
          url: api.index_project_search,
          data: {
            province: this.province,
            city: this.city,
            district: this.district,
            search: this.searchMsg
          },
          success: (data) => {
            this.proData.pageNum = 1;
            this.proData.data = data.result;
            this.dataLock = true;
            this.$refs.loading.hide();
          },
          noFind: () => {
            this.proData = {
              pageNum: 1,
              data: []
            };
            this.dataLock = true;
            this.$refs.loading.hide();
          }
        })
      },
      openWindow: (url, item) => {
        let data = {};
        data['rid'] = item.rid;
        switch (item.info_type) {
          case '招标':
            data['type'] = 1;
            break;
          case '中标':
            data['type'] = 2;
            break;
          default:
            data['type'] = 3;
        }
        mui.plusReady(function () {
          mui.preload({
            url: `./${url}.html`,
            id: url
          });
          let detailPage = plus.webview.getWebviewById(url);
          myMethods.muiFireLock(detailPage, () => {
            mui.fire(detailPage, 'getData', data);
          });
          myMethods.openWindow(url);
        });
      },
      //清除输入内容
      clearMessage() {
        this.searchMsg = '';
      },
    },
  }
</script>
