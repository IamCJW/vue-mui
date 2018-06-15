<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 查询结果
    .mui-content
      .none(v-if="companyData.total === 0")
        i.iconfont.icon-jianzhuqiye
        span 暂无此类型公司，请重新筛选条件~
      .pro-group(v-if="companyData.total !== 0")
        .scroll-wrapper#companyGroup
          .scroll-box
            .search-result(v-if="total") 共收录该条件建筑企业{{companyData.total}}家
            .com-group
              .com-item(v-for="item in companyData.result", @tap="openWindow('companyDetail',{rid:item.rid})")
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
  @import "searchFilterCompany.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api'
  import myMethods from '../../assets/js/methods'

  export default {
    name: 'searchFilterCompany',
    data() {
      return {
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
      mui.plusReady(() => {
        let muiData = myMethods.getMuiExtras();
        this.muiData = muiData;
        this.getData(muiData);
        mui.init({
          pullRefresh: [{
            container: '#companyGroup',
            up: {
              contentrefresh: "正在加载...",
              callback: function () {
                vueThis.companyData.cur_page += 1;
                http({
                  url: api.search_company_qualify_search,
                  data: {
                    cur_page: vueThis.companyData.cur_page,
                    filter_type: vueThis.muiData.filter_type,
                    province: vueThis.muiData.province,
                    company_type: vueThis.muiData.company_type,
                    qualify_filter: vueThis.muiData.qualify_filter,
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
      });
    },
    methods: {
      //获取数据
      getData(data) {
        http({
          url: api.search_company_qualify_search,
          // data: data,
          method:'post',
          success: (data) => {
            this.total = true;
            this.companyData = data;
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow
    },
  }
</script>
