// src/app/home/App.vue

<template lang="pug">
#app
  header.mui-bar.mui-bar-nav
    h1.mui-title Mui-Vue-Pug-Sass-Starter
  .mui-content
    .mui-content-padded
      button.mu-btn.mui-btn-primary.mui-btn-block(type='button', v-on:tap='openAxios') 打开 Axios 测试页
    baidu-map.baiduMap(ak='yp1x3lN5VDX79HI0TCITCnml2MHjlDfg' :center="center" :zoom="zoom" @ready="handler")
      bm-geolocation(anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true")
</template>
<style lang="stylus">
  h1{
    color #2ac845
  }
  .baiduMap{
    width 100%
    height 3rem
  }
</style>
<script>
/* global mui */
import BaiduMap from '../../components/BaiduMap/map/Map'
import BmGeolocation from '../../components/BaiduMap/controls/Geolocation'

export default {
  name: 'home',
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3
    }
  },
  methods: {
    openAxios () {
      mui.openWindow({
        url: './axios.html',
        id: 'axios'
      })
    },handler ({BMap, map}) {
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15
    }
  },
  components: {
    'BaiduMap':BaiduMap,
    'BmGeolocation':BmGeolocation
  },
  mounted () {
    mui.init();
  }
}
</script>
