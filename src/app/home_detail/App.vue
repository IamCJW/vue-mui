<template lang="pug">
  #app
    header.detail-header.fixed-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title {{tender_info.name}}
        span.iconfont.icon-MORES(@tap="menuShow(true)")
      .header-sign
        .fl
          span 行业: {{tender_info.tender_type}}
          span 专业：{{tender_info.construction_type}}
        span.fr {{tender_info.province}}{{ tender_info.city ? ' / '+ tender_info.city : ''}}{{tender_info.district ? ' / '+ tender_info.district:''}}
      .detail-nav-bar(v-if="navigate_list.length")
        span.detail-bar-item(v-for="item in navigate_list", v-if="item.name === '招标公告'" , :class="{active:'招标公告' === navPage}", @tap="navSelect('招标公告',zbRid,0)") {{item.name}}
        span.detail-bar-item(v-for="item in navigate_list", v-if="item.name !== '招标公告' " , :class="{active:item.name === navPage}", @tap="navSelect(item.name,item.rid,item.info_type)") {{item.name}}
    header.detail-header
      .header-title
        .detail-title {{tender_info.name}}
      .header-sign
        .fl
          span 占位
      .detail-nav-bar(v-if="navigate_list.length")
        span.detail-bar-item 占位
    warn(icon='icon-404', msg='抱歉！该项目资料暂未获取完全，请稍候查看~~', :show="warnState")
    .mui-content(v-if="dataLock")
      //招标公示
      .content-table(v-show="navPage === '招标公告'")
        table.main
          tr
            td(colspan="3")
              .time 发布时间: {{pushMsg.info_date}}
          tr
            td.th 招标人
            td(colspan="2") {{tender_info.tender_name}}
          tr
            td.th 资质要求
            td(colspan="2") {{tender_info.enterprise_requirement}}
          tr
            td.th 标段数量
            td(colspan="2") {{pushMsg.section_num}}
          tr(v-for="(item,index) in pushMsg.section_info")
            td.th
              span(v-if="index === 0") 标段金额
            td {{item.name}}
            td(v-if="item.amount") {{item.amount|moneyConversion}}万
            td(v-if="!item.amount") 未知
          tr
            td.th 信息来源
            td(colspan="2",@tap="openNViewView('otherPage',{otherUrl:pushMsg.url},pushMsg.resource)") {{pushMsg.resource}}
              a.fz10.mui-ellipsis [点击查看原文]
          tr
            td.th(colspan="3") 原文内容
        .orContent(v-html="pushMsg.content") {{'<div class="orContent">'+pushMsg.content+'</div>'}}

      // 中标
      .content-table(v-show="navPage === '中标'")
        table.main
          tr
            td(colspan="4")
              .time 发布时间: {{pullMsg.info_date}}
          tr
            td.th 招标人
            td(colspan="3") {{tender_info.tender_name}}
          tr(v-if="pullMsg.proxy_name")
            td.th 招标代理
            td(colspan="3") {{pullMsg.proxy_name}}
          template(v-for="(item,index) in pullMsg.section_info")
            tr
              td.text-color-main.th(colspan="4") 标段名称:{{item.name}}
            tr
              td.th 中标单位
              td(colspan="3", @tap="openDetail('companyDetail',{rid:item.code})") {{item.company_name}}
                a.fz10.mui-ellipsis [查看企业详情]
            tr
              td.th 中标金额
              td(colspan="3") {{item.tender_je | moneyConversion}}万
            tr(v-if="item.builder_name !== ''")
              td.th {{tender_info.tender_type === '监理'?'总监':''}}{{tender_info.tender_type === '设计'|| tender_info.tender_type === '勘察' ||tender_info.tender_type === '一体化'?'项目负责人':''}}{{tender_info.tender_type !== '监理'&&tender_info.tender_type !== '设计'&& tender_info.tender_type !== '勘察' &&tender_info.tender_type !== '一体化'?'建造师':''}}
              td.th(@tap="openDetail('builderDetail',{company_name:item.company_name,register_no:item.certificate_no,user_name:item.builder_name})")
                span.mui-ellipsis {{item.builder_name}}
                a.fz10.mui-ellipsis [查看详情]
              td.th 注册证书
              td.mui-ellipsis {{item.certificate_no}}
          tr
            td.th 信息来源
            td(colspan="3",@tap="openNViewView('otherPage',{otherUrl:pullMsg.url},pullMsg.resource)") {{pullMsg.resource}}
              a.fz10.mui-ellipsis [查看原文]
          tr
            td.th(colspan="4") 原文内容
        .orContent(v-html="pullMsg.content") {{pullMsg.content}}
      // 其他
      .content-table(v-show="navPage !== '中标' && navPage !== '招标公告'")
        table.main
          tr
            td(colspan="4")
              .time 发布时间: {{otherMsg.info_date}}
          tr
            td.th 信息来源
            td(colspan="3" , @tap="openNViewView('otherPage',{otherUrl:otherMsg.url},otherMsg.resource)") {{otherMsg.resource}}
              a.fz10.mui-ellipsis [点击查看原文]
          tr
            td.th(colspan="4") 原文内容
        .orContent(v-html="otherMsg.content") {{otherMsg.content}}
    footer(v-show="dataLock")
      .btn-group
        .btn-item(v-if="tender_info.tel")
          a(:href="'tel:'+ tender_info.tel")
            i.iconfont.icon-CONTACT
            span 联系招标方
        <!--.btn-item(@tap="ysf")-->
        <!--i.iconfont.icon-CUSTOMERSERVICE-->
        <!--span 联系客服-->
        .btn-item.buy(@tap="follow")
          i.iconfont.icon-attention(:class="{active: followStatus}")
          span {{followStatus ? '已关注' : '关注项目' }}
        .btn-item.buy(@tap="buy",v-if="false") {{!buyType.show ? '购买投标保函':''}}{{buyType.show&&buyType.type === 0 ? '选择投标保函':''}}{{buyType.show&&buyType.type !== 0 ? '购买':''}}
    .mask.buyType(v-show="buyType.show",@tap="closeMask")
      .popout
        button(@tap.stop="changeType(1)" , :class="{active : buyType.type === 1}") 购买投标基本户保函
        button(@tap.stop="changeType(2)" , :class="{active : buyType.type === 2}") 购买招标保函
    .mask.menu(v-show="menuStatus", @tap="menuShow(false)")
      .popout
        .popout-arrow
        .funitem(@tap="share(shareData)" )
          i.iconfont.icon-share
          span 分享项目
        .funitem.border-none(@tap.stop="warnShow")
          i.iconfont.icon-warning
          span 项目报错
    .mask.warn(v-if="warnStatus")
      .popout
        .title 项目报错
          .i.iconfont.icon-CLOSE(@tap="warnClose")
        .signGroup
          .sign-item
            ul.media-view
              li.media(v-for="(item,key) in warnList" , @tap="chooseWarn(key)")
                .media-content
                  i.iconfont.mr-cell(:class="[item ? 'icon-selectss' : 'icon-CIRCLE']")
                  span {{key}}
        .fixed-bottom-btn(@tap="submitWarn") 提交错误
