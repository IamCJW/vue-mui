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
        button.home-bar-item(@tap="jumpTo(0)", :class="{active: pageKey===0}") 招标订阅
        button.home-bar-item(@tap="jumpTo(1)", :class="{active: pageKey===1}") 招标公告
        button.home-bar-item(@tap="jumpTo(2)", :class="{active: pageKey===2}") 中标公示
        button.home-bar-item(@tap="jumpTo(3)", :class="{active: pageKey===3}") 更多信息
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .scroll-wrapper#page1
              .scroll-box
                .filter-wrapper
                  .filter(@tap="")
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
                            span &nbsp;{{item.tender_type}}
                          span.pro-location {{item.province}}
                            template(v-if="item.city") / {{item.city}}
                              template(v-if='item.district')  / {{item.district}}
                      .pro-assist
                        .pro-endTime {{item.end_datetime}}
                        .pro-price
                          span {{item.amount}}
                          | 万
          //公告
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper.cell-row#page2
              .scroll-box
                .filter-wrapper
                  .filter(@tap="popoutFilter(true,false)")
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item(v-for="item in pageIndex1.data" @tap="openWindow('detail',{rid:item.rid})")
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
                          span.pro-location {{item.province}} / {{item.city}}
                            template(v-if='item.district')  / {{item.district}}
                      .pro-assist
                        .pro-endTime {{item.end_datetime}}
                        .pro-price
                          span {{item.amount}}
                          | 万
          //中标
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="contentSwiperight()")
            .scroll-wrapper.cell-row#page3
              .scroll-box
                .filter-wrapper
                  .filter(@tap="popoutFilter(true,false)")
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
                            span &nbsp;{{item.tender_type}}
                          span.pro-location {{item.company_name}}
                      .pro-assist
                        .pro-price
                          span {{item.tender_je}}
                          | 万
                        .pro-endTime {{item.province}} / {{item.city}}
                          template(v-if='item.district')  / {{item.district}}
          //更多
          .content-page(@swiperight="contentSwiperight()")
            .scroll-wrapper#page4
              .scroll-box
                .filter-wrapper
                  .filter(@tap="popoutFilter(true,true)")
                    span 筛选&nbsp;
                    i.iconfont.icon-filter
                .pro-group
                  .pro-item.more(v-for='item in pageIndex3.data')
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
                          span.pro-location {{item.province}} / {{item.city}}
                            template(v-if='item.district')  / {{item.district}}
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
                  span(v-if='filterLocation.index !== 0',@tap="filterBack()") 上一级
                  span(v-for="(item,index) in filterLocation.data", :class="{active:filterSelect.location.province === item.name || filterSelect.location.city === item.name || filterSelect.location.district === item.name}", @tap="filterSelectPro(filterLocation.index,item.name)") {{item.name}}
              template( v-if="!isMore")
                .filter-typeGroup(v-for="(value,key) in commonDict" v-if="key !== 'info_dict'")
                  .filter-type(v-if="key === 'amount_dict'") 招标金额
                  .filter-type(v-else-if="key === 'tender_dict'") 行业类型
                  .filter-type(v-else-if="key === 'construction_dict'") 专业类型
                  .filter-keyGrouup
                    span(v-for="item in value",:class="{active:filterSelect[key].value === item.value}", @tap="filterSelectPro(key,item)") {{item.name}}
              .filter-typeGroup(v-else)
                .filter-type 信息类型
                .filter-keyGrouup
                  span(v-for="item in commonDict['info_dict']" ,:class="{active:filterSelect['info_dict'].value === item.value}", @tap="filterSelectPro('info_dict',item)") {{item.name}}
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
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http'
  import api from '../../assets/js/api'

  export default {
    name: 'home',
    data() {
      return {
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
          data: ''
        },//地址筛选数据
        filterSelect: {
          location: {province: '', city: '', district: ''},
          amount_dict: '',
          construction_dict: '',
          info_dict: '',
          tender_dict: ''
        },
        nation: '',//地址数据
      }
    },
    methods: {
      //获取初始数据
      getData() {
        //获取项目数据
        http({
          url: api.home,
          success: (data) => {
            this.pageIndex0.data = data.subscribe_list;
            this.pageIndex1.data = data.tender_list;
            this.pageIndex2.data = data.success_tender_list;
            this.pageIndex3.data = data.more_list;
            window.addEventListener('refresh', () => {
              location.reload()
            })
          }
        });
        http({
          url: api.common_dict,
          success: (data) => {
            this.commonDict = data;
            for (let item in data) {
              this.filterSelect[item] = data[item][0];
            }
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
        this.filterLocation.data = this.nation;
        if (this.city !== '') {
          let flag = true;
          this.filterLocation.data.forEach((item) => {
            if (item.name === this.province) {
              this.filterLocation.index = 1;
              this.filterLocation.data = item.city;
              flag = false;
            }
          });
          if (flag) {
            this.filterLocation.data = this.nation;
            return
          }
        }
        if (this.district !== '') {
          this.filterLocation.index = 2;
          this.filterLocation.data.forEach((item) => {
            if (item.name === this.city) {
              this.filterLocation.data = item.district;
            }
          });
        }
      },
      // 筛选选择
      filterSelectPro(key, value) {
        switch (key) {
          case 0:
            this.filterSelect.location.province = value;
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
            this.filterLocation.index = 0;
            this.filterLocation.data = this.nation;
            break;
          case 2:
            this.filterLocation.index = 1;
            for (let key in this.filterLocation.data) {
              if (this.filterLocation.data[key].name === this.filterSelect.location.province) {
                this.filterLocation.data = this.filterLocation.data[key].city;
                return
              }
            }
            break;
        }
      },
      //条件提交
      filterSubmit() {
        let filterSelect = this.filterSelect;
        let data = {
          amount: filterSelect.amount,
          city: filterSelect.location.city,
          construction: filterSelect.construction_dict,
          cur_page: 1,
          district: filterSelect.location.district,
          province: filterSelect.location.province,
          tender: filterSelect.tender_dict
        };
        switch (this.pageKey) {
          case 1:
            http({
              url: api.tender,
              data: data,
              success: (data) => {
                this.pageIndex1.data = data.result;
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
          info_dict: '',
          tender_dict: ''
        }
      },
      // 跳转页面
      openWindow(route,data) {
        mui.openWindow({
          url: `./${route}.html`,
          id: route,
          extras:data
        })
      },
      //页面切换
      jumpTo(key) {
        this.filterFlag = false;
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
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
      popoutFilter(station, isMore) {
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
      }
    },
    components: {},
    mounted() {
      let vueThis = this;
      mui.init({
        preloadPages: [
          {
            url: './selectLocation.html',
            id: 'selectLocation',
          }
        ], pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.pageIndex0.pageNum += 1;
              http({
                url: api.tender_subscribe,
                data: {
                  province: vueThis.province,
                  cur_page: vueThis.pageIndex0.pageNum
                }, success: (data) => {
                  vueThis.pageIndex0.data = vueThis.pageIndex0.data.concat(data.result);
                  if (data.total_page === vueThis.pageIndex0.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }, {
          container: '#page2',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.pageIndex1.pageNum += 1;
              http({
                url: api.tender,
                data: {
                  province: vueThis.province,
                  cur_page: vueThis.pageIndex1.pageNum
                }, success: (data) => {
                  vueThis.pageIndex1.data = vueThis.pageIndex1.data.concat(data.result);
                  if (data.total_page === vueThis.pageIndex1.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }, {
          container: '#page3',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.pageIndex2.pageNum += 1;
              http({
                url: api.tender_success,
                data: {
                  province: vueThis.province,
                  cur_page: vueThis.pageIndex2.pageNum
                }, success: (data) => {
                  vueThis.pageIndex2.data = vueThis.pageIndex2.data.concat(data.result);
                  if (data.total_page === vueThis.pageIndex2.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }, {
          container: '#page4',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.pageIndex3.pageNum += 1;
              http({
                url: api.tender_more,
                data: {
                  province: vueThis.province,
                  cur_page: vueThis.pageIndex3.pageNum
                }, success: (data) => {
                  vueThis.pageIndex3.data = vueThis.pageIndex3.data.concat(data.result);
                  if (data.total_page === vueThis.pageIndex3.pageNum) {
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
      this.jumpTo(this.pageKey);
      mui('.mui-scroll-wrapper').scroll();
    },
    created() {
      this.location();
      this.getData();
    }
  }
</script>
