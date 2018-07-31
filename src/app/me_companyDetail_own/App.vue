<template lang="pug">
  #app
    header.detail-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title {{baseData.company_name || '公司名称'}}
        span.iconfont.icon-MORES(@tap="menuShow(true)")
      .header-sign
        span {{baseData.province || '省份'}} / {{baseData.city || '城市'}}
    .mui-content
      loading(ref='loading')
      warn(icon='icon-404', msg='抱歉！该企业资料暂未获取完全,请稍候查看~', v-show="warnState")
      .content-page
        .scroll-wrapper.cell-row#proGroup
          .scroll-box
            .pro-group
              .pro-item(v-for="item in proData.data")
                .pro-time
                  i.iconfont.icon-time
                  span  &nbsp;{{item.info_date}}
                .pro-content
                  .pro-main
                    .pro-name.mui-ellipsis-2 {{item.name}}
                    .pro-main-sign.mui-ellipsis
                      span.pro-style(:class="{'color-icon-SUPERVISION':item.tender_type === '监理','color-icon-design':item.tender_type === '设计','color-icon-INVESTIGATE':item.tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','color-icon-INTEGRATION':item.tender_type === '一体化','color-icon-OTHER':item.tender_type === '其他',}")
                        i.iconfont(:class="{'icon-SUPERVISION':item.tender_type === '监理','icon-design':item.tender_type === '设计','icon-INVESTIGATE':item.tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','icon-INTEGRATION':item.tender_type === '一体化','icon-OTHER':item.tender_type === '其他',}")
                        span &nbsp;{{item.tender_type}}
                      span.pro-location {{item.province}}{{item.city? '/'+item.city:''}}{{item.district?'/'+item.district:''}}
                  .pro-assist
                    .pro-endTime {{item.end_datetime}}
                    .pro-price
                      span {{item.amount | moneyConversion}}
                      | {{item.amount ? '万元' :'未知'}}
      .mask.menu(v-show="menuStatus", @tap="menuShow(false)")
        .popout
          .popout-arrow
          .funitem(@tap="share(shareData)")
            i.iconfont.icon-share
            span 分享业主
          .funitem.border-none(@tap="follow(followed)")
            i.iconfont.icon-attention-copy(:class="[followed ? 'text-color-third' : '']")
            span {{followed ? '已关注' : '关注业主'}}
</template>
<style lang="stylus" scoped>
  @import "companyDetail_own.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import loading from '../../components/loading'
  import warn from '../../components/warn'

  export default {
    name: 'companyDetail',
    data() {
      return {
        menuStatus: false,//菜单状态
        followed: false,
        baseData: {},
        proData: {
          pageNum: 1,
          data: []
        },
        rid: '',
        shareData: {},
        warnState: false,
      }
    },
    components: {
      loading: loading,
      warn: warn
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData', (e) => {
        this.rid = e.detail.rid;
        this.getData();
      });
      mui.init({
        pullRefresh: [{
          container: '#proGroup',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.proData.pageNum += 1;
              http({
                url: api.search_tender_company_list,
                data: {
                  code: vueThis.rid,//////////////////////////////////公司编码
                  cur_page: vueThis.proData.pageNum
                },
                success: (data) => {
                  vueThis.proData.data = vueThis.proData.data.concat(data.result);
                  if (data.total_page === vueThis.proData.pageNum) {
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
        this.warnState = false;
        http({
          url: api.search_tender_company_detail,
          data: {code: this.rid},
          success: (data) => {
            this.baseData = data;
            this.proData.data = data.result;
            this.followed = data.followed;
            this.$refs.loading.hide();
            mui('#page1').pullRefresh().scrollTo(0, 0, 100);
            this.shareData = {
              title: this.baseData.company_name,
              type: 4,
              id: this.rid
            };
          },
          noFind: () => {
            this.$refs.loading.hide();
            this.warnState = true;
          }
        })
      },//更多
      menuShow(key) {
        this.menuStatus = key;
      },//关注按钮
      follow(key) {
        if (this.followed) {
          http({
            url: api.member_follow,
            method: 'delete',
            data: {
              rid: this.rid,
              type: 3
            },
            success: () => {
              this.followed = !this.followed;
              mui.toast('取消成功');
              let view = plus.webview.getWebviewById('follow');
              myMethods.muiFireLock(view, () => {
                mui.fire(view, 'followChange', {})
              })
            }
          })
        } else {
          http({
            url: api.member_follow,
            method: 'post',
            data: {
              rid: this.rid,
              type: 2
            },
            success: () => {
              this.followed = !this.followed;
              mui.toast('关注成功');
              let view = plus.webview.getWebviewById('follow');
              myMethods.muiFireLock(view, () => {
                mui.fire(view, 'followChange', {})
              })
            }
          })
        }
      },
    }
  }
</script>
