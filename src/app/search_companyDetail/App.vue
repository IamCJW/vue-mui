<template lang="pug">
  #app
    header.detail-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title {{baseData.company_name}}
        span.iconfont.icon-MORES(@tap="menuShow(true)")
      .header-sign
        span 统一社会信用代码:{{baseData.credit_no}}
      .detail-nav-bar
        span.detail-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 基本信息
        span.detail-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 中标信息
        span.detail-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 建造师
        <!--span.detail-bar-item(@tap="jumpTo(3)", :class="{active: pageKey===3}") 工商信息-->
        <!--span.detail-bar-item(@tap="jumpTo(4)", :class="{active: pageKey===4}") 法律讼诉-->
    .mui-content
      loading(ref="loading")
      .content-wrapper(v-show="dataLock")
        .content-full-scroll(ref='barscroll')
          //基本信息
          .content-page(@swipeleft="contentSwipeleft()")
            .scroll-wrapper
              .scroll-box
                ul.media-view
                  li.media
                    .media-content.media-column
                      .media-lable 企业注册属地
                      .media-value {{baseData.register_address}}
                  li.media
                    .media-content.media-column
                      .media-lable 联系地址
                      .media-value {{baseData.address}}
                  li.media
                    .media-content.media-column
                      .media-lable 经营地区
                      .media-value
                        .com-records
                          span(v-for="sign in baseData.province_list")
                            i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                            span {{sign.name}}
                  li.media.media-more(v-if="baseData.contact_list !== []")
                    .media-content.iconfont(@tap="mediaAlert('phoneFlag')", :class="[phoneFlag ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 联系人
                    .media-alert(v-show="phoneFlag")
                      ul.media-view
                        li.media(v-for="item in baseData.contact_list")
                          .media-content
                            .media-lable {{item.name}}
                            .media-value.linkPhone
                              i.iconfont.icon-phone
                              a(:href="'tel:'+item.tel") {{item.tel}}
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('qualificationFlag')", :class="[qualificationFlag ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 企业资质
                    .media-alert(v-show="qualificationFlag")
                      ul.media-view
                        li.media(v-for="item in baseData.qualification_list")
                          .media-content
                            .media-lable {{item.name}}
                            .media-value {{item.level}}
          //中标
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper.cell-row#tenderSuccess
              .scroll-box
                .filter-wrapper
                  .filter.fl
                    span 共{{baseData.tender_sucess_num}}次中标
                  .filter(v-if='false')
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item(v-for="item in tenderSuccessData.data", @tap="openDetail('detail',{rid:item.rid,type:2})") {{item.rid}}
                    .pro-time
                      i.iconfont.icon-time
                      span  &nbsp;{{item.tender_date}}
                    .pro-content
                      .pro-main
                        .pro-name.mui-ellipsis-2 {{item.title}}
                        .pro-main-sign.mui-ellipsis
                          span.pro-style(:class="{'color-icon-SUPERVISION':item.tender_type === '监理','color-icon-design':item.tender_type === '设计','color-icon-INVESTIGATE':item.tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','color-icon-INTEGRATION':item.tender_type === '一体化','color-icon-OTHER':item.tender_type === '其他',}")
                            i.iconfont(:class="{'icon-SUPERVISION':item.tender_type === '监理','icon-design':item.tender_type === '设计','icon-INVESTIGATE':item.tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','icon-INTEGRATION':item.tender_type === '一体化','icon-OTHER':item.tender_type === '其他',}")
                            span &nbsp;{{item.tender_type}}
                          span.pro-location {{item.province}}{{item.city? '/'+item.city:''}}{{item.district?'/'+item.district:''}}
                      .pro-assist
                        .pro-price
                          span {{item.tender_je}}
                          | 万
                        .pro-endTime {{item.builder_name}}
          //建造师
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper.cell-row#builder
              .scroll-box
                .filter-wrapper
                  .filter.fl
                    span 共{{baseData.builder_num}}名建造师
                  .filter(v-if='false')
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .bui-group
                  .bui-item(v-for="item in builderData.data" @tap="openNViewPreload('builderDetail',{rid:item.rid})")
                    .bui-top
                      .bui-name {{item.user_name}}
                      .bui-id 注册号:{{item.register_no}}
                      div 中标数量:{{item.tender_sucess_num}}
                    .bui-mid
                      span.bui-sign 二级注册建造师
                      span.fr
                        span 专业数:{{item.professional_num}}
                        span 最近中标:{{item.last_tender_sucess_date}}
                    .bui-company {{item.company_name}}
                    .bui-records
                      span(v-for="sign in item.province_list")
                        i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                        span {{sign.name}}
          //工商信息
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()", v-if='false')
            .scroll-wrapper
              .scroll-box
                ul.media-view
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem1')", :class="[commercialItem1 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 基本信息
                    .media-alert(v-show="commercialItem1")
                      ul.media-view
                        li.media
                          .media-content
                            .media-lable.text-color-black 企业法人:{{commercialItem1Data.author}}
                        li.media
                          .media-content
                            .media-lable.text-color-black 经营状态:{{commercialItem1Data.status}}
                        li.media
                          .media-content
                            .media-lable.text-color-black 统一信用代码:{{commercialItem1Data.credit_no}}
                        li.media
                          .media-content
                            .media-lable.text-color-black 注册资金:{{commercialItem1Data.register_capital}}
                        li.media
                          .media-content
                            .media-lable.text-color-black 成立时间:{{commercialItem1Data.create_date}}
                        li.media
                          .media-content.media-column
                            .media-lable.text-color-black 登记机关:{{commercialItem1Data.apply_organization}}
                        li.media
                          .media-content.media-column
                            .media-lable.text-color-black 详细地址:{{commercialItem1Data.address}}
                        li.media
                          .media-content.media-column
                            .media-lable 经营范围
                            .media-value {{commercialItem1Data.scope}}
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem2')", :class="[commercialItem1 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 股东信息
                    .media-alert(v-show="commercialItem2")
                      ul.media-view(v-if="commercialData.partner_list")
                        li.media(v-for="item in commercialData.partner_list")
                          .media-content
                            div 股东名称:{{item.name}}
                            div 股东类型:{{item.type}}
                            div 认缴出资额:{{item.subcribe_amount}}万人民币
                            div 实缴出资额:{{item.confirm_amount}}万人民币
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem3')", :class="[commercialItem3 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 股东信息
                    .media-alert(v-show="commercialItem3")
                      ul.media-view
                        li.media(v-for="(item,index) in commercialData.person_list")
                          .media-content
                            .media-lable.text-color-black {{index+1}}.{{item.name}}
                            .media-value {{item.role}}
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem4')", :class="[commercialItem4 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 分支机构
                    .media-alert(v-show="commercialItem4")
                      ul.media-view
                        li.media(v-for="(item,index) in commercialData.branch_list")
                          .media-content
                            .media-lable.text-color-black {{index+1}}.{{item.name}}
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem5')", :class="[commercialItem5 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 变更信息
                    .media-alert(v-show="commercialItem5")
                      ul.media-view
                        li.media(v-for="item in commercialData.change_list")
                          .media-content
                            .change-header
                              span.time {{item.info_date}}
                              span.type 股东信息
                            .change-content
                              .change-before
                                p 变更前
                                p {{item.from}}
                              .change-after
                                p 变更后
                                p {{item.to}}
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem6')", :class="[commercialItem6 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 联系方式
                    .media-alert(v-show="commercialItem6")
                      ul.media-view
                        li.media
                          .media-content
                            .media-lable.text-color-black
                              i.iconfont.icon-CONTACT
                              span &nbsp;{{commercialItem6Data.tel}}
                        li.media
                          .media-content
                            .media-lable.text-color-black
                              i.iconfont.icon-sass
                              span &nbsp;{{commercialItem6Data.email}}
                        li.media
                          .media-content
                            .media-lable.text-color-black
                              i.iconfont.icon-coordinate
                              span &nbsp;{{commercialItem6Data.address}}
                  li.media.media-more
                    .media-content.iconfont(@tap="mediaAlert('commercialItem7')", :class="[commercialItem7 ? 'icon-Unfold' : 'icon-down']")
                      .media-lable 企业简介
                    .media-alert(v-show="commercialItem7")
                      ul.media-view
                        li.media
                          .media-content
                            .media-lable {{commercialData.remark}}
          //法律讼诉
          .content-page(@swiperight="contentSwiperight()", v-if='false')
            .scroll-wrapper#legalPage
              .scroll-box
                ul.media-view
                  li.media(v-for="item in legalData.data")
                    .media-content
                      .legal-title {{item.title}}
                    .media-content.iconfont.icon-right.legal-content
                      p 案件类型:{{item.type}}
                      p 身份:{{item.role}}
                      p 裁决日期:{{item.adjudge_date}}
                      p 公示日期:{{item.info_date}}
    .mask.menu(v-show="menuStatus", @tap="menuShow(false)")
      .popout
        .popout-arrow
        .funitem(@tap="share(shareData)")
          i.iconfont.icon-share
          span 分享企业
        .funitem.border-none(@tap="follow(followed)")
          i.iconfont.icon-attention-copy(:class="[followed ? 'text-color-third' : '']")
          span {{followed ? '已关注' : '关注企业'}}
</template>
<style lang="stylus" scoped>
  @import "companyDetail.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import myMethods from '../../assets/js/methods'
  import loading from "../../components/loading";

  export default {
    name: 'companyDetail',
    components: {loading: loading},
    data() {
      return {
        dataLock: false,
        rid: '',
        followed: false,
        menuStatus: false,//菜单状态
        pageKey: 1,//页面状态
        baseData: '',//基本信息
        phoneFlag: false,//联系人
        qualificationFlag: false,//企业资质展示
        tenderSuccessData: {
          pageNum: 1,
          data: []
        },//中标信息
        builderData: {
          pageNum: 1,
          data: []
        },//建造师
        commercialData: {partner_list: []},//工商信息
        commercialItem1Data: {},//工商基本信息
        commercialItem1: true,
        commercialItem2: false,
        commercialItem3: false,
        commercialItem4: false,
        commercialItem5: false,
        commercialItem6Data: {},
        commercialItem6: false,
        commercialItem7: false,
        legalData: {
          pageNum: 1,
          data: []
        },//法律讼诉
        shareData:{},
      }
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData', (e) => {
        vueThis.dataLock = false;
        vueThis.rid = e.detail.rid;
        vueThis.getData();
      });
      this.jumpTo(this.pageKey);
      mui.init({
        pullRefresh: [{
          container: '#tenderSuccess',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.tenderSuccessData.pageNum += 1;
              http({
                url: api.search_company_tender_success,
                data: {
                  code: vueThis.rid,//////////////////////////////////公司编码
                  cur_page: vueThis.tenderSuccessData.pageNum
                }, success: (data) => {
                  if (data.total_page <= vueThis.tenderSuccessData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.tenderSuccessData.data = vueThis.tenderSuccessData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }, {
          container: '#legalPage',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.legalData.pageNum += 1;
              http({
                url: api.search_company_legal,
                data: {
                  code: vueThis.rid,//////////////////////////////////公司编码
                  cur_page: vueThis.legalData.pageNum
                }, success: (data) => {
                  if (data.total_page <= vueThis.legalData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.legalData.data = vueThis.legalData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }, {
          container: '#builder',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.builderData.pageNum += 1;
              http({
                url: api.search_company_builder,
                data: {
                  code: vueThis.rid,//////////////////////////////////公司编码
                  cur_page: vueThis.builderData.pageNum
                }, success: (data) => {
                  if (data.total_page <= vueThis.builderData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.builderData.data = vueThis.builderData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }]
      });
      mui('.scroll-wrapper').scroll({
        indicators: false
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
        http({
          url: api.search_company_detail,
          data: {code: this.rid},
          success: (data) => {
            this.baseData = data;
            if (data.commercial_info !== undefined) {
              this.commercialData = data.commercial_info;
              this.commercialItem1Data = data.commercial_info.base_info;
              this.commercialItem6Data = data.commercial_info.contact_info;
            }
            this.legalData.data = data.legal_list || [];
            this.tenderSuccessData.data = data.tender_success_list || [];
            this.builderData.data = data.builder_list || [];
            this.followed = data.followed;
            this.$refs.loading.hide();
            this.dataLock = true;
            this.shareData = {
              title:this.baseData.company_name,
              type:3,
              id:this.rid
            };
          }
        })
      },
      openNViewPreload:myMethods.openNViewPreload,
      //页面切换
      jumpTo(key) {
        this.filterFlag = false;
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
      },
      //展开与收缩
      mediaAlert(key) {
        this[key] = !this[key];
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
              mui.toast('取消成功')
            }
          })
        } else {
          http({
            url: api.member_follow,
            method: 'post',
            data: {
              rid: this.rid,
              type: 3
            },
            success: () => {
              this.followed = !this.followed;
              mui.toast('关注成功')
            }
          })
        }
      },
      openDetail(url, data) {
        mui.plusReady(()=> {
          let detailPage = plus.webview.getWebviewById(url);
          mui.fire(detailPage, 'getData', data);
          myMethods.openWindow(url);
        });
      },
    }
  }
</script>
