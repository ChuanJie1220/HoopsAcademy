<template>
    <div style="padding: 30px">
        <div v-if="isLoading" class="text-center p-5">
            <b-spinner label="Loading..."></b-spinner>
        </div>

        <div v-else class="p-4">
            <div class="d-flex flex-row gap-3 align-items-center justify-content-center w-100">
                <b-nav tabs justified v-if="isAdmin">
                <b-nav-item :to="{ path: '/profile' }" exact active-class="active-tab">Profile</b-nav-item>
                <b-nav-item :to="{ path: '/orderManagement' }" exact active-class="active-tab">Orders</b-nav-item>
                <b-nav-item :to="{ path: '/favourite' }" exact active-class="active-tab">Favourites</b-nav-item>
                <b-nav-item :to="{ path: '/userManagement' }" exact active-class="active-tab">User
                    Management</b-nav-item>
            </b-nav>
            <b-nav tabs justified v-else>
                <b-nav-item :to="{ path: '/profile' }" exact active-class="active-tab">Profile</b-nav-item>
                <b-nav-item :to="{ path: '/orderManagement' }" exact active-class="active-tab">Orders</b-nav-item>
                <b-nav-item :to="{ path: '/favourite' }" exact active-class="active-tab">Favourites</b-nav-item>
            </b-nav>
            </div>
            <h2 class="caption">Favourites</h2>

            <b-row class="mb-3">
                <b-col>
                    <b-form-input v-model="search" placeholder="Search"></b-form-input>
                </b-col>
            </b-row>

            <div v-if="filteredItems.length > 0">
                <b-table :items="filteredItems" :fields="fields" :per-page="perPage" :current-page="currentPage"
                    responsive="sm">
                    <template #cell(image)="data">
                        <b-img :src="require(`@/assets/${data.item.image[0]}`)" fluid height="80"
                            style="width: 120px; height: auto;"></b-img>
                    </template>

                    <template #cell(actions)="data">
                        <b-button size="sm" variant="outline-danger" @click="removeFavourite(data.index)">
                            <b-icon icon="trash"></b-icon>
                        </b-button>
                    </template>
                </b-table>

                <b-pagination v-model="currentPage" :total-rows="filteredItems.length" :per-page="perPage"
                    align="center" class="mt-3"></b-pagination>
            </div>

            <div v-else class="text-center p-5">
                <h2 class="fw-bold mb-3">YOUR FAVOURITE IS EMPTY</h2>
                <p class="mb-4">
                    Once you add something to your favourite– it will appear here. Ready to get started?
                </p>
                <b-button variant="dark" class="d-inline-flex align-items-center" @click="goToProducts">
                    GET STARTED
                    <b-icon icon="arrow-right" class="ms-2"></b-icon>
                </b-button>
            </div>
        </div>
    </div>
</template>


<script>
import store from "../store.js";
/* eslint-disable */
export default {
    name: "favourite",
    components: {
    },
    computed: {
        filteredItems() {
            const term = this.search.toLowerCase();
            return this.favourites.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
        },
    },
    data: function () {
        return {
            isAdmin: false,
            search: '',
            currentPage: 1,
            perPage: 10,
            isLoading: true,
            fields: [
                { key: 'image', label: '' },
                { key: 'name', label: 'Name' },
                { key: 'brand', label: 'Brand' },
                { key: 'price', label: 'Price' },
                { key: 'actions', label: 'Actions' },
            ],
            favourites: []
        };
    },
    props: {
    },
    methods: {
        async getFavourites() {
            const storedUser = JSON.parse(localStorage.getItem('user'));

            if (storedUser && storedUser.userID) {
                const userID = storedUser.userID;
                try {
                    const res = await this.$axios.get(`/getFavouriteList/${userID}`);
                    console.log('favourites', JSON.parse(res?.data[0].productImage));

                    if (res.status === 200) {
                        this.favourites = res.data.map(item => ({
                            name: item.productName,
                            brand: item.productBrand,
                            price: item.productPrice,
                            image: JSON.parse(item.productImage),
                            productID: item.productID,
                            favouriteID: item.favourite_id
                        }));

                        console.log('this.favourite', this.favourites)
                    }
                } catch (err) {
                    console.error('Error fetching favourites:', err);
                }
            } else {
                console.warn('User is not logged in or userID not found in localStorage');
            }
            this.isLoading = false;
        },
        async removeFavourite(index) {
            if (store.isLogin) {
                const product = this.favourites[index];
                const favouriteID = product.favouriteID;
                const userID = store.user.userID;

                try {
                    await this.$axios.post(`/deleteFavourite/${favouriteID}`, { userID });

                    this.favourites.splice(index, 1); // Remove item from local list
                    this.$showSuccess("success", "Removed from Favourites");
                } catch (error) {
                    this.$showSuccess("danger", "Failed to remove favourite.");
                    console.error("Remove favourite error:", error);
                }
            } else {
                this.$showSuccess("warning", "Please login to use.");
                this.$router.push({ name: "home" });
                this.$emit("openModal");
            }
        },
        goToProducts() {
            this.$router.push('/allproducts');
        }

    },
    mounted() {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        const isAdmin = userDetails.is_admin;
        this.isAdmin = isAdmin === 0 ? false : true;
        this.getFavourites();
    },
    watch: {
    }
}
</script>

<style scoped>
.active-tab {
    background-color: #f8f9fa;
    padding-left: 10px;
}

.caption {
    text-align: center;
    margin: 20px;
}
</style>