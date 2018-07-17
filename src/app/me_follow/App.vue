<template lang="pug">
  #app
    .detail-nav-bar
      span.detail-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 项目
      span.detail-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 业主
      span.detail-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 建筑企业
      span.detail-bar-item(@tap="jumpTo(3)", :class="{active: pageKey===3}") 建造师
    .mui-content
      loading(ref="loading")
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .scroll-wrapper#page1
              .scroll-box
                template(v-if='!project_follows.data.length && dataLock')
                  .none
                    i.iconfont.icon-xiangmu
                    span 暂未关注项目~
                  button.mid-btn(@tap="openDetail('searchProject')") 添加项目关注
                ul.media-view(v-if='project_follows.data.length && dataLock')
                  li.media(@tap="openDetail('searchProject')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加项目关注
                  li.media(v-for="item in project_follows.data", @tap="openDetail('detail',{rid:item.code})")
                    .media-content
                      .head
                        i.iconfont.icon-xiangmu
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap.stop="follow(item.code,1)") 取消关注
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page2
              .scroll-box
                template(v-if='!company_follows.data.length && dataLock')
                  .none
                    i.iconfont.icon-yezhu
                    span 暂未关注业主~
                  button.mid-btn(@tap="openDetail('searchCompany_own')") 添加业主关注
                ul.media-view(v-if='company_follows.data.length && dataLock')
                  li.media(@tap="openDetail('searchCompany_own')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加业主关注
                  li.media(v-for="item in tender_follows.data", @tap="openDetail('companyDetail_own',{rid:item.code})")
                    .media-content
                      .head
                        i.iconfont.icon-yezhu
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap.stop="follow(item.code,2)") 取消关注
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page3
              .scroll-box
                template(v-if='!company_follows.data.length && dataLock')
                  .none
                    i.iconfont.icon-yezhu
                    span 暂未关注建筑企业~
                  button.mid-btn(@tap="openDetail('searchCompany')") 添加建筑企业关注
                ul.media-view(v-if='company_follows.data.length && dataLock')
                  li.media(@tap="openDetail('searchCompany')")
                    .media-content.add
                      i.iconfont.icon-jianzhuqiye &nbsp;
                      span 添加建筑企业关注
                  li.media(v-for="item in company_follows.data", @tap="openDetail('companyDetail',{rid:item.code})")
                    .media-content
                      .head
                        i.iconfont.icon-jianzhuqiye
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap.stop="follow(item.code,3)") 取消关注
          .content-page(@swiperight="contentSwiperight()")
            .scroll-wrapper#page4
              .scroll-box
                template(v-if='!builder_follows.data.length && dataLock')
                  .none
                    i.iconfont.icon-ren-copy
                    span 暂未关注建造师~
                  button.mid-btn(@tap="openDetail('searchBuilder')") 添加建造师关注
                ul.media-view(v-if='builder_follows.data.length && dataLock')
                  li.media(@tap="openDetail('searchBuilder')")
                    .media-content.add
                      i.iconfont.icon-attentions &nbsp;
                      span 添加建造师关注
                  li.media(v-for="item in builder_follows.data", @tap="openDetail('builderDetail',{rid:item.code})")
                    .media-content
                      .head
                        i.iconfont.icon-ren-copy
                      .content
                        .mui-ellipsis {{item.name}}
                        .mui-ellipsis.tip {{item.name}}
                      button(@tap.stop="follow(item.code,4)") 取消关注
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
  import loading from "../../components/loading";

  export default {
    name: 'coupon',
    components: {loading},
    data() {
      return {
        dataLock:false,
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
      this.getData();
      window.addEventListener('getData',()=>{
        this.getData();
        mui.plusReady(()=>{
          mui.preload({
            url: './builderDetail.html',
            id: 'builderDetail'
          });
          mui.preload({
            url: './companyDetail.html',
            id: 'companyDetail'
          });
          mui.preload({
            url: './companyDetail_own.html',
            id: 'companyDetail_own'
          });
          mui.preload({
            url: './searchCompany.html',
            id: 'searchCompany'
          });
          mui.preload({
            url: './searchBuilder.html',
            id: 'searchBuilder'
          });
          mui.preload({
            url: './searchCompany_own.html',
            id: 'searchCompany_own'
          });
        })
      });
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
                  if (data.total_page <= vueThis.project_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.project_follows.data = vueThis.project_follows.data.concat(data.result);
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
                  if (data.total_page <= vueThis.company_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.company_follows.data = vueThis.company_follows.data.concat(data.result);
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
                  if (data.total_page <= vueThis.tender_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.tender_follows.data = vueThis.tender_follows.data.concat(data.result);
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
                  if (data.total_page <= vueThis.builder_follows.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.builder_follows.data = vueThis.builder_follows.data.concat(data.result);
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
    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        http({
          url: api.member_follow,
          success: (data) => {
            this.builder_follows.data = data.builder_follows || [];
            this.company_follows.data = data.company_follows || [];
            this.project_follows.data = data.project_follows || [];
            this.tender_follows.data = data.tender_follows || [];
            mui('#page1').pullRefresh().scrollTo(0,0,100);
            mui('#page2').pullRefresh().scrollTo(0,0,100);
            mui('#page3').pullRefresh().scrollTo(0,0,100);
            mui('#page4').pullRefresh().scrollTo(0,0,100);
            this.$refs.loading.hide();
            this.dataLock = true;
          },
        });
      },
      //页面切换
      jumpTo(key) {
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
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
              method: 'delete',
              data: {rid: id, type: type},
              success: (data) => {
                this.getData()
              }
            })
          }
        },'div')
      },
      openWindow:myMethods.openWindow,
      openDetail(url,data) {
        mui.plusReady(function () {
          let detailPage = plus.webview.getWebviewById(url);
          if (!detailPage) {
            mui.toast('目标正在初始化，请稍候~')
          }
          mui.fire(detailPage, 'getData', data);
          myMethods.openWindow(url);
        });
      },
    }
  }
</script>
