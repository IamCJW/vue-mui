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
            .scroll-wrapper#page1
              .scroll-box
                ul.media-view
                  li.media(@tap="openWindow('searchProject')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加项目关注
                  li.media(v-for="item in project_follows.data", @tap="openWindow('detail',{rid:item.rid})")
                    .media-content
                      .head
                        i.iconfont.icon-SERVICE
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap="follow(item.rid,1)") 取消关注
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page2
              .scroll-box
                ul.media-view
                  li.media(@tap="openWindow('searchProject')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加业主关注
                  li.media(v-for="item in company_follows.data", @tap="openWindow('detail',{rid:item.rid})")
                    .media-content
                      .head
                        i.iconfont.icon-SERVICE
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap="follow(item.rid,2)") 取消关注
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page3
              .scroll-box
                ul.media-view
                  li.media(@tap="openWindow('searchCompany')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加建筑企业关注
                  li.media(v-for="item in company_follows.data", @tap="openWindow('companyDetail',{rid:item.rid})")
                    .media-content
                      .head
                        i.iconfont.icon-SERVICE
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap="follow(item.rid,3)") 取消关注
          .content-page(@swiperight="contentSwiperight()")
            .scroll-wrapper#page4
              .scroll-box
                ul.media-view
                  li.media(@tap="openWindow('searchBuilder')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加建造师关注
                  li.media(v-for="item in builder_follows.data", @tap="openWindow('builderDetail',{rid:item.rid})")
                    .media-content
                      .head
                        i.iconfont.icon-anquanmao
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap="follow(item.rid,4)") 取消关注
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
        pageKey: 0,
        builder_follows: {
          pageNum: 1,
          data: []
        },
        company_follows: {
          pageNum: 1,
          data: []
        },
        project_follows: {
          pageNum: 1,
          data: []
        },
        tender_follows: {
          pageNum: 1,
          data: []
        }
      }
    },
    mounted() {
      let vueThis = this;
      mui.init({
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.project_follows.pageNum += 1;
              http({
                url: api.member_follow_project,
                data: {
                  cur_page: vueThis.project_follows.pageNum
                }, success: (data) => {
                  vueThis.project_follows.data = vueThis.project_follows.data.concat(data.result);
                  if (data.total_page === vueThis.project_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        },{
          container: '#page2',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.company_follows.pageNum += 1;
              http({
                url: api.member_follow_company,
                data: {
                  cur_page: vueThis.company_follows.pageNum
                }, success: (data) => {
                  vueThis.company_follows.data = vueThis.company_follows.data.concat(data.result);
                  if (data.total_page === vueThis.company_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        },{
          container: '#page3',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.tender_follows.pageNum += 1;
              http({
                url: api.member_follow_tender,
                data: {
                  cur_page: vueThis.tender_follows.pageNum
                }, success: (data) => {
                  vueThis.tender_follows.data = vueThis.tender_follows.data.concat(data.result);
                  if (data.total_page === vueThis.tender_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        },{
          container: '#page4',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.builder_follows.pageNum += 1;
              http({
                url: api.member_follow_tender,
                data: {
                  cur_page: vueThis.builder_follows.pageNum
                }, success: (data) => {
                  vueThis.builder_follows.data = vueThis.builder_follows.data.concat(data.result);
                  if (data.total_page === vueThis.builder_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        },]
      });
      this.jumpTo(this.pageKey);
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        this.builder_follows={
          pageNum: 1,
            data: []
        };
        this.company_follows={
          pageNum: 1,
            data: []
        };
        this.project_follows= {
          pageNum: 1,
            data: []
        };
        this.tender_follows= {
          pageNum: 1,
            data: []
        };
        http({
          url: api.member_follow,
          success: (data) => {
            this.builder_follows.data = data.builder_follows;
            this.company_follows.data = data.company_follows;
            this.project_follows.data = data.project_follows;
            this.tender_follows.data = data.tender_follows;
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
      },//关注按钮
      follow(id, type) {
        mui.confirm('确定取消该关注', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_follow,
              method: 'post',
              data: {rid: id, type: type},
              success: (data) => {
                this.getData()
              }
            })
          }
        })
      },
      openWindow:myMethods.openWindow,
    }
  }
</script>
