import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import '@/common/styles/index.less' // common styles

import App from './App.vue'
import router from './router'
import store from './store'

import '@/common/icons' // icons
import '@/permission' // permission control

Vue.use(iView)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
