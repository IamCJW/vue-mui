<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 我的订单
    .detail-nav-bar
      span.detail-bar-item(:class="{active: pageKey === 0}", @tap="jumpTo(0)") 全部
      span.detail-bar-item(:class="{active: pageKey === 1}", @tap="jumpTo(1)") 待付款
      span.detail-bar-item(:class="{active: pageKey === 2}", @tap="jumpTo(2)") 待收货
      span.detail-bar-item(:class="{active: pageKey === 3}", @tap="jumpTo(3)") 已完成
      span.detail-bar-item(:class="{active: pageKey === 4}", @tap="jumpTo(4)") 已取消
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .scroll-wrapper#page1
              .scroll-box
                //全部//////////////////////////////////////////////////////////////////////////
                ul.oreder-list
                  li.order-item
                    .order-top
                      span.order-time 2018-05-11
                      span 订单编号：1215214524156461sa
                      i.iconfont.icon-Alreadypaidss
                    .order-content
                      div.goods-img
                      div.goods-content
                        .goods-name 订单编号订单编号订单编号订单编号订单编号订单编号订单编号订单编号
                        .goods-assiset.overflow-auto
                          span.fl 投标保函
                          span.fr x1
                    .order-deal
                      .order-deal-item.overflow-auto
                        span.fl 商品金额
                        span.fr ￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 折扣券抵扣
                        span.fr -￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 运费
                        span.fr +￥300.00
                      .order-deal-item.overflow-auto.order-pay
                        span.fl 线上支付
                        span.fr ￥300.00
                    .order-btn-group
                      button.active 付款
                      button 联系客服
                      button 查看物流
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page2
              .scroll-box
                //待付款//////////////////////////////////////////////////////////////////////////
                ul.oreder-list
                  li.order-item
                    .order-top
                      span.order-time 2018-05-11
                      span 订单编号：1215214524156461sa
                      i.iconfont.icon-Pendingpaymentss
                    .order-content
                      div.goods-img
                      div.goods-content
                        .goods-name 订单编号订单编号订单编号订单编号订单编号订单编号订单编号订单编号
                        .goods-assiset.overflow-auto
                          span.fl 投标保函
                          span.fr x1
                    .order-deal
                      .order-deal-item.overflow-auto
                        span.fl 商品金额
                        span.fr ￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 折扣券抵扣
                        span.fr -￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 运费
                        span.fr +￥300.00
                      .order-deal-item.overflow-auto.order-pay
                        span.fl 线上支付
                        span.fr ￥300.00
                    .order-btn-group
                      button 联系客服
                      button 取消订单
                      button.active 付款
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page3
              .scroll-box
                //待收货//////////////////////////////////////////////////////////////////////////
                ul.oreder-list
                  li.order-item
                    .order-top
                      span.order-time 2018-05-11
                      span 订单编号：1215214524156461sa
                      i.iconfont.icon-Alreadypaidss
                    .order-content
                      div.goods-img
                      div.goods-content
                        .goods-name 订单编号订单编号订单编号订单编号订单编号订单编号订单编号订单编号
                        .goods-assiset.overflow-auto
                          span.fl 投标保函
                          span.fr x1
                    .order-deal
                      .order-deal-item.overflow-auto
                        span.fl 商品金额
                        span.fr ￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 折扣券抵扣
                        span.fr -￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 运费
                        span.fr +￥300.00
                      .order-deal-item.overflow-auto.order-pay
                        span.fl 线上支付
                        span.fr ￥300.00
                    .order-btn-group
                      button 联系客服
                      button 查看物流
                      button.success 确认收货
                  li.order-item
                    .order-top
                      span.order-time 2018-05-11
                      span 订单编号：1215214524156461sa
                      i.iconfont.icon-Alreadypaidss
                    .order-content
                      div.goods-img
                      div.goods-content
                        .goods-name 订单编号订单编号订单编号订单编号订单编号订单编号订单编号订单编号
                        .goods-assiset.overflow-auto
                          span.fl 投标保函
                          span.fr x1
                    .order-deal
                      .order-deal-item.overflow-auto
                        span.fl 商品金额
                        span.fr ￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 折扣券抵扣
                        span.fr -￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 运费
                        span.fr +￥300.00
                      .order-deal-item.overflow-auto.order-pay
                        span.fl 线上支付
                        span.fr ￥300.00
                    .order-btn-group
                      button 联系客服
                      button 申请退款
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page4
              .scroll-box
                ul.oreder-list
                  li.order-item
                    .order-top
                      span.order-time 2018-05-11
                      span 订单编号：1215214524156461sa
                      i.iconfont.icon-completed
                    .order-content
                      div.goods-img
                      div.goods-content
                        .goods-name 订单编号订单编号订单编号订单编号订单编号订单编号订单编号订单编号
                        .goods-assiset.overflow-auto
                          span.fl 投标保函
                          span.fr x1
                    .order-deal
                      .order-deal-item.overflow-auto
                        span.fl 商品金额
                        span.fr ￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 折扣券抵扣
                        span.fr -￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 运费
                        span.fr +￥300.00
                      .order-deal-item.overflow-auto.order-pay
                        span.fl 线上支付
                        span.fr ￥300.00
                    .order-btn-group
                      button 联系客服
                      button 删除订单
          .content-page(@swiperight="contentSwiperight()")
            .scroll-wrapper#page5
              .scroll-box
                ul.oreder-list
                  li.order-item
                    .order-top
                      span.order-time 2018-05-11
                      span 订单编号：1215214524156461sa
                      i.iconfont.icon-Cancelleds
                    .order-content
                      div.goods-img
                      div.goods-content
                        .goods-name 订单编号订单编号订单编号订单编号订单编号订单编号订单编号订单编号
                        .goods-assiset.overflow-auto
                          span.fl 投标保函
                          span.fr x1
                    .order-deal
                      .order-deal-item.overflow-auto
                        span.fl 商品金额
                        span.fr ￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 折扣券抵扣
                        span.fr -￥300.00
                      .order-deal-item.overflow-auto
                        span.fl 运费
                        span.fr +￥300.00
                      .order-deal-item.overflow-auto.order-pay
                        span.fl 线上支付
                        span.fr ￥300.00
                    .order-btn-group
                      button 删除订单

</template>
<style lang="stylus" scoped>
  @import "order.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'order',
    data() {
      return {
        pageKey: 0,
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
      contentSwipeleft() {
        this.pageKey = this.pageKey + 1;
        let key = this.pageKey;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },
      //右滑事件
      contentSwiperight() {
        this.pageKey = this.pageKey - 1;
        let key = this.pageKey;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },//页面切换
      jumpTo(key) {
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
      },
    }
  }
</script>
