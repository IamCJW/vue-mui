<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 我的关注
    .detail-nav-bar
      span.detail-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 项目
      span.detail-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 业主
      span.detail-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 建筑企业
      span.detail-bar-item(@tap="jumpTo(3)", :class="{active: pageKey===3}") 建造师
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            ul.media-view
              li.media(v-for="item in project_follows")
                .media-content
                  .head
                    i.iconfont.icon-SERVICE
                  .content
                    .mui-ellipsis {{item.name}}
                    .mui-ellipsis.tip {{item.name}}
                  button 取消关注
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            ul.media-view
              li.media
                .media-content.add
                  i.iconfont.icon-attentions &nbsp;
                  span 添加业主关注
              li.media(v-for="item in company_follows")
                .media-content
                  .head
                    i.iconfont.icon-SERVICE
                  .content
                    .mui-ellipsis {{item.name}}
                    .mui-ellipsis.tip {{item.name}}
                  button 取消关注
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            ul.media-view
              li.media(v-for="item in company_follows")
                .media-content
                  .head
                    i.iconfont.icon-SERVICE
                  .content
                    .mui-ellipsis {{item.name}}
                    .mui-ellipsis.tip {{item.name}}
                  button 取消关注
          .content-page(@swiperight="contentSwiperight()")
            ul.media-view
              li.media(v-for="item in builder_follows")
                .media-content
                  .head
                    i.iconfont.icon-anquanmao
                  .content
                    .mui-ellipsis {{item.name}}
                    .mui-ellipsis.tip {{item.name}}
                  button 取消关注
</template>
<style lang="stylus" scoped>
  @import "follow.styl"
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
        builder_follows:{},
        company_follows:{},
        project_follows:{},
        tender_follows:{}
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
          url: api.member_follow,
          success: (data) => {
            this.builder_follows = data.builder_follows;
            this.company_follows = data.company_follows;
            this.project_follows = data.project_follows;
            this.tender_follows = data.tender_follows;
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
