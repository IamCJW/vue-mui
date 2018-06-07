<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 优惠券
    .detail-nav-bar
      span.detail-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 未使用
      span.detail-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 已使用
      span.detail-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 已过期
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .coupon-group
              .none(v-if="!useData[0]")
                i.iconfont.icon-coupon
                span 无可用优惠券
              .coupon-item(v-for='item in useData')
                .coupon-left
                  .coupon-value ￥
                    span {{item.coupon_je}}
                  .coupon-condition 满300可用
                .coupon-right
                  .coupon-top
                    .coupon-type {{item.type_text}}
                    .coupon-name.mui-ellipsis {{item.name}}
                  .coupon-mid
                    .coupon-time {{item.start_date | dateFilter}} - {{item.end_date | dateFilter}}
                    .coupon-use 立即使用
                  .coupon-bottom 仅{{item.scope.province}}{{item.scope.city}}可用
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .coupon-group.used
              .none(v-if="!usedData[0]")
                i.iconfont.icon-coupon
                span 无已用优惠券
              .coupon-item(v-for='item in usedData')
                .coupon-left
                  .coupon-value ￥
                    span {{item.coupon_je}}
                  .coupon-condition 满300可用
                .coupon-right
                  .coupon-top
                    .coupon-type {{item.type_text}}
                    .coupon-name.mui-ellipsis {{item.name}}
                  .coupon-mid
                    .coupon-time {{item.start_date | dateFilter}} - {{item.end_date | dateFilter}}
                  .coupon-bottom 仅{{item.scope.province}}{{item.scope.city}}可用
          .content-page(@swiperight="contentSwiperight()")
            .coupon-group.used.end
              .none(v-if="!endData[0]")
                i.iconfont.icon-coupon
                span 无过期优惠券
              .coupon-item(v-for='item in endData')
                .coupon-left
                  .coupon-value ￥
                    span {{item.coupon_je}}
                  .coupon-condition 满300可用
                .coupon-right
                  .coupon-top
                    .coupon-type {{item.type_text}}
                    .coupon-name.mui-ellipsis {{item.name}}
                  .coupon-mid
                    .coupon-time {{item.start_date | dateFilter}} - {{item.end_date | dateFilter}}
                  .coupon-bottom 仅{{item.scope.province}}{{item.scope.city}}可用
</template>
<style lang="stylus" scoped>
  @import "coupon.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'coupon',
    data() {
      return {
        pageKey:0,
        useData:{},
        usedData:{},
        endData:{}
      }
    },
    mounted() {

      mui.init({

      });
      this.jumpTo(this.pageKey);
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_coupon,
          data:{
            status:0
          },
          success: (data) => {
            this.useData = data;
          }
        });
        http({
          url: api.member_coupon,
          data:{
            status:1
          },
          success: (data) => {
            this.usedData = data;
          }
        });
        http({
          url: api.member_coupon,
          data:{
            status:-1
          },
          success: (data) => {
            this.endData = data;
          }
        });
      },
      //页面切换
      jumpTo(key) {
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
        console.log(this.$refs.barscroll.style.left)
      },
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
      },
    },
    filters:{
      dateFilter(date){
        return date.replace(/-/g,'.')
      }
    }
  }
</script>
