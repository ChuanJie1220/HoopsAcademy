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
            <b-table-simple hover caption-top responsive>
                <caption>
                    <h2 class="table-caption">User Management</h2>
                </caption>
                <b-thead>
                    <b-tr>
                        <b-th>No</b-th>
                        <b-th>Username</b-th>
                        <b-th>Email</b-th>
                        <b-th>Phone No.</b-th>
                        <b-th>Gender</b-th>
                        <b-th>Role</b-th>
                        <b-th></b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <b-tr v-for="(user, index) in users" :key="index">
                        <b-td>{{ index + 1 }}</b-td>
                        <b-td>{{ user.username }}</b-td>
                        <b-td>{{ user.email }}</b-td>
                        <b-td>{{ user.phoneNo }}</b-td>
                        <b-td>{{ user.gender }}</b-td>
                        <b-td>
                            <b-dropdown :text="user.is_admin ? 'Admin' : 'User'" class="m-2"
                                :variant="calculateBadgeVariant(user.is_admin ? 'Admin' : 'User')">
                                <b-dropdown-item @click="updateRole(user.userID, '1')">Admin</b-dropdown-item>
                                <b-dropdown-item @click="updateRole(user.userID, '0')">User</b-dropdown-item>
                            </b-dropdown>
                        </b-td>

                        <b-td>
                            <b-button variant="danger" class="m-2"
                                @click="deleteUser(user.userID, user.username)">Delete</b-button>
                        </b-td>
                    </b-tr>
                </b-tbody>
            </b-table-simple>
            <div v-if="users.length === 0">
                <h3>No Users Yet</h3>
            </div>
        </div>
    </div>
</template>

<script>
import store from "../store.js";
/* eslint-disable */
export default {
    name: "userManagement",
    components: {
    },
    computed: {
    },
    data: function () {
        return {
            users: [],
            role: "",
        };
    },
    props: {
    },
    methods: {
        async getAllUsers() {
            if (store.isLogin === false && store.user.is_admin) {
                this.$showSuccess("warning", "Please login to use.");
                this.$router.push({ name: "home" });
                this.$emit("openModal");
            } else {
                console.log("UserID from store", store.user.userID);
                let result = await this.$axios.get("user-all/" + store.user.userID);
                console.log("res", result)
                this.users = result.data;
            }
        },
        async deleteUser(userID, username) {
            let deleting = await this.$showAlert(
                "warning",
                "Delete User",
                `Are you sure you want to delete <b>${username}</b>?`,
                [
                    { text: "Delete", textColor: "white", color: "red" },
                    { text: "Cancel", textColor: "black", color: "lightgray" },
                ]
            );
            if (deleting) {
                let result = await this.$axios.post("user/delete/" + userID);
                if (result.status === 200) {
                    this.$showSuccess(
                        "success",
                        "User Deleted",
                        `Successfully deleted <b>${username}</b>`
                    );
                    this.$nextTick(async () => {
                        await this.getAllUsers();
                    });
                } else {
                    this.$showSuccess(
                        "error",
                        "Error Deleted User",
                        result.response.data
                    );
                }
            }
        },
        async updateRole(id, role) {
            let dataToPost = {
                user_id: id,
                role: role,
            };
            console.log(dataToPost);
            let result = await this.$axios.post("user/update-role", dataToPost);
            this.getAllUsers();
        },
        calculateBadgeVariant(role) {
            if (role === "Admin") {
                return "info";
            } else {
                return "secondary";
            }
        },
    },
    mounted() {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        const isAdmin = userDetails.is_admin;
        this.isAdmin = isAdmin === 0 ? false : true;
        this.getAllUsers();
    },
    watch: {
    }
}
</script>

<style scoped>
.table-container {
    margin: 20px;
}

.table-caption {
    text-align: center;
    margin: 20px;
}

.table-checkout {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-end;
    align-items: flex-end;
    margin-top: 30px;
}
</style>