// src/app/home/App.vue

<template lang="pug">
  #app
    .header-full
    .home-header
      .home-search-wrapper
        .home-location
          i.iconfont.icon-site
          span 深圳市-福田区
          i.iconfont.icon-TRIANGLE
        .home-search
          div 请输入要查询的项目名称
          i.iconfont.icon-SEARCH
      .home-bar-nav
        button.home-bar-item(@tap="jumpTo(0)") 招标订阅
        button.home-bar-item(@tap="jumpTo(1)") 招标公告
        button.home-bar-item(@tap="jumpTo(2)") 中标公示
        button.home-bar-item(@tap="jumpTo(3)") 更多信息
    .mui-content
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page
            .mui-scroll-wrapper
              .mui-scroll.cell-row
                .filter-wrapper
                  .filter
                    span 订阅管理&nbsp;
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
          .content-page
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
          .content-page
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
                          span.pro-location 深圳快标科技有限公司
                      .pro-assist
                        .pro-price
                          span 65878.67
                          | 万
                        .pro-endTime 江西 / 赣州 / 兴国
          .content-page
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
</template>
<style lang="stylus" scoped>
  @import "home.styl"
</style>
<script>
  /* global mui */
  /* global BMap */
  export default {
    name: 'home',
    data() {
      return {
        pageKey: '0'
      }
    },
    methods: {
      //页面切换
      jumpTo(key) {
        this.pageKey = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },
      // 自动定位
      location() {

      },
      addressDetail() { //获取地理位置
        //全局的this在方法中不能使用，需要重新定义一下
        var geolocation = new BMap.Geolocation();
        //调用百度地图api 中的获取当前位置接口
        geolocation.getCurrentPosition(function(r) {
          // let point = {lat:r.latitude,lon:r.longitude}
          let point = new BMap.Point(r.longitude, r.latitude);
          console.log(point);
          let geoc = new BMap.Geocoder();
          geoc.getLocation(point, function (rs) {
            console.log(rs)
            // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          });
        });
      }
    },
    components: {},
    mounted() {
      mui.init();
      this.jumpTo(this.pageKey);
      mui('.mui-scroll-wrapper').scroll();
    },
    created(){
      // this.addressDetail()
      // let myGeo = new BMap.Geocoder();
      // console.log(myGeo);
      // let point = new BMap.Point(114.02597366, 22.54605355);

      this.addressDetail();
    }
  }
</script>
