import Vue from 'vue';

const store = Vue.observable({
    user: {},
    isLogin: false,
    logout() {
        this.user = {};
        this.isLogin = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isLogin');
      }
});

export default store;