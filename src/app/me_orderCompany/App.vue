<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 订单公司
    .mui-content
      .none(v-if="!companyData.length")
        i.iconfont.icon-jianzhuqiye
        span 您还未添加订单公司
      template(v-if="companyData.length")
        .search-result 共{{companyData.length}}家公司
        ul.media-view
          li.media(v-for="(item,index) in companyData")
            .media-content
              .company-name
                span.index {{index+1}}
                span.mui-ellipsis {{item.name}}
              i.iconfont.icon-Rubbish(@tap="deleteCompany(item.rid)")
      button.fixed-bottom-btn(@tap="openWindow('userData_company_order')") 添加订单公司

</template>
<style lang="stylus" scoped>
  @import "orderCompany.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api'
  import myMethods from "../../assets/js/methods";

  export default {
    name: 'orderCompany',
    data() {
      return {
        companyData: {}
      }
    },
    mounted() {
      let vueThis = this;
      this.getData();
      mui.init({});
      window.addEventListener('addSuccess',()=>{
        this.getData();
      })
    },
    methods: {
      // 获取基础数据
      getData() {
        http({
          url: api.member_order_company,
          success: (data) => {
            this.companyData = data
          }
        })
      },
      //删除按钮
      deleteCompany(rid){
        mui.confirm('确认删除该订单公司？',' ',['取消','确定'],(rid)=>{
          http({
            url: api.member_order_company,
            methods:'delete',
            data:{
              rid:rid
            },
            success: (data) => {
              this.companyData = data
            }
          })
        })
      }
      ,
      // 跳转页面
      openWindow:myMethods.openWindow()
    },
  }
</script>
