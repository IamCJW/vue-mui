<template lang="pug">
  #app
    .mui-content
      loading(ref="loading")
      .none(v-if="!companyData.length && dataLock")
        i.iconfont.icon-jianzhuqiye
        span 您还未添加订单公司
      template(v-if="companyData.length && dataLock")
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
  import loading from "../../components/loading";

  export default {
    name: 'orderCompany',
    components: {loading},
    data() {
      return {
        dataLock:false,
        companyData: {}
      }
    },
    mounted() {
      window.addEventListener('getData',()=>{
        this.getData();
        mui.plusReady(()=>{
          mui.preload({
            url:'./userData_company_order.html',
            id:'userData_company_order',
          })
        });
      });
      window.addEventListener('addSuccess',()=>{
        this.getData();
      })
    },
    methods: {
      // 获取基础数据
      getData() {
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.member_order_company,
          success: (data) => {
            this.companyData = data;
            this.$refs.loading.hide();
            this.dataLock = true;
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
      openWindow:myMethods.openWindow
    },
  }
</script>
