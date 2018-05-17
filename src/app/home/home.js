// src/app/index/index.js
// 入口文件，需和目录名一致
// 基本所有入口文件都可如下一致

import Vue from 'vue'
import App from './App'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap,{
  ak:'typ1x3lN5VDX79HI0TCITCnml2MHjlDfg'
})
// eslint-disable-next-line
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
