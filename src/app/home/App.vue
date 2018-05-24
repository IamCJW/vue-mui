// src/app/home/App.vue

<template lang="pug">
  #app
    .header-full
    .home-header
      .home-search-wrapper
        .home-location( @tap="openWindow('selectLocation')")
          i.iconfont.icon-site
          span {{localLocation}}
          i.iconfont.icon-TRIANGLE
        .home-search( @tap="openWindow('searchProject')")
          div 请输入要查询的项目名称
          i.iconfont.icon-SEARCH
      .home-bar-nav
        button.home-bar-item(@tap="jumpTo(0)" :class="{active: pageKey===0}") 招标订阅
        button.home-bar-item(@tap="jumpTo(1)" :class="{active: pageKey===1}") 招标公告
        button.home-bar-item(@tap="jumpTo(2)" :class="{active: pageKey===2}") 中标公示
        button.home-bar-item(@tap="jumpTo(3)" :class="{active: pageKey===3}") 更多信息
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .mui-scroll-wrapper#pull
              .mui-scroll.cell-row
                .filter-wrapper
                  .filter(@tap="popoutFilter(true)")
                    span 订阅管理&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item(v-for="item in pageIndex0.data")
                    .pro-time
                      i.iconfont.icon-time
                      span  &nbsp;{{item.info_date}}
                    .pro-content
                      .pro-main
                        .pro-name.mui-ellipsis-2 {{item.name}}
                        .pro-main-sign.mui-ellipsis
                          span.pro-style(:class="{'color-icon-SUPERVISION':item.tender_type === '监理','color-icon-design':item.tender_type === '设计','color-icon-INVESTIGATE':item.tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','color-icon-INTEGRATION':item.tender_type === '一体化','color-icon-OTHER':item.tender_type === '其他',}")
                            i.iconfont(:class="{'icon-SUPERVISION':item.tender_type === '监理','icon-design':item.tender_type === '设计','icon-INVESTIGATE':item.tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','icon-INTEGRATION':item.tender_type === '一体化','icon-OTHER':item.tender_type === '其他',}")
                            span  {{item.tender_type}}
                          span.pro-location {{item.province}} / {{item.city}} / {{item.area}}
                      .pro-assist
                        .pro-endTime {{item.end_datetime}}
                        .pro-price
                          span {{item.amount}}
                          | 万
          //公告
          .content-page(@swipeleft="contentSwipeleft()" @swiperight="contentSwiperight()")
            .mui-scroll-wrapper
              .mui-scroll.cell-row
                .filter-wrapper
                  .filter
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item
                    .pro-time
                      i.iconfont.icon-time
                      span  &nbsp;2018.05.06
                    .pro-content
                      .pro-main
                        .pro-name.mui-ellipsis-2 间隙省赣州经济技术开
                        .pro-main-sign
                          span.pro-style
                            i.iconfont.icon-SUPERVISION
                            span 监理
                          span.pro-location 江西 / 赣州 / 兴国
                      .pro-assist
                        .pro-endTime 33天截止报名
                        .pro-price
                          span 65878.67
                          | 万
          //中标
          .content-page(@swipeleft="contentSwipeleft()" @swiperight="contentSwiperight()")
            .mui-scroll-wrapper#pulll
              .mui-scroll.cell-row
                .filter-wrapper
                  .filter
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item(v-for="item in pageIndex2.data")
                    .pro-time
                      i.iconfont.icon-time
                      span  &nbsp;{{item.info_date}}
                    .pro-content
                      .pro-main
                        .pro-name.mui-ellipsis-2 {{item.name}}
                        .pro-main-sign
                          span.pro-style(:class="{'color-icon-SUPERVISION':item.tender_type === '监理','color-icon-design':item.tender_type === '设计','color-icon-INVESTIGATE':item.tender_type === '勘察','color-icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','color-icon-INTEGRATION':item.tender_type === '一体化','color-icon-OTHER':item.tender_type === '其他',}")
                            i.iconfont(:class="{'icon-SUPERVISION':item.tender_type === '监理','icon-design':item.tender_type === '设计','icon-INVESTIGATE':item.tender_type === '勘察','icon-THECONSTRUCTIONOFTHE':item.tender_type === '施工','icon-INTEGRATION':item.tender_type === '一体化','icon-OTHER':item.tender_type === '其他',}")
                            span {{item.tender_type}}
                          span.pro-location {{item.company_name}}
                      .pro-assist
                        .pro-price
                          span {{item.tender_je}}
                          | 万
                        .pro-endTime {{item.province}} / {{item.city}} / {{item.area}}
          //更多
          .content-page(@swiperight="contentSwiperight()")
            .mui-scroll-wrapper
              .mui-scroll.cell-row.more
                .filter-wrapper
                  .filter
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item
                    .pro-time
                      i.iconfont.icon-time
                      span  &nbsp;2018.05.06
                    .pro-content
                      .pro-assist
                        div.pro-style
                          i.iconfont.icon-SUPERVISION
                          span 监理
                      .pro-main
                        .pro-name.mui-ellipsis-2 间隙省赣州经济技术开间隙省赣州经济技术开间隙省赣州经济技术开
                        .pro-main-sign
                          span.pro-location 江西 / 赣州 / 兴国
    transition(name='filter')
      .mask(v-if="filterFlag")
        .popout-wrapper(v-if="filterFlag")
          .popout-filter-close(@tap="popoutFilter(false)")
          .popout-filter
            .popout-filter-btnGroup
              button 重置
              button 确定
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
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import axios from 'axios'
  import api from '../../assets/js/api'

  export default {
    name: 'home',
    data() {
      return {
        iconMsg: {
          "监理": {
            iconClass: "icon-SUPERVISION",
            color: "＃0E972F"
          }, "设计": {
            iconClass: "icon-design",
            color: "＃0E972F"
          }, "勘察": {
            iconClass: "icon-INVESTIGATE",
            color: "＃0968BA"
          }, "施工": {
            iconClass: "icon-THECONSTRUCTIONOFTHE",
            color: "＃0968BA"
          }, "一体化": {
            iconClass: "icon-INTEGRATION",
            color: "＃B5D750"
          }, "其他": {
            iconClass: "icon-OTHER",
            color: "＃00419A"
          },
        },
        pageKey: 0,//页面状态
        localLocation: '正在定位',//定位信息
        province: '',//选择的省份
        city: '',//选择的城市
        district: '',//选择的地区
        filterFlag: false,//筛选状态
        pageIndex0: {data: '', pageNum: 1},//招标订阅信息
        pageIndex1: {data: '', pageNum: 1},//招标公示信息
        pageIndex2: {data: '', pageNum: 1},//中标公示信息
        pageIndex3: {data: '', pageNum: 1},//更多信息
      }
    },
    methods: {
      //获取初始数据
      getData() {
        let _this = this;
        axios.get(`${api.baseApi}${api.apiList.home}`).then((res) => {
          let data = res.data.data;
          _this.pageIndex0.data = data.subscribe_list;
          _this.pageIndex2.data = data.success_tender_list;
          console.log(_this.pageIndex2)
        })
      },
      // 跳转页面
      openWindow(route) {
        mui.openWindow({
          url: `./${route}.html`,
          id: route,
        })
      },
      //页面切换
      jumpTo(key) {
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
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
            console.log(point);
            let geoc = new BMap.Geocoder();
            geoc.getLocation(point, function (rs) {
              let address = rs.addressComponents;
              _this.localLocation = `${address.city}-${address.district}`;
              //将定位存入本地缓存
              localStorage.setItem(lsKey.locationProvince, address.province);
              localStorage.setItem(lsKey.locationCity, address.city);
              localStorage.setItem(lsKey.locationDistrict, address.district);
            });
          });
        } else {
          this.province = localStorage.getItem(lsKey.locationProvince);
          this.city = localStorage.getItem(lsKey.locationCity);
          this.district = localStorage.getItem(lsKey.locationDistrict);
          this.localLocation = `${this.city} - ${this.district}`
        }
      },
      //筛选弹窗
      popoutFilter(station) {
        this.filterFlag = station;
        if (!station) return
      },
      //左滑事件
      contentSwipeleft() {
        this.pageKey = this.pageKey + 1;
        let key = this.pageKey;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },
      //左滑事件
      contentSwiperight() {
        this.pageKey = this.pageKey - 1;
        let key = this.pageKey;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      }
    },
    components: {},
    mounted() {
      mui.init({
        preloadPages: [
          {
            url: './selectLocation.html',
            id: 'selectLocation',
          }
        ],pullRefresh : [{
          container:'#pull',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
          up : {
            contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            callback :function () {
              console.log('我上啦了');
              this.endPullupToRefresh(false);
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },down:{
            callback:function () {

            }
          }
        },{
          container:'#pulll',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
          up : {
            contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            callback :function () {
              console.log('我上啦了了了');
              this.endPullupToRefresh(false);
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          },
          down:{
            callback:function () {

            }
          }
        }]
      });
      this.jumpTo(this.pageKey);
      mui('.mui-scroll-wrapper').scroll({
        indicators: false
      });
    },
    created() {
      this.location();
      this.getData();
    }
  }
</script>
