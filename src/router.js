import Vue from "vue"
import Router from 'vue-router'
import HomePage from "./components/HomePage.vue"
import HelloWorld from "./components/HelloWorld.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import Profile from "./components/Profile.vue"
import ProductPage from "./components/ProductPage.vue"
import ProductDetails from "./components/ProductDetails.vue"
import Cart from "./components/Cart.vue"
import About from "./components/About.vue"
import ContactUs from "./components/ContactUs.vue"
import Favourite from "./components/Favourite.vue"
import Checkout from "./components/Checkout.vue"
import Comparison from "./components/Comparison.vue"
import Payment from "./components/Payment.vue"
import ProductManagement from "./components/ProductManagement.vue"
import OrderManagement from "./components/OrderManagement.vue"
import UserManagement from "./components/UserManagement.vue"
import Chatbot from "./components/Chatbot.vue"

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
            name: 'loginPage',
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
        {
            path: '/allproducts',
            name: 'productPage',
            component: ProductPage
        },
        {
            path: '/details',
            name: 'productDetails',
            component: ProductDetails
        },
        {
            path: '/cart',
            name: 'cart',
            component: Cart
        },
        {
            path: '/about',
            name: 'aboutUs',
            component: About
        },
        {
            path: '/contact',
            name: 'contactUs',
            component: ContactUs
        },
        {
            path: '/favourite',
            name: 'favourite',
            component: Favourite
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: Checkout
        },
        {
            path: '/comparison',
            name: 'comparison',
            component: Comparison
        },
        {
            path: '/payment',
            name: 'paymentPage',
            component: Payment
        },
        {
            path: '/productManagement',
            name: 'productManagement',
            component: ProductManagement
        },
        {
            path: '/orderManagement',
            name: 'orderManagement',
            component: OrderManagement
        },
        {
            path: '/userManagement',
            name: 'userManagement',
            component: UserManagement
        },
        {
            path: '/chatbot',
            name: 'liveChatbot',
            component: Chatbot
        }
    ]
})