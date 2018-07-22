<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title {{baseData.user_name  || '姓名'}}
      .hide-module
        .modoule-top
          .user-head
            i.iconfont.icon-Avatar
          .user-sign {{baseData.level  || '建造师等级'}}
          .user-focus(@tap="follow", :class="[followed ? '':'bg-gary']") {{followed?'已关注':'关注'}}
          .user-share(@tap="share(shareData)") 分享

    .mui-content
      loading(ref="loading")
      .scroll-wrapper#builderTender(v-show="dataLock")
        .scroll-box
          .cell-row
            .base-msg
              .module2
                div.overflow-auto
                  .fl.text-color-black 执业印章号
                  .fr {{baseData.register_no}}
              .module2(v-for="(item,index) in baseData.professional_list")
                div.text-color-black.listTitle(v-if="index === 0") 证书列表
                div.overflow-auto
                  .fl {{item.professional}}
                  .fr {{item.expire_date}}过期
                div 证书编号：{{item.certificate_no}}
              .module2
                div.overflow-auto
                  .fl
                    span.text-color-black 中标总数
                    span  {{baseData.tender_sucess_num}}
                  .fr
                    span.text-color-black 最近中标
                    span  {{baseData.last_tender_sucess_date}}
              .module2
                div.overflow-auto
                  .fl.text-color-black 注册公司
                  .fr {{baseData.company_name}}
              .module3
                span(v-for="sign in baseData.province_list")
                  i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                  span {{sign.name}}
          .cell-row
            .pro-group
              .pro-item(v-for="item in builderTenderData.data", @tap="openDetail('detail',{rid:item.rid,type:2})")
                .pro-time
                  i.iconfont.icon-time
                  span  &nbsp;{{item.tender_date}}
                .pro-content
                  .pro-main
                    .pro-name.mui-ellipsis-2 {{item.title}}
                    .pro-main-sign
                      span.pro-company {{item.company_name}}
                  .pro-assist
                    .pro-price
                      span {{item.tender_je}}
                      | 万
                    .pro-location {{item.province}}{{item.city? '/'+item.city:''}}{{item.district?'/'+item.district:''}}
</template>
<style lang="stylus" scoped>
  @import "builderDetail.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import myMethods from '../../assets/js/methods'
  import loading from "../../components/loading"

  export default {
    name: 'builderDetail',
    data() {
      return {
        dataLock: false,
        rid: '',
        baseData: {},
        builderTenderData: {
          pageNum: 1,
          data: {}
        },
        followed: false,
        shareData:{},
      }
    },
    components: {
      loading: loading
    },
    mounted() {
      let vueThis = this;
      mui.init({
        pullRefresh: [{
          container: '#builderTender',
          down: {
            callback: function () {
              vueThis.builderTenderData.pageNum = 1;
              http({
                url: api.search_builder_detail,
                data: {code: vueThis.rid},
                success: (data) => {
                  vueThis.baseData = data;
                  vueThis.builderTenderData.data = data.tender_success_list;
                  vueThis.followed = data.followed;
                  mui('#builderTender').pullRefresh().endPulldownToRefresh();
                }
              })
            }
          },
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.builderTenderData.pageNum += 1;
              http({
                url: api.search_builder_tender_success,
                data: {
                  cur_page: vueThis.builderTenderData.pageNum,
                  code:vueThis.rid,
                }, success: (data) => {
                  vueThis.builderTenderData.data = vueThis.builderTenderData.data.concat(data.result);
                  if (data.total_page === vueThis.builderTenderData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }]
      });
      window.addEventListener('getData', (e) => {
        vueThis.rid = e.detail.rid;
        vueThis.dataLock = false;
        vueThis.getData();
      });
      mui.plusReady(() => {
        this.updateSerivces();
      })
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        this.baseData = {};
        this.builderTenderData = {
          pageNum: 1,
          data: {}
        };
        http({
          url: api.search_builder_detail,
          data: {code: this.rid},
          success: (data) => {
            this.baseData = data;
            this.builderTenderData.data = data.tender_success_list;
            this.followed = data.followed;
            this.$refs.loading.hide();
            this.dataLock = true;
            this.shareData = {
              title:this.baseData.user_name,
              type:2,
              id:this.rid
            };
          }
        })
      },//关注按钮
      follow(key) {
        if (this.followed) {
          http({
            url: api.member_follow,
            method: 'delete',
            data: {
              rid: this.rid,
              type: 4
            },
            success: () => {
              this.followed = !this.followed;
              mui.toast('取消成功');
              let view = plus.webview.getWebviewById('follow');
              myMethods.muiFireLock(view,()=>{
                mui.fire(view,'followChange',{})
              })
            }
          })
        } else {
          http({
            url: api.member_follow,
            method: 'post',
            data: {
              rid: this.rid,
              type: 4
            },
            success: () => {
              this.followed = !this.followed;
              mui.toast('关注成功');
              let view = plus.webview.getWebviewById('follow');
              myMethods.muiFireLock(view,()=>{
                mui.fire(view,'followChange',{})
              })
            }
          })
        }
      },
      openDetail:myMethods.openDetail,
    }
  }
</script>
