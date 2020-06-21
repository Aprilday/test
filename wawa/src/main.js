// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueLazyload from 'vue-lazyload'
// import VueLazyload from './lib/lazyload/index'
import VueLazyload from '@/components/MyLazyload/index'

Vue.use(VueLazyload, {
  preLoad: 1,
}) 

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
