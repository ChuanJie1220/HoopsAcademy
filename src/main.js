import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import axiosPlugin from './axiosPlugin'
import BootstrapVue, { IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(axiosPlugin);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);


axios.defaults.baseURL = "http://127.0.0.1:8000/api/"
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  data: {
    messages: [],
  },
}).$mount('#app')
