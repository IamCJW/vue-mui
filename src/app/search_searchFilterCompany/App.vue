<template lang="pug">
  .mui-content
    loading(ref="loading")
    warn(v-if="connectionState")
    .pro-group(v-show="dataLock")
      warn(icon="icon-jianzhuqiye", msg="暂无此类型公司，请重新筛选条件~", v-show="companyData.total === 0")
      .scroll-wrapper#companyGroup(v-show="companyData.total !== 0")
        .scroll-box
          .search-result(v-if="total") 共收录该条件建筑企业{{companyData.total}}家
          .com-group
            transition-group(name="domItem")
              .com-item(v-for="item in companyData.result", :key="item.rid" , @tap="openDetail('companyDetail',{rid:item.rid})")
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
  @import "searchFilterCompany.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api'
  import myMethods from '../../assets/js/methods'
  import loading from "../../components/loading";
  import warn from "../../components/warn"

  export default {
    name: 'searchFilterCompany',
    components: {loading: loading, warn: warn},
    data() {
      return {
        dataLock: false,
        total: false,
        message: '',
        companyData: {
          cur_page: 1,
          result: []
        },
        muiData: {},
      }
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData', (e) => {
        vueThis.muiData = e.detail;
        vueThis.getData(e.detail);
        this.companyData.cur_page = 1;
        mui.init({
          pullRefresh: [{
            container: '#companyGroup',
            up: {
              contentrefresh: "正在加载...",
              callback: function () {
                vueThis.companyData.cur_page += 1;
                http({
                  url: api.search_company_qualify_search,
                  method: 'post',
                  dataType: true,
                  data: Object.assign(vueThis.muiData, {
                    cur_page: vueThis.companyData.cur_page,
                  }),
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
                  error: () => {
                    this.endPullupToRefresh(true);
                  },
                  connectionNone:()=>{
                    vueThis.companyData.cur_page -= 1;
                    this.endPullupToRefresh(false);
                  }
                });
              }
            }
          }]
        });
        myMethods.uploadReset('#companyGroup');
      });
    },
    methods: {
      //获取数据
      getData(data) {
        this.$refs.loading.show();
        this.dataLock = false;
        this.companyData.cur_page = 1;
        http({
          url: api.search_company_qualify_search,
          data: data,
          dataType: true,
          method: 'post',
          success: (data) => {
            this.total = true;
            this.companyData = data;
            this.connectionOnline();
            mui('#companyGroup').pullRefresh().scrollTo(0, 0, 100);
          },
          noFind: (data) => {
            this.companyData.result = [];
            this.connectionOnline();
            mui('#companyGroup').pullRefresh().scrollTo(0, 0, 100);
          },
          connectionNone:()=>{
            this.connectionUnline();
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow,
      //跳转详情
      openDetail: myMethods.openDetail,
    },
  }
</script>