</template>
<style lang="stylus">
  @import "detail.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import myMethods from '../../assets/js/methods'
  import warn from '../../components/warn'

  export default {
    name: 'detail',
    data() {
      return {
        warnState:false,
        dataLock: false,//数据锁
        warnStatus: false,
        warnList: {
          '招标': false,
          '中标': false,
          '答疑': false,
          '变更': false,
          '澄清': false,
          '资审': false,
          '流标': false,
          '废标': false,
          '补遗': false,
          '其他': false,
        },
        menuStatus: false,
        followStatus: false,
        buyType: {
          type: 0,
          show: false
        },
        pushMsg: {},
        pullMsg: {},
        otherMsg: {},
        tender_info: {
          name: '',
          tender_type: '',
          construction_type: '',
          province: '',
          city: '',
          district: '',
          tel: '',
          followed: ''
        },
        navPage: '',
        zbRid: '',
        navigate_list: [],
        shareData: {},
      }
    },
    components:{
      warn:warn
    },
    mounted() {
      let vueThis = this;
      mui.init({
        beforeback: () => {
          let view = plus.webview.getWebviewById('message');
          myMethods.muiFireLock(view, () => {
            if (plus.storage.getItem('station')) {
              mui.fire(view, 'readed', {});
            }
          });
          return true;
        }
      });
      window.addEventListener('getData', (e) => {
        vueThis.dataLock = false;
        vueThis.tender_info = {
          name: '',
          tender_type: '',
          construction_type: '',
          province: '',
          city: '',
          district: '',
          tel: '',
          followed: ''
        };
        vueThis.navigate_list = [];
        let muiData = e.detail;
        if (muiData.type === 1) {
          this.zbRid = muiData.rid;
        }
        this.getData(muiData);
      });
      mui.plusReady(() => {
        this.updateSerivces();
      })
    },
    created() {

    },
    methods: {
      //数据请求
      getData(data) {
        this.warnState = false;
        let rid = data.rid;
        let type = data.type || 1;
        switch (type) {
          case 1:
            http({
              url: api.tender_id,
              data: {rid: rid},
              success: (data) => {
                this.pushMsg = data;
                this.navigate_list = data.navigate_list;
                this.tender_info = data.tender_info;
                this.navPage = '招标公告';
                this.followStatus = data.tender_info.followed;
                this.dataLock = true;
                this.shareData = {
                  title: data.tender_info.name,
                  type: 1,
                  id: this.zbRid
                };
              },
              noFind:()=>{
                this.warnState = true;
              }
            });
            break;
          case 2:
            http({
              url: api.tender_success_detail,
              data: {rid: rid},
              success: (data) => {
                this.pullMsg = data;
                this.navigate_list = data.navigate_list;
                this.navPage = '中标';
                this.followStatus = data.tender_info.followed;
                this.dataLock = true;
                this.zbRid = data.tender_info.tender_id;
                this.tender_info = data.tender_info;
                this.shareData = {
                  title: data.tender_info.name,
                  type: 1,
                  id: this.zbRid
                };
              },
              noFind:()=>{
                this.warnState = true;
              }
            });
            break;
          case 3:
            http({
              url: api.project_relation_info_detail,
              data: {rid: rid},
              success: (data) => {
                this.otherMsg = data;
                this.navigate_list = data.navigate_list;
                data.navigate_list.forEach((item) => {
                  if (item.rid === rid) {
                    this.navPage = item.name;
                  }
                });
                this.followStatus = data.tender_info.followed;
                this.tender_info = data.tender_info;
                this.dataLock = true;
                this.zbRid = data.tender_info.tender_id;
                this.shareData = {
                  title: data.tender_info.name,
                  type: 1,
                  id: this.zbRid
                };
              },
              noFind:()=>{
                this.warnState = true;
              }
            });
            break;
        }
      },
      openDetail: myMethods.openDetail,
      openNViewPreload: myMethods.openNViewPreload,
      openNViewView(url, data, title) {
        mui.openWindow({
          url: `./${url}.html`,
          id: url,
          extras: data,
          styles: {
            titleNView: {
              titleText: title,
              titleColor: "#ffffff",
              titleSize: "16px",
              backgroundColor: "#04a3ee",
              progress: {
                color: "#f4d10d",
                height: "2px"
              },
              buttons: [{
                text: '\ue643',
                color: '#ffffff',
                fontSize: "18px",
                fontSrc: '_www/static/iconfont.ttf',
                float: 'right',
                onclick: () => {
                  mui.plusReady(() => {
                    plus.runtime.openURL(data.otherUrl);
                  })
                }
              }],
              autoBackButton: true,
            }
          }
        });
      },
      //内容选择
      navSelect(key, rid, type) {
        this.navPage = key;
        switch (type) {
          case 0:
            http({
              url: api.tender_id,
              data: {rid: rid},
              success: (data) => {
                this.pushMsg = data;
              }
            });
            break;
          case 1:
            http({
              url: api.tender_success_detail,
              data: {rid: rid},
              success: (data) => {
                this.pullMsg = data;
              }
            });
            break;
          default:
            http({
              url: api.project_relation_info_detail,
              data: {rid: rid},
              success: (data) => {
                this.otherMsg = data;
                this.navigate_list = data.navigate_list;
              }
            });
            break;
        }
      },
      //购买按钮
      buy() {
        if (this.buyType.type === 0 && this.buyType.show === true) {
          mui.toast('请选择购买类型')
        } else if (this.buyType.type !== 0 && this.buyType.show === true) {
          this.buyType.show = false;
          mui.toast('购买成功')
        } else {
          this.buyType.show = true;
        }
      },
      //更改购买类型
      changeType(key) {
        this.buyType.type = key;
      },
      //关闭购买
      closeMask() {
        this.buyType.show = false;
      },
      //更多
      menuShow(key) {
        this.menuStatus = key;
      },
      //关注按钮功能
      follow() {
        if (this.followStatus) {
          http({
            url: api.member_follow,
            method: 'delete',
            data: {
              rid: this.zbRid,
              type: 1
            },
            success: () => {
              mui.toast('取消关注');
              this.followStatus = !this.followStatus;
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
              rid: this.zbRid,
              type: 1
            },
            success: () => {
              mui.toast('关注成功');
              this.followStatus = !this.followStatus;
              let view = plus.webview.getWebviewById('follow');
              myMethods.muiFireLock(view, () => {
                mui.fire(view, 'followChange', {})
              })
            }
          })
        }
      },
      //选择错误
      chooseWarn(key) {
        this.$set(this.warnList, key, !this.warnList[key])
      },
      //提交错误
      submitWarn() {
        let data = '';
        for (let item in this.warnList) {
          if (this.warnList[item]) {
            data += `${item},`
          }
        }
        if (data === '') {
          mui.toast('请选择错误选项');
          return
        }
        http({
          url: api.member_advice_wrong,
          method: 'post',
          data: {
            tag: data,
            tender_id: this.zbRid
          },
          success: () => {
            mui.toast('已报错');
            this.warnStatus = false;
          }
        })
      },
      //错误展示
      warnShow() {
        this.warnStatus = true;
        this.menuStatus = false;
      },
      //错误关闭
      warnClose() {
        this.warnStatus = false;
      },
      //客服////
      ysf() {
        let url = ysf.url();
        myMethods.openNViewPreload('chat', {
          chatUrl: url
        })
      },
    }
  }
</script>
