// src/app/home/App.vue
<template lang="pug">
  #app
    .header-full
    .home-header
      .home-search-wrapper
        .home-location( @tap="openNViewPreload('selectLocation')")
          i.iconfont.icon-site
          span {{localLocation}}
          i.iconfont.icon-TRIANGLE
        .home-search( @tap="openWindow('searchProject')")
          div 请输入要查询的项目名称
          i.iconfont.icon-SEARCH
      .home-bar-nav
        button.home-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 招标订阅
        button.home-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 招标公告
        button.home-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 中标公示
        button.home-bar-item(@tap="jumpTo(3)", :class="{active: pageKey===3}") 更多信息
    .mui-content
      loading(ref="loading")
      .content-wrapper(v-show="dataLock")
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .jumpToTop(v-show="top1")
              i.iconfont.icon-zhiding(@tap="jumpToTop('page1')")
            .scroll-wrapper#page1
              .scroll-box
                .filter-wrapper
                  .filter(@tap="openNViewPreload('subscription')")
                    span 订阅管理&nbsp;
                    i.iconfont.icon-filter
                warn(icon='icon-404', msg='未有订阅消息~', :show="!pageIndex0.data.length")
                .pro-group(v-show="pageIndex0.data.length")
                  transition-group(name='domItem')
                    .pro-item(v-for="(item,index) in pageIndex0.data", :key="index" , @tap="openDetail('detail',{rid:item.rid,type:1})")
                      .pro-time
                        i.iconfont.icon-time
                        span  &nbsp;{{item.info_date}}
                      .pro-content
                        .pro-main
                          .pro-name.mui-ellipsis-2 {{item.name}}
                          .pro-main-sign.mui-ellipsis
                            span.pro-style(v-for="tender_type in item.tender_types",:class="{'color-icon-SUPERVISION':tender_type === '监理','color-icon-design':tender_type === '设计','color-icon-INVESTIGATE':tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':tender_type === '施工','color-icon-INTEGRATION':tender_type === '一体化','color-icon-OTHER':tender_type === '其他',}")
                              i.iconfont(:class="{'icon-SUPERVISION':tender_type === '监理','icon-design':tender_type === '设计','icon-INVESTIGATE':tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':tender_type === '施工','icon-INTEGRATION':tender_type === '一体化','icon-OTHER':tender_type === '其他',}")
                              span &nbsp;{{tender_type}}
                            span.pro-location {{item.province | addressFilter}}{{!item.city? '':' / '+item.city| addressFilter}}{{!item.district? '': ' / '+item.district| addressFilter}}
                        .pro-assist
                          .pro-endTime {{!item.end_datetime ? '未知': item.end_datetime | dateCountDown}}
                          .pro-price
                            span {{item.amount}}
                            | {{item.amount ? '万' : '未知' }}
          //公告
          .content-page(@swipeleft="contentSwipeleft", @swiperight="contentSwiperight")
            .jumpToTop(v-show="top2", @tap="jumpToTop('page2')")
              i.iconfont.icon-zhiding
            .scroll-wrapper#page2
              .scroll-box
                .filter-wrapper
                  .filter(@tap="popoutFilter(true,false)")
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                warn(icon='icon-404', msg='该区域暂无招标公告~', :show="!pageIndex1.data.length")
                .pro-group(v-show="pageIndex1.data.length")
                  transition-group(name='domItem')
                    .pro-item(v-for="item in pageIndex1.data", :key="item.rid" ,@tap="openDetail('detail',{rid:item.rid,type:1})")
                      .pro-time
                        i.iconfont.icon-time
                        span  &nbsp;{{item.info_date}}
                      .pro-content
                        .pro-main
                          .pro-name.mui-ellipsis-2 {{item.name}}
                          .pro-main-sign.mui-ellipsis
                            span.pro-style(v-for="tender_type in item.tender_types",:class="{'color-icon-SUPERVISION':tender_type === '监理','color-icon-design':tender_type === '设计','color-icon-INVESTIGATE':tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':tender_type === '施工','color-icon-INTEGRATION':tender_type === '一体化','color-icon-OTHER':tender_type === '其他',}")
                              i.iconfont(:class="{'icon-SUPERVISION':tender_type === '监理','icon-design':tender_type === '设计','icon-INVESTIGATE':tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':tender_type === '施工','icon-INTEGRATION':tender_type === '一体化','icon-OTHER':tender_type === '其他',}")
                              span &nbsp;{{tender_type}}
                            span.pro-location {{item.province | addressFilter}}{{!item.city? '':' / '+item.city| addressFilter}}{{!item.district? '': ' / '+item.district| addressFilter}}
                        .pro-assist
                          .pro-endTime {{!item.end_datetime ? '未知': item.end_datetime | dateCountDown}}
                          .pro-price
                            span {{item.amount}}
                            | {{item.amount ? '万' : '未知' }}
          //中标
          .content-page(@swipeleft="contentSwipeleft", @swiperight="contentSwiperight")
            .jumpToTop(v-show="top3")
              i.iconfont.icon-zhiding(@tap="jumpToTop('page3')")
            .scroll-wrapper#page3
              .scroll-box
                .filter-wrapper
                  .filter(@tap="popoutFilter(true,false)")
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                warn(icon='icon-404', msg='该区域暂无中标消息~', :show="!pageIndex2.data.length")
                .pro-group(v-show="pageIndex2.data.length")
                  transition-group(name='domItem')
                    .pro-item(v-for="(item,index) in pageIndex2.data", :key="index"  , @tap="openDetail('detail',{rid:item.rid,type:2})")
                      .pro-time
                        i.iconfont.icon-time
                        span  &nbsp;{{item.info_date}}
                      .pro-content
                        .pro-main
                          .pro-name.mui-ellipsis-2 {{item.name}}
                          .pro-main-sign.mui-ellipsis
                            span.pro-style(v-for="tender_type in item.tender_types",:class="{'color-icon-SUPERVISION':tender_type === '监理','color-icon-design':tender_type === '设计','color-icon-INVESTIGATE':tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':tender_type === '施工','color-icon-INTEGRATION':tender_type === '一体化','color-icon-OTHER':tender_type === '其他',}")
                              i.iconfont(:class="{'icon-SUPERVISION':tender_type === '监理','icon-design':tender_type === '设计','icon-INVESTIGATE':tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':tender_type === '施工','icon-INTEGRATION':tender_type === '一体化','icon-OTHER':tender_type === '其他',}")
                              span &nbsp;{{tender_type}}
                            span.pro-location {{item.company_name}}
                        .pro-assist
                          .pro-price
                            span {{item.tender_je}}
                            | {{item.tender_je ? '万' : '未知'}}
                          .pro-endTime {{item.province | addressFilter}}{{!item.city? '':' / '+item.city| addressFilter}}{{!item.district? '': ' / '+item.district| addressFilter}}
          //更多
          .content-page(@swiperight="contentSwiperight", @swipeleft="openTabNav('message',1)")
            .jumpToTop(v-show="top4")
              i.iconfont.icon-zhiding(@tap="jumpToTop('page4')")
            .scroll-wrapper#page4
              .scroll-box
                .filter-wrapper
                  .filter(@tap="popoutFilter(true,true)")
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                warn(icon='icon-404', msg='该区域暂无更多资讯~', :show="!pageIndex3.data.length")
                .pro-group(v-show="pageIndex3.data.length")
                  transition-group(name='domItem')
                    .pro-item.more(v-for='(item,index) in pageIndex3.data', :key="index", @tap="openDetail('detail',{rid:item.rid,type:3})")
                      .pro-time
                        i.iconfont.icon-time
                        span  &nbsp;{{item.info_date}}
                      .pro-content
                        .pro-assist
                          div.pro-style(:class="{'color-icon-ANSWERINGQUESTIONS':item.info_type === '答疑','color-icon-CHANGE':item.info_type === '变更','color-icon-clarify':item.info_type === '澄清','color-icon-investigate_money':item.info_type === '资审','color-icon-FLOWSTANDARD':item.info_type === '流标','color-icon-OTHER':item.info_type === '其他','color-icon-THESCRAP':item.info_type === '废标'}")
                            i.iconfont(:class="{'icon-ANSWERINGQUESTIONS':item.info_type === '答疑','icon-CHANGE':item.info_type === '变更','icon-clarify':item.info_type === '澄清','icon-investigate_money':item.info_type === '资审','icon-FLOWSTANDARD':item.info_type === '流标','icon-OTHER':item.info_type === '其他','icon-THESCRAP':item.info_type === '废标'}")
                            span &nbsp;{{item.info_type}}
                        .pro-main
                          .pro-name.mui-ellipsis-2 {{item.name}}
                          .pro-main-sign
                            span.pro-location {{item.province}}{{item.city? '/'+item.city:''}}{{item.district?'/'+item.district:''}}
    //筛选
    transition(name='filter')
      .mask(v-if="filterFlag")
        .popout-wrapper(v-if="filterFlag")
          .popout-filter-close(@tap="popoutFilter(false)")
          .popout-filter
            .popout-filter-content
              .filter-typeGroup
                .filter-type 招标地域
                .filter-keyGrouup
                  <!--span(v-if='filterLocation.index !== 0',@tap="filterBack()") 上一级-->
                  span(v-for="(item,index) in filterLocation.data", :class="{active:filterSelect.location.province === item.name || filterSelect.location.city === item.name || filterSelect.location.district === item.name}", @tap="filterSelectPro(filterLocation.index,item.name)") {{item.name}}
              template( v-if="!isMore")
                .filter-typeGroup(v-for="(value,key) in commonDict" v-if="key !== 'info_dict'")
                  .filter-type(v-if="key === 'amount_dict'") 招标金额(万元)
                  .filter-type(v-else-if="key === 'tender_dict'") 行业类型
                  .filter-type(v-else-if="key === 'construction_dict'") 专业类型
                  .filter-keyGrouup
                    span(:class="{active:!filterSelect[key]}", @tap="filterSelectPro(key,'')") 全部
                    span(v-for="item in value",:class="{active:filterSelect[key] === item.name}", @tap="filterSelectPro(key,item.name)") {{item.name}}
              .filter-typeGroup(v-else)
                .filter-type 信息类型
                .filter-keyGrouup
                  span(:class="{active:!filterSelect['info_type']}", @tap="filterSelectPro('info_type','')") 全部
                  span(v-for="item in commonDict['info_dict']" ,:class="{active:filterSelect['info_type'] === item.name}", @tap="filterSelectPro('info_type',item.name)") {{item.name}}
            .popout-filter-btnGroup
              button(@tap="filterReset()") 重置
              button(@tap="filterSubmit()") 确定
