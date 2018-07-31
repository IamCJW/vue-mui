
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
import mixin from '../../assets/js/mixin'

require('es6-promise').polyfill();
Es6Promise.polyfill();


Vue.mixin(mixin);
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
