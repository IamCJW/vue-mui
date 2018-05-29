<template lang="pug">
  #app
    header.search-header
      .search-nav-list
        .search-item(:class="{active: pageFlag === 0}", @tap="jumpTo(0)") 查建筑企业
        .search-item(:class="{active: pageFlag === 1}", @tap="jumpTo(1)") 查建筑师
        .search-item(:class="{active: pageFlag === 2}", @tap="jumpTo(2)") 资质查企业
    .mui-content
      .content-wrapper
       .content-full-scroll(ref='barscroll')
        .content-page(@swipeleft="contentSwipeleft()")
          .scroll-wrapper#page1
            .scroll-box
              .search-wrapper
                .search-box(@tap="openWindow('searchCompany')")
                  span 请输入企业名称和统一信用代码
                  i.iconfont.icon-SEARCH
              .search-result 某招标共收录建筑企业{{companyData.total}}家
              .com-group
                .com-item(v-for="item in companyData.result")
                  .com-name {{item.company_name}}
                  .com-sign
                    span 资质:{{item.qualify_num}}
                    span 建造师:{{item.builder_num}}
                    span 中标:{{item.tender_sucess_num}}
                    span.fr 最近中标:{{item.tender_last_date}}
                  .com-records
                    span(v-for="sign in item.province_list")
                      i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                      span {{sign.name}}
        .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
          .scroll-wrapper#page2
            .scroll-box
              .search-wrapper
                .search-box(@tap="openWindow('searchBuilder')")
                  span 请输入建造职师或证件号
                  i.iconfont.icon-SEARCH
              .search-result 某招标共收录建造师{{builderData.total}}家
              .bui-group
                .bui-item(v-for="item in builderData.result")
                  .bui-top
                    .bui-name {{item.user_name}}
                    .bui-id 注册号:{{item.register_no}}
                    div 中标数量:{{item.tender_sucess_num}}
                  .bui-mid
                    span.bui-sign 二级注册建造师
                    span.fr
                      span 专业数:{{item.professional_num}}
                      span 最近中标:{{item.tender_last_date}}
                  .bui-company {{item.company_name}}
                  .bui-records
                    span(v-for="sign in item.province_list")
                      i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                      span {{sign.name}}
        .content-page(@swiperight="contentSwiperight()")
          ul.media-view
            li.media
              .media-content.iconfont.icon-more
                span.media-lable 选择省份
                span.media-value 请选择省份
            li.media
              .media-content.iconfont.icon-more
                span.media-lable 选择省份
                span.media-value 请选择省份









</template>
<style lang="stylus" scoped>
  @import "search.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'selectlocation',
    data() {
      return {
        pageFlag:2,
        companyData:{},//建筑企业信息
        builderData:{},//建造师信息
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
              vueThis.companyData.cur_page += 1;
              http({
                url: api.search_company,
                data: {
                  cur_page: vueThis.companyData.cur_page,
                }, success: (data) => {
                  vueThis.companyData.result = vueThis.companyData.result.concat(data.result);
                  if (data.total_page === vueThis.companyData.cur_page) {
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
              vueThis.builderData.cur_page += 1;
              http({
                url: api.search_builder_search,
                data: {
                  cur_page: vueThis.builderData.cur_page,
                }, success: (data) => {
                  vueThis.builderData.result = vueThis.builderData.result.concat(data.result);
                  if (data.total_page === vueThis.builderData.cur_page) {
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
      this.jumpTo(this.pageFlag);
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData(){
        http({
          url:api.search_company,
          success:(data)=>{
            this.companyData = data;
          }
        });
        http({
          url:api.search_builder_search,
          success:(data)=>{
            this.builderData = data;
          }
        })
      },
      openWindow:myMethods.openWindow,
      //页面切换
      jumpTo(key) {
        this.pageFlag = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
        console.log(this.$refs.barscroll.style.left)
      },
      //左滑事件
      contentSwipeleft() {
        this.pageFlag = this.pageFlag + 1;
        let key = this.pageFlag;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },
      //右滑事件
      contentSwiperight() {
        this.pageFlag = this.pageFlag - 1;
        let key = this.pageFlag;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      }
    }
  }
</script>
