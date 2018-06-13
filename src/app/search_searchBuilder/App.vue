<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入建造职师或证书号" v-model="message")
      span.search(@tap="search()") 搜索
    .mui-content
      .pro-group
        .scroll-wrapper#companyGroup
          .scroll-box
            .search-result(v-if="total") 某招标共收录建筑企业{{builderData.total}}家
            .bui-group
              .bui-item(v-for="item in builderData.result",@tap="openWindow('builderDetail',{rid:item.rid})")
                .bui-top
                  .bui-name {{item.user_name}}
                  .bui-id 注册号:{{item.register_no}}
                  div 中标数量:{{item.tender_sucess_num}}
                .bui-mid
                  span.bui-sign 二级注册建造师
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

  export default {
    name: 'searchCompany',
    data() {
      return {
        total:false,
        message: '',
        builderData: {}
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
          url: api.search_builder_search,
          data: {search: this.message},
          success: (data) => {
            this.total = true;
            this.builderData = data
          }
        })
      },
      // 跳转页面
      openWindow(route, data) {
        mui.openWindow({
          url: `./${route}.html`,
          id: route,
          extras: data
        })
      }
    },
  }
</script>
