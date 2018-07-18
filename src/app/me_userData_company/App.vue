<template lang="pug">
  #app
    .mui-content
      .cell-row.search-wrapper
        .search-box
          i.iconfont.icon-enterprise
          input(placeholder="请输入企业全称并选择", @input="searchChange", @change="searchChange", v-model="searchMsg")
          i.iconfont.icon-shutdown(v-show="clearSearchMsgFlag", @tap="clearSearchMsg")
      .none(v-if="!companyList[0]")
        i.iconfont.icon-enterprise
        span 暂无符合企业，请输入正确企业名称~
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
        companyList: [],
        baseData:{},
      }
    },
    components: {},
    mounted() {
      window.addEventListener('getData',(e)=>{
        this.baseData = e.detail;
      })
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
            }
          })
        }
      },
      clearSearchMsg() {
        this.searchMsg = '';
        this.clearSearchMsgFlag = false;
        this.companyList = [];
      },
      chooseCompany(value) {
        let vueThis = this;
        this.searchMsg = value;
        this.baseData.name = value;
        let message = `您将绑定的企业名字为[${value}],一旦确认将无法更改,请谨慎操作`;
        mui.confirm(message, '重要提醒', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_info,
              method: 'post',
              data: vueThis.baseData,
              success: () => {
                mui.toast('企业绑定成功，已为您匹配企业资质~');
                let viewData = plus.webview.getWebviewById('userData');
                let viewThis = plus.webview.getWebviewById('userData_company');
                mui.fire(viewData,'changeCompanyData',{});
                viewThis.close();
              }
            })
          }
        },'div');
      },
    }
  }
</script>
