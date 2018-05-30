<template lang="pug">
  #app
    header.detail-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title 商户设计互联网技术服务有限公司
        span.iconfont.icon-MORES
      .header-sign
        span 统一社会信用代码:A5S6CCS45812SW56S2
      .detail-nav-bar
        span.detail-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 基本信息
        span.detail-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 中标信息
        span.detail-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 建造师
        span.detail-bar-item(@tap="jumpTo(3)", :class="{active: pageKey===3}") 工商信息
        span.detail-bar-item(@tap="jumpTo(4)", :class="{active: pageKey===4}") 法律讼诉
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          //基本信息
          .content-page(@swipeleft="contentSwipeleft()")
            .scroll-wrapper
              .scroll-box
                ul.media-view
                  li.media
                    .media-content
                      .media-lable 企业注册属地
                      .media-value 江苏省哈哈室
                  li.media
                    .media-content
                      .media-lable 联系地址
                      .media-value 江苏省哈哈室
                  li.media
                    .media-content
                      .media-lable 经营地区
                      .media-value
                        .com-records
                          span
                            i.iconfont.icon-Note.z
                            span 广东省
                          span
                            i.iconfont.icon-Prepare.b
                            span 江西省
                  li.media
                    .media-content.iconfont.icon-Unfold
                      .media-lable 联系人
                    .media-alert
                      ul.media-view
                        li.media
                          .media-content
                            .media-lable 张小姐
                            .media-value
                              i.iconfont.icon-phone
                              span 13022093212
                        li.media
                          .media-content
                            .media-lable 张小姐
                            .media-value
                              i.iconfont.icon-phone
                              span 13022093212
                  li.media
                    .media-content.iconfont.icon-Unfold
                      .media-lable 企业资质
                    .media-alert
                      ul.media-view
                        li.media
                          .media-content
                            .media-lable 我是资质
                            .media-value 甲级
                        li.media
                          .media-content
                            .media-lable 我是资质
                            .media-value 甲级
          //基本信息
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper
              .scroll-box 中标信息
          //建造师
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper
              .scroll-box 建造师
          //工商信息
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper
              .scroll-box 工商信息
          //法律讼诉
          .content-page(@swiperight="contentSwiperight()")
            .scroll-wrapper
              .scroll-box 法律讼诉

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
    name: 'companyDetail',
    data() {
      return {
        pageKey: 0,//页面状态
        baseData: '',//基本信息
        tenderSuccessData: '',//中标信息
        builderData: '',//建造师
        commercialData: '',//工商信息
        legalData: '',//法律讼诉
      }
    },
    mounted(){
      this.getData();
      mui('.scroll-wrapper').scroll()
    },
    created(){

    },
    methods: {
      //数据请求
      getData(){
        http({
          url: api.search_company_detail,
          data: {rid: 'rid'},
          success: (data) => {

          }
        })
      }
      ,
      //页面切换
      jumpTo(key){
        this.filterFlag = false;
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
      }
      ,
      //左滑事件
      contentSwipeleft(){
        this.pageKey = this.pageKey + 1;
        let key = this.pageKey;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      }
      ,
      //右滑事件
      contentSwiperight(){
        this.pageKey = this.pageKey - 1;
        let key = this.pageKey;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      }
    }
  }
</script>
