import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import axiosPlugin from './axiosPlugin'
import {BootstrapVue, IconsPlugin, ToastPlugin  } from 'bootstrap-vue'
import Swal from 'sweetalert2'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { FormSelectPlugin } from 'bootstrap-vue'
import store from './store'
import 'bootstrap-icons/font/bootstrap-icons.css';

Vue.use(FormSelectPlugin);
Vue.use(axiosPlugin);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(ToastPlugin);


axios.defaults.baseURL = "http://127.0.0.1:8000/api/"
Vue.config.productionTip = false

const savedUser = localStorage.getItem('user');
const isLogin = localStorage.getItem('isLogin') === 'true';

if (savedUser && isLogin) {
  store.user = JSON.parse(savedUser);
  store.isLogin = true;
}

Vue.prototype.$showAlert = async function(type, title, message, buttons) {
  return new Promise((resolve) => {
    // Implement your custom alert logic here
    // This example uses SweetAlert2 for demonstration purposes
    Swal.fire({
      icon: type,
      title: title,
      html: message,
      showCancelButton: true,
      confirmButtonText: buttons[0].text,
      confirmButtonColor: buttons[0].color,
      cancelButtonText: buttons[1].text,
      cancelButtonColor: buttons[1].color
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

Vue.prototype.$goBack = async function(type, title, message, buttons) {
  return new Promise((resolve) => {
    // Implement your custom alert logic here
    // This example uses SweetAlert2 for demonstration purposes
    Swal.fire({
      icon: type,
      title: title,
      html: message,
      confirmButtonText: buttons[0].text,
      confirmButtonColor: buttons[0].color
    }).then((result) => {
      if (result.isConfirmed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

Vue.prototype.$showSuccess = async function(type, title, message) {
  return new Promise((resolve) => {
    Swal.fire({
      icon: type,
      title: title,
      html: message
    }).then((result) => {
      resolve(result);
    });
  });
};

new Vue({
  router,
  render: h => h(App),
  data: {
    messages: [],
  },
}).$mount('#app')
