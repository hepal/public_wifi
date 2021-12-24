import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { VueJsonp } from 'vue-jsonp'

Vue.use(VueJsonp)

Vue.config.productionTip = false

Vue.prototype.$viewer = null
Vue.prototype.$admin = null

new Vue({  
  router,
  render: h => h(App)
}).$mount('#app')
