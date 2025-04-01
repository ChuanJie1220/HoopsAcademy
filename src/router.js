import Vue from "vue"
import Router from 'vue-router'
import HomePage from "./components/HomePage.vue"
import HelloWorld from "./components/HelloWorld.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import Profile from "./components/Profile.vue"

Vue.use(Router) 

export default new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage
        },
        {
            path: '/hello',
            name: 'hello',
            component: HelloWorld
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile
        },
    ]
})