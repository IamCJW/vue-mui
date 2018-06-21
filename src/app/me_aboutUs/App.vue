<template lang="pug">
  #app
    .mui-content
      .none
        i.iconfont.icon-company
        span 暂无公司介绍
</template>
<style lang="stylus" scoped>
  @import "aboutUS.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'aboutUS',
    data() {
      return {

      }
    },
    mounted() {

    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.search_company,
          success: (data) => {
            this.companyData = data;
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,
      //左滑事件
    }
  }
</script>
