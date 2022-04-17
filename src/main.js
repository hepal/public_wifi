import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { VueJsonp } from 'vue-jsonp'
import VueSession from 'vue-session'

Vue.use(VueJsonp)

Vue.config.productionTip = false

Vue.prototype.$viewer = null
Vue.prototype.$admin = null

var sessionOptions = {
  persist: true
}

Vue.use(VueSession, sessionOptions);

new Vue({  
  router,
  render: h => h(App)
}).$mount('#app')
