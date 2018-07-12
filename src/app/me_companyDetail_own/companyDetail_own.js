
import Vue from 'vue'
import App from './App'
import mixin from '../../assets/js/mixin'

Vue.mixin(mixin)
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
