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
                        <b-dropdown-item :to="'/accessories'">Accessories</b-dropdown-item>
                        <b-dropdown-item :to="'/apparel'">Apparel</b-dropdown-item>
                        <b-dropdown-item :to="'/bags'">Bags</b-dropdown-item>
                        <b-dropdown-item :to="'/footwear'">Footwear</b-dropdown-item>
                        <b-dropdown-item :to="'/racquet'">Racquet</b-dropdown-item>
                        <b-dropdown-item :to="'/products'">View All Products</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item-dropdown text="Brands" right>
                        <!-- Add brand links here -->
                    </b-nav-item-dropdown>
                    <b-nav-item :to="'/comparison'">Comparisons</b-nav-item>
                    <b-nav-item :to="'/promotion'">Promotions</b-nav-item>
                    <b-nav-item :to="'/contact'">Contact Us</b-nav-item>
                    <b-nav-item :to="'/about'">About Us</b-nav-item>
                    <b-nav-item :to="'/chat'">Chat Bot</b-nav-item>
                </b-navbar-nav>
            </b-collapse>

            <!-- Search Bar -->
            <b-form class="d-flex ms-auto me-3" @submit.prevent="performSearch">
                <b-form-input v-model.trim="searchQuery" class="me-2" placeholder="Search..."></b-form-input>
                <b-button type="submit" variant="primary">🔍</b-button>
            </b-form>

            <!-- Login & Cart Icons -->
            <div v-if="show">
                <img v-b-modal.login class="login-logo" src="@/assets/user.png" alt="User" />
                <img v-b-modal.login class="cart-logo" src="@/assets/cart.png" alt="Cart" />
            </div>
            <div v-else>
                <img v-b-toggle.sidebar class="login-logo" src="@/assets/user.png" alt="User" />
                <img v-b-toggle.sidebar class="cart-logo" src="@/assets/cart.png" alt="Cart" />
            </div>
        </b-navbar>

        <!-- Modals & Sidebar -->
        <div>
            <b-modal id="login" hide-footer v-model="modalOpen">
                <b-tabs content-class="mt-3">
                    <b-tab title="Login">
                        <Login @update="updateShow" />
                    </b-tab>
                    <b-tab title="Sign Up">
                        <SignUp />
                    </b-tab>
                </b-tabs>
            </b-modal>
            <b-sidebar id="sidebar" right shadow backdrop>
                <div class="px-3 py-2">
                    <UserProfile :showOption="isLogin" @update="updateShow" />
                </div>
            </b-sidebar>
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
            searchQuery: "",
            show: true,
            isLogin: false,
            modalOpen: false,
        };
    },
    props: {
    homeLink: {
        type: String,
        default: "/",
    },
    title: {
        type: String,
        default: "The Hoops Academy",
    },
    logo: {
        type: String,
        default: require("@/assets/ComLogo.png"),
},

    },
    methods: {
        performSearch() {
            if (this.searchQuery.trim() !== "") {
                console.log("Searching for:", this.searchQuery);
                this.$router.push({ path: "/search", query: { q: this.searchQuery } });
            }
        },
        updateShow(value) {
            this.show = value.show;
            this.isLogin = value.isLogin;
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
</style>