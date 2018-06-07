<template lang="pug">
  #app
    header.detail-header
      .header-title
        span.mui-action-back.iconfont.icon-return
        .detail-title {{baseData.company_name}}
        .iconGroup
          span.iconfont.icon-share
          span.iconfont.icon-attention
      .header-sign
        span {{baseData.province}} / {{baseData.city}}
    .mui-content
      .content-page
        .scroll-wrapper.cell-row#proGroup
          .scroll-box
            .pro-group
              .filter-wrapper
                .filter.fl
                  span 共10个招标
                .filter(@tap="popoutFilter(true,false)")
                  span 筛选&nbsp;
                  i.iconfont.icon-filter
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
                      span.pro-location {{item.province}}
                        template(v-if="item.city") / {{item.city}}
                          template(v-if='item.district')  / {{item.district}}
                  .pro-assist
                    .pro-endTime {{item.end_datetime}}
                    .pro-price
                      span {{item.amount}}
                      | 万
</template>
<style lang="stylus" scoped>
  @import "companyDetail_own.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'companyDetail',
    data() {
      return {
        baseData:{},
        proData: {
          pageNum: 1,
          data: []
        }
      }
    },
    mounted() {
      let vueThis = this;
      this.getData();
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
                  code: '0000',//////////////////////////////////公司编码
                  cur_page: vueThis.proData.pageNum
                }, success: (data) => {
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
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.search_tender_company_detail,
          data: {code: 'rid'},
          success: (data) => {
            this.baseData = data;
            this.proData.data = data.result;
          }
        })
      },
    }
  }
</script>
