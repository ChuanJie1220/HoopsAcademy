<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand :to="homeLink" class="navbar-brand d-flex align-items-center">
                <img :src="logo" alt="Logo" class="logo">
                <span class="ms-2">{{ title }}</span>
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item-dropdown text="Products" right>
                        <b-dropdown-item @click="toPath('accessories')">Accessories</b-dropdown-item>
                        <b-dropdown-item @click="toPath('apparel')">Apparel</b-dropdown-item>
                        <b-dropdown-item @click="toPath('bags')">Bags</b-dropdown-item>
                        <b-dropdown-item @click="toPath('footwear')">Footwear</b-dropdown-item>
                        <b-dropdown-item @click="toPath('racquet')">Racquet</b-dropdown-item>
                        <b-dropdown-item :to="'/allproducts'">View All Products</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown text="Brands" right>
                        <b-dropdown-item @click="toBrand('nike')">NIKE</b-dropdown-item>
                        <b-dropdown-item @click="toBrand('adidas')">ADIDAS</b-dropdown-item>
                        <b-dropdown-item @click="toBrand('yonex')">YONEX</b-dropdown-item>
                        <b-dropdown-item @click="toBrand('li-ning')">LI-NING</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item :to="'/comparison'">Comparisons</b-nav-item>
                    <b-nav-item :to="'/contact'">Contact Us</b-nav-item>
                    <b-nav-item :to="'/about'">About Us</b-nav-item>
                    <b-nav-item :to="'/chatbot'">Chatbot</b-nav-item>
                </b-navbar-nav>
            </b-collapse>

            <!-- Login & Cart -->
            <div class="nav-container">
                <!-- Dropdown for Login -->
                <b-dropdown variant="link" no-caret right class="login-dropdown" menu-class="dropdown-menu-custom">
                    <template #button-content>
                        <img class="login-logo" src="@/assets/user.png" alt="User" />
                    </template>

                    <template v-if="store.isLogin">
                        <b-dropdown-item @click="goToProfile()">My Profile</b-dropdown-item>
                        <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
                    </template>

                    <template v-else>
                        <b-dropdown-item :to="'/login'">Login</b-dropdown-item>
                        <b-dropdown-item :to="'/register'">Sign Up</b-dropdown-item>
                    </template>
                </b-dropdown>

                <img v-if="show" class="cart-logo" src="@/assets/cart.png" alt="Cart" @click="goToCart" />
                <img v-else class="cart-logo" src="@/assets/cart.png" alt="Cart" @click="goToCart" />

            </div>
        </b-navbar>
    </div>
</template>

<script>
import store from '@/store';

/* eslint-disable */
export default {
    name: 'header',
    components: {
    },
    computed: {
    },
    data: function () {
        return {
            searchQuery: "",
            show: true,
            store,
            isLogin: false,
        };
    },
    props: {
        homeLink: {
            type: String,
            default: "/",
        },
        title: {
            type: String,
            default: "Hoops Academy",
        },
        logo: {
            type: String,
            default: require("@/assets/ComLogo.png"),
        },

    },
    methods: {
        updateShow(value) {
            this.show = value.show;
            this.isLogin = value.isLogin;
        },
        goToCart() {
            this.$router.push({ name: 'cart' });
        },
        logout() {
            store.user = {};
            store.isLogin = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isLogin');
            this.$router.push('/login');
        }, 
        goToProfile() {
            this.$router.push({ name: 'profile' });
        },
        toPath(type) {
            this.$router.push(`allproducts?categories=${type}`);
        },
        toBrand(brand) {
            this.$router.push(`allproducts?brands=${brand}`);
        }

    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    background-color: #212121;
    padding: 0.5rem 1rem;
}

.navbar-brand {
    display: flex;
    align-items: center;
    color: #f1f1f1;
    font-size: 1.5rem;
    font-weight: 600;
    gap: 10px;
}

.logo {
    width: 50px;
    height: auto;
}

b-button {
    height: 50px;
    width: 50px;
    padding: 10px;
}

.login-logo,
.cart-logo {
    height: 50px;
    width: 50px;
    padding: 10px;
}

::v-deep(.dropdown-menu-custom) {
    position: absolute !important;
    top: 100% !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    min-width: 140px;
    text-align: center;
    margin-top: -5px;
    background-color: white;
    border: 1px solid #ccc;
    z-index: 999;
}
</style>
