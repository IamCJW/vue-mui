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
              .coupon-item
                .coupon-left
                  .coupon-value ￥
                    span 3
                  .coupon-condition 满300可用
                .coupon-right
                  .coupon-top
                    .coupon-type 现金券
                    .coupon-name 我是优惠券的名字
                  .coupon-mid
                    .coupon-time 2018-11-11~2018-11-11
                    .coupon-use 立即使用
                  .couppon-bottom 广东省深圳市可用
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            | 2
          .content-page(@swiperight="contentSwiperight()")
            | 3
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
      }
    },
    mounted() {
      let vueThis = this;
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
          url: api.message_subscribe_notify,
          success: (data) => {
            this.subscribeData.data = data.result;
            console.log(this.subscribeData)
          }
        });
        http({
          url: api.message_system_notify,
          success: (data) => {
            this.systemData.data = data.result;
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
    }
  }
</script>
