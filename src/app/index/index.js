
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill();
Es6Promise.polyfill()

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
