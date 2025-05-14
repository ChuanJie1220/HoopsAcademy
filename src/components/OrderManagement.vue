<template>
    <div style="padding: 30px">
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
        <div class="table-container">
            <b-table-simple hover caption-top responsive style="margin: 20px" v-if="is_admin">
                <caption>
                    <h2 class="table-caption">Orders</h2>
                </caption>
                <b-thead>
                    <b-tr>
                        <b-th>No</b-th>
                        <b-th>Buyer Name</b-th>
                        <b-th>Product Name</b-th>
                        <b-th>Quantity</b-th>
                        <b-th>Shipping Options</b-th>
                        <b-th>Delivery Address</b-th>
                        <b-th>Email Address</b-th>
                        <b-th>Payment Method</b-th>
                        <b-th>Status</b-th>
                        <b-th>Order Time</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="(order, index) in orders" :key="index">
                        <b-td>{{ index + 1 }}</b-td>
                        <b-td>{{ order.user_name }}</b-td>
                        <b-td>{{ order.product_name }}</b-td>
                        <b-td>{{ order.quantity }}</b-td>
                        <b-td>{{ order.shipping_option }}</b-td>
                        <b-td>{{ order.delivery_address }}</b-td>
                        <b-td>{{ order.email_address }}</b-td>
                        <b-td>{{ order.payment_method }}</b-td>
                        <b-td>
                            <div v-if="is_admin">
                                <b-dropdown :variant="calculateBadgeVariant(order.status)" :text="order.status"
                                    class="m-2">
                                    <b-dropdown-item v-model="status" value="Processing"
                                        @click="updateStatus(order.orderID, 'Processing')">Processing</b-dropdown-item>
                                    <b-dropdown-item v-model="status" value="Shipped"
                                        @click="updateStatus(order.orderID, 'Shipped')">Shipped</b-dropdown-item>
                                    <b-dropdown-item v-model="status" value="Completed"
                                        @click="updateStatus(order.orderID, 'Completed')">Completed</b-dropdown-item>
                                </b-dropdown>
                            </div>
                            <div v-else>
                                <b-badge pill variant="warning" v-if="order.status === 'Processing'">{{ order.status }}
                                </b-badge>
                                <b-badge pill variant="info" v-if="order.status === 'Shipped'">{{ order.status
                                }}</b-badge>
                                <b-badge pill variant="success" v-if="order.status === 'Completed'">{{ order.status
                                }}</b-badge>
                            </div>
                        </b-td>
                        <b-td>{{ order.created_at }}</b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
            <!-- Admin -->
            <b-table-simple hover caption-top responsive style="margin: 20px" v-else>
                <caption>
                    <h2 class="table-caption" style="text-align: center">My Order</h2>
                </caption>
                <b-thead>
                    <b-tr>
                        <b-th>No</b-th>
                        <b-th>Buyer Name</b-th>
                        <b-th>Product Name</b-th>
                        <b-th>Quantity</b-th>
                        <b-th>Shipping Options</b-th>
                        <b-th>Delivery Address</b-th>
                        <b-th>Email Address</b-th>
                        <b-th>Payment Method</b-th>
                        <b-th>Status</b-th>
                        <b-th>Order Time</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="(order, index) in orders" :key="index">
                        <b-td>{{ index + 1 }}</b-td>
                        <b-td>{{ order.user_name }}</b-td>
                        <b-td>{{ order.product_name }}</b-td>
                        <b-td>{{ order.quantity }}</b-td>
                        <b-td>{{ order.shipping_option }}</b-td>
                        <b-td>{{ order.delivery_address }}</b-td>
                        <b-td>{{ order.email_address }}</b-td>
                        <b-td>{{ order.payment_method }}</b-td>
                        <b-td>
                            <div>
                                <b-badge pill variant="warning" v-if="order.status === 'Processing'">{{ order.status }}
                                </b-badge>
                                <b-badge pill variant="info" v-if="order.status === 'Shipped'">{{ order.status
                                }}</b-badge>
                                <b-badge pill variant="success" v-if="order.status === 'Completed'">{{ order.status
                                }}</b-badge>
                            </div>
                        </b-td>
                        <b-td>{{ order.created_at }}</b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
            <div v-if="orders.length === 0">
                <h3>No Orders Yet</h3>
            </div>
        </div>
    </div>
</template>

<script>
import store from "@/store";

/* eslint-disable */
export default {
    name: 'orderManagement',
    components: {
    },
    computed: {
    },
    data: function () {
        return {
            isAdmin: false,
            orders: [],
            is_admin: store.user.is_admin,
            status: "",
            variant: "",
        };
    },
    props: {
    },
    methods: {
        async getOrders() {
            let result = await this.$axios.get("order/" + store.user.userID);
            this.orders = result.data;
        },
        async getAllOrders() {
            let result = await this.$axios.get("order");
            this.orders = result.data;
        },
        async updateStatus(id, val) {
            let dataToPost = {
                orderID: id,
                status: val,
            };
            console.log(dataToPost);
            let result = await this.$axios.post("order/update-status", dataToPost);
            this.getAllOrders();
        },
        calculateBadgeVariant(status) {
            if (status === "Processing") {
                return "warning";
            } else if (status === "Shipped") {
                return "info";
            } else if (status === "Completed") {
                return "success";
            } else {
                return "secondary";
            }
        },
    },
    mounted() {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        const isAdmin = userDetails.is_admin;
        this.isAdmin = isAdmin === 0 ? false : true;
        if (store.user.is_admin) {
            this.getAllOrders();
        }
        else {
            this.getOrders();
        }
    },
    watch: {
    }
}
</script>

<style scoped>
.table-caption {
    text-align: center;
    margin: 20px;
}

.table-container {
    margin: 20px;
}

.badge {
    --bs-badge-padding-x: 0.65em;
    --bs-badge-padding-y: 0.35em;
    --bs-badge-font-size: 0.75em;
    --bs-badge-font-weight: 700;
    --bs-badge-color: black;
    --bs-badge-border-radius: var(--bs-border-radius);
    display: inline-block;
    padding: var(--bs-badge-padding-y) var(--bs-badge-padding-x);
    font-size: var(--bs-badge-font-size);
    font-weight: var(--bs-badge-font-weight);
    line-height: 1;
    color: var(--bs-badge-color);
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: var(--bs-badge-border-radius);
}
</style>