
import Vue from 'vue'
import App from './App'
import mixin from '../../assets/js/mixin'
Vue.mixin(mixin);
// eslint-disable-next-line
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
