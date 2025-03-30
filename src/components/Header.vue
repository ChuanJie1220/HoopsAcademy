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
                        <b-dropdown-item href="#/accessories">Accessories</b-dropdown-item>
                        <b-dropdown-item href="#/apparel">Apparel</b-dropdown-item>
                        <b-dropdown-item href="#/bags">Bags</b-dropdown-item>
                        <b-dropdown-item href="#/footwear">Footwear</b-dropdown-item>
                        <b-dropdown-item href="#/racquet">Racquet</b-dropdown-item>
                        <b-dropdown-item href="#/products">View All Products</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown text="Brands" right>
                        
                    </b-nav-item-dropdown>
                    <b-nav-item href="#/comparison">Comparisons</b-nav-item>
                    <b-nav-item href="#/promotion">Promotions</b-nav-item>
                    <b-nav-item href="#/contact">Contact Us</b-nav-item>
                    <b-nav-item href="#/about">About Us</b-nav-item>
                    <b-nav-item href="#/chat">Chat Bot</b-nav-item>
                </b-navbar-nav>
            </b-collapse>

            <b-form class="d-flex ms-auto me-3" @submit.prevent="performSearch">
                <b-form-input v-model="searchQuery" class="me-2" placeholder="Search..."></b-form-input>
                <b-button type="submit" variant="primary">🔍</b-button>
            </b-form>

            <div class="login" v-if="show">
                <img v-b-modal.login class="login-logo" src="../assets/user.png" alt="User" />
            </div>
            <div class="login" v-else>
                <img v-b-toggle.sidebar class="login-logo" src="../assets/user.png" alt="User" />
            </div>
            <div class="cart" v-if="show">
                <img v-b-modal.login class="cart-logo" src="../assets/cart.png" alt="Cart" />
            </div>
            <div class="cart" v-else>
                <img v-b-toggle.sidebar class="cart-logo" src="../assets/cart.png" alt="Cart" />
            </div>
        </b-navbar>
        <div>
            <b-modal id="login" hide-footer v-if="show" v-model="modalOpen">
                <b-tabs content-class="mt-3">
                    <b-tab title="Login">
                        <Login @update="updateShow" />
                    </b-tab>
                    <b-tab title="Sign Up">
                        <SignUp />
                    </b-tab>
                    <!-- <b-tab title="User Profile" v-else>
              <UserProfile :showOption="this.isLogin" @update="updateShow" />
            </b-tab> -->
                </b-tabs>
            </b-modal>
            <b-sidebar id="sidebar" right shadow v-if="!show" backdrop>
                <div class="px-3 py-2">
                    <UserProfile :showOption="this.isLogin" @update="updateShow" />
                </div>
            </b-sidebar>
        </div>
        <div class="router-view">
            <router-view @openModal="openModal" />
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'header',
    components: {
    },
    computed: {
    },
    data: function () {
        return {
            homeLink: "/",
            title: "The Hoops Academy",
            logo: require("@/assets/ComLogo.png"),
            isNavbarCollapsed: false,
            isDropdownVisible: false,
            categories: [],
            searchQuery: "", // Fix: Add search input data
            show: true, // Fix: Define `show` for login/cart display
            isLogin: false, // Fix: Define `isLogin` for UserProfile
            modalOpen: false, // Fix: Control login modal state
        };
    },
    props: {
    },
    methods: {
        performSearch() {
            if (this.searchQuery.trim() !== "") {
                console.log("Searching for:", this.searchQuery);
                this.$router.push({ path: "/search", query: { q: this.searchQuery } });
            }
        },
        updateShow(value) {
            this.show = val.show;
            this.isLogin = val.isLogin;
        },
        openModal() {
            this.modalOpen = true;
        },
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    visibility: visible;
    background-color: #212121;
    /* Slightly lighter dark background */
    padding: 0.5rem 1rem;
    /* Adjusted padding */
}

.navbar-brand {
    display: flex;
    align-items: center;
    color: #f1f1f1;
    font-size: 1.5rem;
    font-weight: 600;
}

.logo {
    width: 50px;
    /* Slightly larger logo */
    height: auto;
}

a {
    text-decoration: none;
}

nav ul {
    list-style-type: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin-right: 10px;
}

nav ul li a {
    color: #fff;
    text-decoration: none;
}

b-button {
    height: 50px;
    width: 50px;
    padding: 10px;
}

.login-logo {
    height: 50px;
    width: 50px;
    padding: 10px;
}

.cart-logo {
    height: 50px;
    width: 50px;
    padding: 10px;
}

.header-container {
    display: flex;
    flex-direction: column;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background-color: #333;
    color: #fff;
}
</style>