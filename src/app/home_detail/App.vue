<template lang="pug">
  #app
    header.detail-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title {{msg.tender_info.name}}
        span.iconfont.icon-MORES
      .header-sign
        .fl
          span 行业: {{msg.tender_info.tender_type}}
          span 专业：{{msg.tender_info.construction_type}}
        span.fr {{msg.tender_info.province}} / {{msg.tender_info.city}} / {{msg.tender_info.district}}
      .detail-nav-bar
        span.detail-bar-item( :class="{active:'招标公告' === navPage}", @tap="navSelect('招标公告')") 招标公告
        span.detail-bar-item(v-for="item in msg.navigate_list", :class="{active:item.name === navPage}", @tap="navSelect(item.name)") {{item.name}}
    .mui-content
      //招标公示
      .content-table(v-show="navPage === '招标公告'")
        table
          tr
            td(colspan="3")
              .time 发布时间: {{msg.info_date}}
          tr
            td.th 招标人
            td(colspan="2") {{msg.tender_info.tender_name}}
          tr
            td.th 标段数量
            td(colspan="2") {{msg.section_num}}
            td
          tr(v-for="(item,index) in msg.section_info")
            td.th
              span(v-if="index === 0") 标段金额
            td {{item.name}}
            td {{item.amount}}万
          tr
            td.th 信息来源
            td(colspan="2") {{msg.resource}}
          tr
            td.th 原文内容
            td(colspan="2")
          tr
            td.td(colspan="3")
              .orContent {{msg.content}}
      // 中标公示
      .content-table(v-show="navPage === '中标公示'")
        table
          tr
            td(colspan="4")
              .time 发布时间: {{msg.info_date}}
          tr
            td.th 招标人
            td(colspan="3") {{msg.tender_info.tender_name}}
          tr
            td.th 招标代理
            td(colspan="3") {{msg.proxy_name}}
            td
          template(v-for="(item,index) in msg.section_info")
            tr
              td.th(colspan="4") {{item.name}}
            tr
              td.th 中标单位
              td(colspan="3") {{item.company_name}}
            tr
              td.th 中标金额
              td(colspan="3") {{item.tender_je}}
            tr
              td.th 建筑师名称
              td.th {{item.builder_name}}
              td.th 建筑师证书
              td {{item.certificate_no}}
          tr
            td.th 信息来源
            td(colspan="3") {{msg.resource}}
          tr
            td.th 原文内容
            td(colspan="3")
          tr
            td.td(colspan="4")
              .orContent {{msg.content}}
      // 中标公示
      .content-table(v-show="navPage !== '中标公示' && navPage !== '招标公告'")
        table
          tr
            td(colspan="4")
              .time 发布时间: {{msg.info_date}}
          tr
            td.th 信息来源
            td(colspan="3") {{msg.resource}}
          tr
            td.th 原文内容
            td(colspan="3")
          tr
            td.td(colspan="4")
              .orContent {{msg.content}}
    footer
      .btn-group
        .btn-item
          i.iconfont.icon-CONTACT
          span 联系招标方
        .btn-item
          i.iconfont.icon-CUSTOMERSERVICE
          span 联系客服
        .btn-item
          i.iconfont.icon-attention
          span 关注项目
        .btn-item.buy 购买投标保函

</template>
<style lang="stylus" scoped>
  @import "detail.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'selectlocation',
    data() {
      return {
        msg:{},
        navPage:''
      }
    },
    mounted() {
      this.getData()
    },
    created() {

    },
    methods: {
      //数据请求
      getData(){
        http({
          url:api.tender_success_detail,
          data:{rid:'rid'},
          success:(data)=>{
            this.msg = data;
            this.navPage = data.navigate_list[0].name;
            console.log(this.navPage)
          }
        })
      },
      //内容选择
      navSelect(key){
        this.navPage = key;
      }
    }
  }
</script>
