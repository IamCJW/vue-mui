<template lang="pug">
  #app
    header.detail-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title 商户建筑设计互联网技术服务有限公司
        span.iconfont.icon-MORES
      .header-sign
          span 统一社会信用代码:A5S6CCS45812SW56S2
      .detail-nav-bar
        span.detail-bar-item.active 基本信息
        span.detail-bar-item 中标信息
        span.detail-bar-item 建造师
        span.detail-bar-item 工商信息
        span.detail-bar-item 法律讼诉
    .mui-content

</template>
<style lang="stylus" scoped>
  @import "companyDetail.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'selectlocation',
    data() {
      return {
        msg:{},
        navPage:''
      }
    },
    mounted() {
      this.getData()
    },
    created() {

    },
    methods: {
      //数据请求
      getData(){
        http({
          url:api.tender_success_detail,
          data:{rid:'rid'},
          success:(data)=>{
            this.msg = data;
            this.navPage = data.navigate_list[0].name;
            console.log(this.navPage)
          }
        })
      },
      //内容选择
      navSelect(key){
        this.navPage = key;
      }
    }
  }
</script>
