<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入要查询的项目", v-model='searchMsg')
      span.search(@tap="searchPro") 搜索
    .mui-content
      loading(ref="loading")
      .content-page(v-show="dataLock")
        .scroll-wrapper#page1
          .scroll-box
            .none(v-if="proData.data.length === 0")
              i.iconfont.icon-xiangmu
              span 暂无相关项目信息~
            .pro-group.cell-row
              transition-group(name="domItem")
                .pro-item(v-for="item in proData.data",:key="item.rid",@tap="openWindow('detail',item)")
                  .pro-assist
                    div(:class="{'color-icon-SUPERVISION':item.tender_type === '监理','color-icon-design':item.tender_type === '设计','color-icon-INVESTIGATE':item.tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','color-icon-INTEGRATION':item.tender_type === '一体化','color-icon-OTHER':item.tender_type === '其他',}")
                      i.iconfont(:class="{'icon-SUPERVISION':item.tender_type === '监理','icon-design':item.tender_type === '设计','icon-INVESTIGATE':item.tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','icon-INTEGRATION':item.tender_type === '一体化','icon-OTHER':item.tender_type === '其他',}")
                      | {{item.tender_type}}
                    div(:class="{'color-icon-ANSWERINGQUESTIONS':item.info_type === '答疑','color-icon-CHANGE':item.info_type === '变更','color-icon-clarify':item.info_type === '澄清','color-icon-investigate_money':item.info_type === '资审','color-icon-FLOWSTANDARD':item.info_type === '流标','color-icon-OTHER':item.info_type === '其他','color-icon-THESCRAP':item.info_type === '废标'}")
                      i.iconfont(:class="{'icon-ANSWERINGQUESTIONS':item.info_type === '答疑','icon-CHANGE':item.info_type === '变更','icon-clarify':item.info_type === '澄清','icon-investigate_money':item.info_type === '资审','icon-FLOWSTANDARD':item.info_type === '流标','icon-OTHER':item.info_type === '其他','icon-THESCRAP':item.info_type === '废标'}")
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
        dataLock:false,
        searchMsg: '',
        province: '',
        city: '',
        district: '',
        proData: {
          pageNum: 1,
          data: []
        }
      }
    },
    components: {loading: loading},
    mounted() {
      let vueThis = this;
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
              http({
                url: api.index_project_search,
                data: {
                  province: vueThis.province,
                  city: vueThis.city,
                  district: vueThis.district,
                  search: vueThis.searchMsg
                }, success: (data) => {
                  vueThis.proData.data = vueThis.proData.data.concat(data.result);
                  if (data.total_page <= vueThis.proData.pageNum) {
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
    methods: {
      searchPro() {
        if (this.searchMsg === '') {
          mui.toast('请输入要搜索的关键字~');
          return
        }
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
          noFind:()=>{
            this.dataLock = true;
            this.$refs.loading.hide();
          }
        })
      },
      openWindow: (url,item) => {
        let data = {};
        data['rid'] = item.rid;
        switch (item.tender_type) {
          case '招标':
            data['type'] = 1;
            break;
          case '中标':
            data['type'] = 2;
            break;
          default:
            data['type'] = 3;
        }
        let detailPage = plus.webview.getWebviewById(url);
        if (!detailPage) {
          mui.toast('目标正在初始化，请稍候~')
        }
        mui.fire(detailPage, 'getData', data);
        myMethods.openWindow(url);
      },
    },
  }
</script>
