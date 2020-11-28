import Vue from 'vue'
import App from "./App";
import router from './router'
import store from './store'

//
import toast from 'components/common/toast'

Vue.config.productionTip = false

//创建总线
Vue.prototype.$bus = new Vue()

Vue.use(toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
