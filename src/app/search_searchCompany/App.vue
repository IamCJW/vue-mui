<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入企业名称和统一信用代码" v-model="message")
      span.search(@tap="search()") 搜索
    .mui-content
      .pro-group
        .scroll-wrapper#companyGroup
          .scroll-box
            .search-result(v-if="total") 某招标共收录建筑企业{{companyData.total}}家
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
  @import "searchCompany.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api'
  import myMethods from '../../assets/js/methods'

  export default {
    name: 'searchCompany',
    data() {
      return {
        total: false,
        message: '',
        companyData: {}
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
              vueThis.companyData.cur_page += 1;
              http({
                url: api.search_company,
                data: {
                  cur_page: vueThis.companyData.cur_page,
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
    },
    methods: {
      // 搜索事件
      search() {
        http({
          url: api.search_company,
          data: {search: this.message},
          success: (data) => {
            this.total = true;
            this.companyData = data
          }
        })
      },
      // 跳转页面
      openWindow: myMethods.openWindow,
    }
  }
</script>
