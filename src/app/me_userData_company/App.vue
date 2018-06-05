<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 企业名称设置
    .mui-content
      .cell-row.search-wrapper
        .search-box
          i.iconfont.icon-enterprise
          input(placeholder="请输入企业全称并选择", @input="searchChange", @change="searchChange", v-model="searchMsg")
          i.iconfont.icon-shutdown(v-show="clearSearchMsgFlag", @tap="clearSearchMsg")
      .none(v-if="!companyList[0]")
        i.iconfont.icon-enterprise
        span 请搜索企业名称
      ul.media-view(v-if="companyList[0]")
        li.media(v-for="item in companyList", @tap="chooseCompany(item.company_name)")
          .media-content {{item.company_name}}
</template>
<style lang="stylus" scoped>
  @import "userData_company.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'userData_company',
    data() {
      return {
        searchMsg: '',
        clearSearchMsgFlag: false,
        companyList: []
      }
    },
    components: {},
    mounted() {

    },
    created() {
    },
    methods: {
      searchChange() {
        if (this.searchMsg.length > 0) {
          this.clearSearchMsgFlag = true;
        } else {
          this.clearSearchMsgFlag = false;
        }
        if (this.searchMsg.length > 3) {
          http({
            url: api.common_search_company,
            data: {
              search: this.searchMsg
            },
            success: (data) => {
              this.companyList = data;
              console.log(data)
            }
          })
        }
      },
      clearSearchMsg() {
        this.searchMsg = '';
      },
      chooseCompany(value) {
        this.searchMsg = value;
        let view = plus.webview.currentWebview().opener();
        mui.fire(view, 'chooseCompany', {
          data: {
            name:this.searchMsg
          }
        });
        mui.back()
      },
    }
  }
</script>
