<template lang="pug">
  #app
    header.search-header
      .search-nav-list
        .search-item(:class="{active: pageFlag === 0}", @tap="jumpTo(0)") 查建筑企业
        .search-item(:class="{active: pageFlag === 1}", @tap="jumpTo(1)") 查建造师
        .search-item(:class="{active: pageFlag === 2}", @tap="jumpTo(2)") 资质查企业
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="openTabNav('message',1)")
            .scroll-wrapper#page1
              .scroll-box
                loading(ref="loading")
                .search-wrapper
                  .search-box(@tap="openDetail('searchCompany')")
                    span 请输入企业名称或统一信用代码
                    i.iconfont.icon-SEARCH
                .search-result(v-show="companyData.total") 建设帮招标共收录建筑企业{{companyData.total}}家
                warn(v-if="connectionState", :remakeDo="true")
                .com-group(v-show="!connectionState")
                  transition-group(name="domItem")
                    .com-item(v-for="item in companyData.result", :key="item.rid" ,@tap="openDetail('companyDetail',{rid:item.rid,pageNum:1})")
                      .com-name {{item.company_name}}
                      .com-sign
                        span 资质:{{item.qualify_num}}
                        span 建造师:{{item.builder_num}}
                        span 中标:{{item.tender_sucess_num}}
                        span.fr 最近中标:{{item.tender_last_date ? item.tender_last_date : '未知'}}
                      .com-records
                        span(v-for="sign in item.province_list")
                          i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                          span {{sign.name}}
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper#page2
              .scroll-box
                .search-wrapper
                  .search-box(@tap="openDetail('searchBuilder')")
                    span 请输入建造师姓名或证书号
                    i.iconfont.icon-SEARCH
                .search-result(v-show="builderData.total") 建设帮招标共收录建造师{{builderData.total}}名
                warn(v-if="connectionState", :remakeDo="true")
                .bui-group(v-show="!connectionState")
                  transition-group(name="domItem")
                    .bui-item(v-for="item in builderData.result", :key="item.rid" , @tap="openDetail('builderDetail',{rid:item.rid})")
                      .bui-top
                        .bui-name {{item.user_name}}
                        .bui-id 注册号:{{item.register_no}}
                        div 中标数量:{{item.tender_sucess_num}}
                      .bui-mid
                        span.bui-sign {{item.level || 未知}}
                        span.fr
                          span 专业数:{{item.professional_num}}
                          span 最近中标:{{item.tender_last_date ? item.tender_last_date : '未知'}}
                      .bui-company {{item.company_name}}
                      .bui-records
                        span(v-for="sign in item.province_list")
                          i.iconfont(:class="[sign.is_register === 1 ? 'icon-Note z' : 'icon-Prepare b']")
                          span {{sign.name}}
          .content-page(@swiperight="contentSwiperight()", @swipeleft="openTabNav('me',3)")
            ul.media-view
              li.media
                .media-content.iconfont.icon-right
                  div.media-lable 省份选择
                  div.media-value(@tap="openDetail('selectProvince')")  {{province.name ? province.name : '请选择'}}
              li.media
                .media-content
                  div.media-lable 企业要求
                  div.media-value.select-group
                    div(@tap="companySelect(1)")
                      i.iconfont(:class="[condition===1 ? 'icon-selectss': 'icon-CIRCLE']")
                      span 不限
                    div(v-if="province.shortName", @tap="companySelect(2)")
                      i.iconfont(:class="[condition===2 ? 'icon-selectss' : 'icon-CIRCLE']")
                      span 入{{province.shortName}}企业
                    div(v-if="province.shortName", @tap="companySelect(3)")
                      i.iconfont(:class="[condition===3 ? 'icon-selectss' : 'icon-CIRCLE']")
                      span 本地企业
              li.media
                .media-content.iconfont.icon-right
                  div.media-lable 设置资历条件
                  div.media-value(@tap="openDetail('selectQualify')") {{categoryData.length !== 0 ? '已设置':'请设置'}}
            template(v-if="categoryData.length !== 0")
              ul.media-view.categoryData
                li.media(v-for="item in categoryData")
                  .media-content
                    div.media-value {{item.one}}-{{item.two}}-{{item.three}}-{{item.four}}
              ul.media-view(v-if="categoryData.length > 1")
                li.media
                  .media-content
                    div.media-value.select-group
                      div(@tap="categorySelect(1)")
                        i.iconfont(:class="[conditionCategory===1?'icon-selectss':'icon-CIRCLE']")
                        span 符合单个
                      div(@tap="categorySelect(2)")
                        i.iconfont(:class="[conditionCategory===2?'icon-selectss':'icon-CIRCLE']")
                        span 全部符合
            ul.media-view.border-none
              li.media
                .media-content
                  div.media-value.select-group
                    div(@tap="qualifyFilterTypeSelect(2)")
                      i.iconfont(:class="[qualify_filter_type===2?'icon-selectss':'icon-CIRCLE']")
                      span 符合所选等级(含以上)
                    div(@tap="qualifyFilterTypeSelect(1)")
                      i.iconfont(:class="[qualify_filter_type===1?'icon-selectss':'icon-CIRCLE']")
                      span 符合所选等级
            button.search(@tap="search") 查询
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
  import loading from '../../components/loading'
  import warn from '../../components/warn'

  export default {
    name: 'selectlocation',
    data() {
      return {
        pageFlag: 0,
        companyData: {
          result: [],
          cur_page: 1
        },//建筑企业信息
        builderData: {
          result: [],
          cur_page: 1
        },//建造师信息
        province: {//省份选择
          name: '',
          shortName: ''
        },
        condition: 1,//企业要求
        conditionCategory: 1,//资质设置
        qualify_filter_type: 2,//本级
        categoryData: [],
        firstIn: true,
      }
    },
    components: {
      loading: loading,
      warn: warn
    },
    mounted() {
      this.getData();
      window.addEventListener('getData', () => {
        this.firstIn = false;
        if (this.firstIn) {
          this.getData();
        }
      });
      let vueThis = this;
      mui.plusReady(() => {
        myMethods.NVpreload(['selectProvince', 'searchFilterCompany']);
      });
      mui.init({
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            contentnomore: ' ',
            callback: function () {
              vueThis.companyData.cur_page += 1;
              http({
                url: api.search_company,
                data: {
                  cur_page: vueThis.companyData.cur_page,
                },
                success: (data) => {
                  if (data.total_page < vueThis.companyData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.companyData.result = vueThis.companyData.result.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                connectionNone:()=>{
                  this.endPullupToRefresh(false);
                  vueThis.companyData.cur_page -= 1;
                }
              });
            }
          }
        }, {
          container: '#page2',
          up: {
            contentrefresh: "正在加载...",
            contentnomore: ' ',
            callback: function () {
              vueThis.builderData.cur_page += 1;
              http({
                url: api.search_builder_search,
                data: {
                  cur_page: vueThis.builderData.cur_page,
                },
                success: (data) => {
                  vueThis.builderData.result = vueThis.builderData.result.concat(data.result);
                  if (data.total_page < vueThis.builderData.cur_page) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                },
                connectionNone:()=>{
                  this.endPullupToRefresh(false);
                  vueThis.builderData.cur_page -= 1;
                }
              });
            }
          }
        }]
      });
      this.jumpTo(this.pageFlag);
      window.addEventListener('chooseProvince', (e) => {
        vueThis.province = e.detail.province;
      });
      window.addEventListener('chooseCategory', (e) => {
        vueThis.categoryData = e.detail.categoryData;
      });
    },
    created() {
    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        http({
          url: api.search_company,
          success: (data) => {
            this.connectionOnline();
            this.companyData = data;
          },
          error: (data) => {
            this.connectionOnline();
          },
          connectionNone:()=>{
            this.connectionUnline();
          }
        });
        http({
          url: api.search_builder_search,
          success: (data) => {
            this.builderData = data;
          },
          connectionNone:()=>{
            this.connectionUnline();
          }
        })
      },
      companySelect(key) {
        this.condition = key;
      },
      categorySelect(key) {
        this.conditionCategory = key
      },
      qualifyFilterTypeSelect(key) {
        this.qualify_filter_type = key;
      },
      openWindow: myMethods.openWindow,//跳转详情
      openTabNav: myMethods.openTabNav,
      openDetail: myMethods.openDetail,
      //页面切换
      jumpTo(key) {
        this.pageFlag = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
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
      },
      //查询事件
      search() {
        let data = {
          province: this.province.name || '',
          company_type: this.condition,
          filter_type: this.conditionCategory,
          qualify_filter_type: this.qualify_filter_type,
          qualify_filter: [],
        };
        if (data.province === '') {
          mui.toast('请选择需要查询的区域');
          return
        }
        if (this.categoryData.length === 0) {
          mui.toast('请选择需要查询的资质');
          return
        }
        let categoryData = this.categoryData;
        categoryData.forEach((item, index) => {
          data.qualify_filter[index] = {
            rid: item.id
          }
        });
        let detailPage = plus.webview.getWebviewById('searchFilterCompany');
        myMethods.muiFireLock(detailPage, () => {
          mui.fire(detailPage, 'getData', data);
        });
        myMethods.openWindow('searchFilterCompany');
      }
    }
  }
</script>