</template>
<style lang="stylus" scoped>
  @import "home.styl"
  .filter-enter-active, .filter-leave-active {
    transition: opacity .3s;
  }

  .filter-enter, .filter-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity 0
  }
</style>
<script>
  /* global mui */
  /* global mui plus*/
  import {lsKey, plusKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http'
  import api from '../../assets/js/api'
  import myMethods from '../../assets/js/methods.js'
  import loading from '../../components/loading'
  import warn from '../../components/warn'

  export default {
    name: 'home',
    data() {
      return {
        error: false,
        dataLock: false,
        iconMsg: {
          "监理": {
            iconClass: "icon-SUPERVISION"
          }, "设计": {
            iconClass: "icon-design"
          }, "勘察": {
            iconClass: "icon-INVESTIGATE"
          }, "施工": {
            iconClass: "icon-THECONSTRUCTIONOFTHE"
          }, "一体化": {
            iconClass: "icon-INTEGRATION"
          }, "其他": {
            iconClass: "icon-CHANGE"
          }, "答疑": {
            iconClass: "icon-ANSWERINGQUESTIONS"
          }, "变更": {
            iconClass: "icon-OTHER"
          }, "澄清": {
            iconClass: "icon-clarify"
          }, "资审": {
            iconClass: "icon-investigate_money"
          }, "流标": {
            iconClass: "icon-FLOWSTANDARD"
          }, "废标": {
            iconClass: "icon-THESCRAP"
          },
        },
        pageKey: 0,//页面状态
        localLocation: '正在定位',//定位信息
        province: '',//选择的省份
        city: '',//选择的城市
        district: '',//选择的地区
        filterFlag: false,//筛选状态
        pageIndex0: {data: [], pageNum: 1},//招标订阅信息
        pageIndex1: {data: [], pageNum: 1},//招标公示信息
        pageIndex2: {data: [], pageNum: 1},//中标公示信息
        pageIndex3: {data: [], pageNum: 1},//更多信息
        commonDict: {},//数据字典
        isMore: false,//是否为更多筛选
        filterLocation: {
          index: 0,
          data: []
        },//地址筛选数据
        filterSelect: {
          location: {province: '', city: '', district: ''},
          amount_dict: '',
          construction_dict: '',
          info_type: '',
          tender_dict: ''
        },
        nation: '',//地址数据
        top1: false,//置顶
        top2: false,//置顶
        top3: false,//置顶
        top4: false,//置顶
      }
    },
    components: {
      loading: loading,
      warn: warn,
    },
    methods: {
      //获取初始数据
      getData() {
        this.muiInit();
        this.$refs.loading.show();
        this.pageIndex0 = {data: [], pageNum: 1};//招标订阅信息
        this.pageIndex1 = {data: [], pageNum: 1};//招标公示信息
        this.pageIndex2 = {data: [], pageNum: 1};//中标公示信息
        this.pageIndex3 = {data: [], pageNum: 1};//更多信息
        //获取项目数据
        http({
          url: api.home,
          data: {
            province: this.province,
            city: this.city,
            district: this.district,
          },
          success: (data) => {
            if (data !== undefined) {
              this.pageIndex0.data = data.subscribe_list || [];
              this.pageIndex1.data = data.tender_list || [];
              this.pageIndex2.data = data.success_tender_list || [];
              this.pageIndex3.data = data.more_list || [];
            }
            this.$refs.loading.hide();
            this.dataLock = true;
            mui('#page1').pullRefresh().scrollTo(0, 0, 100);
            mui('#page2').pullRefresh().scrollTo(0, 0, 100);
            mui('#page3').pullRefresh().scrollTo(0, 0, 100);
            mui('#page4').pullRefresh().scrollTo(0, 0, 100);
          },
          error: (data) => {
            this.$refs.loading.hide();
            this.dataLock = true;
            mui.toast(data.msg);
          }
        });
        http({
          url: api.common_dict,
          success: (data) => {
            this.commonDict = data;
          }
        });
        if (localStorage.getItem(lsKey.nationData) !== null) {
          this.nation = JSON.parse(localStorage.getItem(lsKey.nationData));
          this.initFilterLocation()
        } else {
          http({
            url: api.nation,
            success: (data) => {
              localStorage.setItem(lsKey.nationData, JSON.stringify(data));
              this.nation = data;
              this.initFilterLocation()
            }
          });
        }
      },
      //筛选地址初始化
      initFilterLocation() {
        let flag = true;
        this.filterSelect.location.province = this.province;
        this.filterSelect.location.city = this.city || '';
        this.filterSelect.location.district = this.district || '';
        this.filterLocation.data = this.nation;
        this.filterLocation.data.forEach((item) => {
          if (item.name === this.province) {
            this.filterLocation.data = item.city;
            this.filterLocation.index = 1;
            flag = false;
          }
        });
        if (flag) {
          this.filterLocation.data = [];
        }
        this.filterLocation.data.forEach((item) => {
          if (item.name === this.city) {
            this.filterLocation.index = 2;
            this.filterLocation.data = item.district;
          }
        });
        if (this.district === '') {
          this.filterSelect.location.district = '全市';
        }
        if (this.district !== '') {
          this.filterLocation.data = [{name: this.district}];
        }
      },
      // 筛选选择
      filterSelectPro(key, value) {
        switch (key) {
          case 0:
            this.filterSelect.location.province = value;
            this.filterSelect.location.city = '';
            this.filterLocation.index = 1;
            for (let key in this.filterLocation.data) {
              if (this.filterLocation.data[key].name === value) {
                this.filterLocation.data = this.filterLocation.data[key].city;
                return
              }
            }
            break;
          case 1:
            this.filterSelect.location.city = value;
            this.filterLocation.index = 2;
            this.filterSelect.location.district = '';
            if (value === '全省') {
              this.filterLocation.index = 1;
              return
            }
            ;
            for (let key in this.filterLocation.data) {
              if (this.filterLocation.data[key].name === value) {
                this.filterLocation.data = this.filterLocation.data[key].district;
                return
              }
            }
            break;
          case 2:
            this.filterSelect.location.district = value;
            break;
          default:
            this.filterSelect[key] = value;
        }
      },
      //地址返回
      filterBack() {
        switch (this.filterLocation.index) {
          case 1:
            this.filterSelect.location.province = '';
            this.filterLocation.index = 0;
            this.filterLocation.data = this.nation;
            break;
          case 2:
            this.filterSelect.location.district = '';
            this.filterSelect.location.city = '';
            this.nation.forEach((item) => {
              if (item.name === this.filterSelect.location.province) {
                this.filterLocation.index = 1;
                this.filterLocation.data = item.city;
              }
            });
            break;
        }
      },
      //条件提交
      filterSubmit() {
        let filterSelect = this.filterSelect;
        if (filterSelect.location.province === '') {
          mui.toast('城市不能为空');
          return
        }
        let data = {
          amount_type: filterSelect.amount_dict,
          city: filterSelect.location.city === '全省' ? '' : filterSelect.location.city,
          construction_type: filterSelect.construction_dict,
          cur_page: 1,
          district: filterSelect.location.district === '全市' ? '' : filterSelect.location.district,
          province: filterSelect.location.province,
          tender_type: filterSelect.tender_dict,
          info_type: filterSelect.info_type,
        };
        switch (this.pageKey) {
          case 1:
            http({
              url: api.tender,
              data: data,
              success: (data) => {
                this.pageIndex1.data = data.result;
                this.filterFlag = false;
              },
              noFind: (data) => {
                this.pageIndex1.data = [];
                this.filterFlag = false;
              }
            });
            break;
          case 2:
            http({
              url: api.tender_success,
              data: data,
              success: (data) => {
                this.pageIndex2.data = data.result;
                this.filterFlag = false;
              },
              noFind: (data) => {
                this.pageIndex2.data = [];
                this.filterFlag = false;
              }
            });
            break;
          case 3:
            http({
              url: api.tender_more,
              data: data,
              success: (data) => {
                this.pageIndex3.data = data.result;
                this.filterFlag = false;
              },
              noFind: (data) => {
                this.pageIndex3.data = [];
                this.filterFlag = false;
              }
            });
            break;
        }
      },
      //条件重置
      filterReset() {
        this.filterSelect = {
          location: {province: '', city: '', district: ''},
          amount_dict: '',
          construction_dict: '',
          info_type: '',
          tender_dict: ''
        };
        this.initFilterLocation();
      },
      // 跳转页面
      openWindow: myMethods.openWindow,
      openNViewPreload: myMethods.openNViewPreload,
      openDetail(url, data) {
        mui.plusReady(function () {
          mui.preload({
            url: `./${url}.html`,
            id: url
          });
          let detailPage = plus.webview.getWebviewById(url);
          mui.fire(detailPage, 'getData', data);
          myMethods.openWindow(url);
        });
      },
      //置顶
      jumpToTop(key){
        mui(`#${key}`).pullRefresh().scrollTo(0,0,100);
      },
      //页面切换
      jumpTo(key) {
        this.filterFlag = false;
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
        this.top1 = false;
        this.top2 = false;
        this.top3 = false;
        this.top4 = false;
        if (this[`pageIndex${key}`].pageNum > 2) {
          this[`top${key + 1}`] = true;
        }
      },
      //自动定位
      location() {
        if (localStorage.getItem(lsKey.locationProvince) === null) {
          let _this = this;
          //全局的this在方法中不能使用，需要重新定义一下
          let geolocation = new BMap.Geolocation();
          //调用百度地图api 中的获取当前位置接口
          geolocation.getCurrentPosition(function (r) {
            let point = new BMap.Point(r.longitude, r.latitude);
            let geoc = new BMap.Geocoder();
            geoc.getLocation(point, function (rs) {
              let address = rs.addressComponents;
              address.province = address.province.replace('省', '');
              address.province = address.province.replace('市', '');
              switch (address.province) {
                case "广西壮族自治区":
                  address.province = '广西';
                  break;
                case "宁夏回族自治区":
                  address.province = '广西';
                  break;
                case "新疆维吾尔自治区":
                  address.province = '广西';
                  break;
                default:
                  address.province = address.province.replace('自治区', '');
                  break;
              }
              if (address.province !== '广西') {
                address.province = '广西';
                address.city = '';
                address.district = '';
              }
              if(address.city === ''){
                _this.localLocation = `${address.province}`;
              }else {
                _this.localLocation = `${address.city}-${address.district}`;
              }
              //将定位存入本地缓存
              localStorage.setItem(lsKey.locationProvince, address.province);
              localStorage.setItem(lsKey.locationCity, address.city);
              localStorage.setItem(lsKey.locationDistrict, address.district);
              _this.province = localStorage.getItem(lsKey.locationProvince);
              _this.city = localStorage.getItem(lsKey.locationCity);
              _this.district = localStorage.getItem(lsKey.locationDistrict);
              _this.getData();
            });
          });
        } else {
          this.province = localStorage.getItem(lsKey.locationProvince);
          this.city = localStorage.getItem(lsKey.locationCity);
          this.district = localStorage.getItem(lsKey.locationDistrict);
          if (this.district === '' && this.city === '') {
            this.localLocation = `${this.province}`
          } else if (this.district === '' && this.city !== '') {
            this.localLocation = `${this.province} - ${this.city}`
          } else {
            this.localLocation = `${this.city} - ${this.district}`
          }
        }
      },
      //筛选弹窗
      popoutFilter(station, isMore) {
        this.initFilterLocation();
        this.filterFlag = station;
        this.isMore = isMore;
        if (!station) return
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
      //跳转主页内容
      openTabNav: myMethods.openTabNav,
      changeRem: myMethods.changeRem,
      //muiInit
      muiInit() {
        let vueThis = this;
        if ((vueThis.filterSelect.location.province || vueThis.province || '') === '') {
          return
        }
        mui.init({
          preloadPages: [{
            url: './searchProject.html',
            id: 'searchProject',
          }],
          pullRefresh: [{
            container: '#page1',
            down: {
              callback: function () {
                vueThis.pageIndex0.pageNum = 1;
                http({
                  url: api.tender_subscribe,
                  success: (data) => {
                    vueThis.top1 = false;
                    vueThis.pageIndex0.data = data.result;
                    mui('#page1').pullRefresh().endPulldownToRefresh();
                  },
                  noFind: () => {
                    mui('#page1').pullRefresh().endPulldownToRefresh();
                  }
                });
              }
            },
            up: {
              contentrefresh: "正在加载...",
              contentnomore: '再拉也没有数据~',
              callback: function () {
                vueThis.pageIndex0.pageNum += 1;
                http({
                  url: api.tender_subscribe,
                  data: {
                    cur_page: vueThis.pageIndex0.pageNum
                  },
                  success: (data) => {
                    if (data.total_page <= vueThis.pageIndex0.pageNum) {
                      this.endPullupToRefresh(true);
                    } else {
                      vueThis.pageIndex0.data = vueThis.pageIndex0.data.concat(data.result);
                      this.endPullupToRefresh(false);
                      if (vueThis.pageKey === 0) {
                        vueThis.top1 = true;
                      }
                    }
                  },
                  noFind: (data) => {
                    this.endPullupToRefresh(true);
                  }
                });
              }
            }
          }, {
            container: '#page2',
            down: {
              callback: function () {
                vueThis.pageIndex1.pageNum = 1;
                http({
                  url: api.tender,
                  data: {
                    amount_type: vueThis.filterSelect.amount_dict,
                    city: vueThis.filterSelect.location.city === '全省' ? '' : vueThis.filterSelect.location.city,
                    construction_type: vueThis.filterSelect.construction_dict,
                    cur_page: 1,
                    district: vueThis.filterSelect.location.district === '全市' ? '' : vueThis.filterSelect.location.district,
                    province: vueThis.filterSelect.location.province,
                    tender_type: vueThis.filterSelect.tender_dict,
                    info_type: vueThis.filterSelect.info_type,
                  },
                  success: (data) => {
                    vueThis.top2 = false;
                    vueThis.pageIndex1.data = data.result;
                    mui('#page2').pullRefresh().endPulldownToRefresh();
                  },
                  noFind: () => {
                    vueThis.pageIndex1.data = [];
                    mui('#page2').pullRefresh().endPulldownToRefresh();
                  }
                });
              }
            },
            up: {
              contentrefresh: "正在加载...",
              contentnomore: '再拉也没有数据~',
              callback: function () {
                vueThis.pageIndex1.pageNum += 1;
                http({
                  url: api.tender,
                  data: Object.assign({
                    amount_type: vueThis.filterSelect.amount_dict,
                    city: vueThis.filterSelect.location.city === '全省' ? '' : vueThis.filterSelect.location.city,
                    construction_type: vueThis.filterSelect.construction_dict,
                    cur_page: 1,
                    district: vueThis.filterSelect.location.district === '全市' ? '' : vueThis.filterSelect.location.district,
                    province: vueThis.filterSelect.location.province,
                    tender_type: vueThis.filterSelect.tender_dict,
                    info_type: vueThis.filterSelect.info_type,
                  }, {cur_page: vueThis.pageIndex1.pageNum}),
                  success: (data) => {
                    if (data.total_page <= vueThis.pageIndex1.pageNum) {
                      this.endPullupToRefresh(true);
                    } else {
                      vueThis.pageIndex1.data = vueThis.pageIndex1.data.concat(data.result);
                      if (vueThis.pageKey === 1) {
                        vueThis.top2 = true;
                      }
                      this.endPullupToRefresh(false);
                    }
                  },
                  noFind: () => {
                    this.endPullupToRefresh(true);
                  }
                });
              }
            }
          }, {
            container: '#page3',
            down: {
              callback: function () {
                vueThis.pageIndex2.pageNum = 1;
                http({
                  url: api.tender_success,
                  data: {
                    amount_type: vueThis.filterSelect.amount_dict,
                    city: vueThis.filterSelect.location.city === '全省' ? '' : vueThis.filterSelect.location.city,
                    construction_type: vueThis.filterSelect.construction_dict,
                    cur_page: 1,
                    district: vueThis.filterSelect.location.district === '全市' ? '' : vueThis.filterSelect.location.district,
                    province: vueThis.filterSelect.location.province,
                    tender_type: vueThis.filterSelect.tender_dict,
                    info_type: vueThis.filterSelect.info_type,
                  },
                  success: (data) => {
                    vueThis.top3 = false;
                    vueThis.pageIndex2.data = data.result;
                    mui('#page3').pullRefresh().endPulldownToRefresh();
                  },
                  noFind: () => {
                    vueThis.pageIndex2.data = [];
                    mui('#page3').pullRefresh().endPulldownToRefresh();
                  }
                });
              }
            },
            up: {
              contentrefresh: "正在加载...",
              contentnomore: '再拉也没有数据~',
              callback: function () {
                vueThis.pageIndex2.pageNum += 1;
                http({
                  url: api.tender_success,
                  data: Object.assign({
                    amount_type: vueThis.filterSelect.amount_dict,
                    city: vueThis.filterSelect.location.city === '全省' ? '' : vueThis.filterSelect.location.city,
                    construction_type: vueThis.filterSelect.construction_dict,
                    cur_page: 1,
                    district: vueThis.filterSelect.location.district === '全市' ? '' : vueThis.filterSelect.location.district,
                    province: vueThis.filterSelect.location.province,
                    tender_type: vueThis.filterSelect.tender_dict,
                    info_type: vueThis.filterSelect.info_type,
                  }, {cur_page: vueThis.pageIndex2.pageNum}),
                  success: (data) => {
                    if (data.total_page <= vueThis.pageIndex2.pageNum) {
                      this.endPullupToRefresh(true);
                    } else {
                      if (vueThis.pageKey === 2) {
                        vueThis.top3 = true;
                      }
                      vueThis.pageIndex2.data = vueThis.pageIndex2.data.concat(data.result);
                      this.endPullupToRefresh(false);
                    }
                  },
                  noFind: () => {
                    this.endPullupToRefresh(true);
                  }
                });
              }
            }
          }, {
            container: '#page4',
            down: {
              callback: function () {
                vueThis.pageIndex3.pageNum = 1;
                http({
                  url: api.tender_more,
                  data: {
                    amount_type: vueThis.filterSelect.amount_dict,
                    city: vueThis.filterSelect.location.city === '全省' ? '' : vueThis.filterSelect.location.city,
                    construction_type: vueThis.filterSelect.construction_dict,
                    cur_page: 1,
                    district: vueThis.filterSelect.location.district === '全市' ? '' : vueThis.filterSelect.location.district,
                    province: vueThis.filterSelect.location.province,
                    tender_type: vueThis.filterSelect.tender_dict,
                    info_type: vueThis.filterSelect.info_type,
                  },
                  success: (data) => {
                    vueThis.top4 = false;
                    vueThis.pageIndex3.data = data.result;
                    mui('#page4').pullRefresh().endPulldownToRefresh();
                  },
                  noFind: () => {
                    vueThis.pageIndex3.data = [];
                    mui('#page4').pullRefresh().endPulldownToRefresh();
                  }
                });
              }
            },
            up: {
              contentrefresh: "正在加载...",
              contentnomore: '再拉也没有数据~',
              callback: function () {
                vueThis.pageIndex3.pageNum += 1;
                http({
                  url: api.tender_more,
                  data: Object.assign({
                    amount_type: vueThis.filterSelect.amount_dict,
                    city: vueThis.filterSelect.location.city === '全省' ? '' : vueThis.filterSelect.location.city,
                    construction_type: vueThis.filterSelect.construction_dict,
                    cur_page: 1,
                    district: vueThis.filterSelect.location.district === '全市' ? '' : vueThis.filterSelect.location.district,
                    province: vueThis.filterSelect.location.province,
                    tender_type: vueThis.filterSelect.tender_dict,
                    info_type: vueThis.filterSelect.info_type,
                  }, {cur_page: vueThis.pageIndex3.pageNum}),
                  success: (data) => {
                    if (data.total_page <= vueThis.pageIndex3.pageNum) {
                      this.endPullupToRefresh(true);
                    } else {
                      if (vueThis.pageKey === 3) {
                        vueThis.top4 = true;
                      }
                      vueThis.pageIndex3.data = vueThis.pageIndex3.data.concat(data.result);
                      this.endPullupToRefresh(false);
                    }
                  },
                  noFind: () => {
                    this.endPullupToRefresh(true);
                  }
                });
              }
            }
          }]
        });
      }
    },
    mounted() {
      this.location();
      this.getData();
      this.jumpTo(this.pageKey);
      window.addEventListener('changeLocation', (e) => {
        this.location();
        this.getData();
      });
      window.addEventListener('localStorageClear', () => {
        this.location();
        this.getData();
      });
      window.addEventListener('loginSuccess', () => {
        this.location();
        this.getData();
      });
      window.addEventListener('loginOut', () => {
        this.location();
        this.getData();
      });
      mui.plusReady(() => {
        if (plus.storage.getItem(plusKey.firstOpen)) {
          plus.navigator.setFullscreen(false);
          plus.navigator.closeSplashscreen();
        }
      });
      this.muiInit()
    },
    created() {

    },
    filters: {
      //倒计时过滤器
      dateCountDown: (data) => {
        if (data === '未知') return data;
        let dateArr = data.split('-');
        let now = new Date();
        let endTime = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 23, 59, 59);
        let leftTime = endTime.getTime() - now.getTime();
        let day = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
        let countDown;
        if (day > 0) {
          countDown = `剩余${day}天截止`
        } else if (day === 0) {
          countDown = '今天'
        } else if (day < 0) {
          countDown = '已过期'
        }
        return countDown;
      },
      //地址过滤器
      addressFilter: (data) => {
        data = data.replace('省', '');
        data = data.replace('市', '');
        data = data.replace('区', '');
        data = data.replace('县', '');
        data = data.replace('自治区', '');
        return data;
      }
    }
  }
</script>
