<template>
    <div class="shopping-cart container py-5">
        <div v-if="isLoading" class="text-center py-5">
            <b-spinner label="Loading..."></b-spinner>
        </div>

        <div v-else-if="carts.length === 0" class="text-center">
            <h2 class="fw-bold mb-3">YOUR CART IS EMPTY</h2>
            <p class="mb-4">
                Once you add something to your cart – it will appear here. Ready to get started?
            </p>
            <b-button variant="dark" class="d-inline-flex align-items-center" @click="goToProductPage">
                GET STARTED
                <b-icon icon="arrow-right" class="ms-2"></b-icon>
            </b-button>
        </div>

        <div v-else class="row">
            <!-- Left: Product Details -->
            <div class="col-md-7">
                <h4>Shopping Cart</h4>
                <div v-for="item in carts" :key="item.cartID" class="d-flex border-bottom py-3">
                    <img :src="require(`@/assets/${parseImages(item.pImage)[0]}`)" alt="" class="me-3"
                        @click="goToProducts(item.pID)" style="width: 120px; height: auto;" />
                    <div class="w-100">
                        <div class="d-flex flex-row justify-content-between">
                            <h5 class="mb-1">{{ item.pName }}</h5>
                            <div class="text big">RM {{ item.pPrice }}</div>
                        </div>
                        <div>
                            <div class="text big">Size {{ item.variant.variant }}</div>
                        </div>
                        <b-form-group label="Quantity">
                            <b-form-spinbutton v-model="item.cQuantity" :min="1" @change="updateCartQuantity(item)"
                                :state="item.cQuantity > item.variant.quantity ? false : null" inline />
                            <b-form-invalid-feedback v-if="item.cQuantity > item.variant.quantity">
                                Amount exceeded. Only {{ item.variant.quantity }} available.
                            </b-form-invalid-feedback>
                        </b-form-group>
                        <a href="#" class="text-danger small" @click.prevent="deleteItem(item.cartID, item)">Remove from
                            cart</a>
                    </div>
                </div>
            </div>

            <!-- Right: Summary Box -->
            <div class="col-md-5">
                <div class="bg-light p-4 shadow-sm">
                    <h5 class="fw-bold mb-3">Order Summary</h5>
                    <div class="d-flex justify-content-between">
                        <span>Subtotal</span>
                        <span>RM {{ total }}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>Estimated Delivery and Handling</span>
                        <span>Free</span>
                    </div>
                    <hr />
                    <div class="d-flex justify-content-between fw-bold mb-3">
                        <span>Total</span>
                        <span>RM {{ total }}</span>
                    </div>
                    <b-button variant="dark" block @click="checkout">Checkout</b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import Swal from 'sweetalert2';

export default {
    name: "cart",
    components: {},
    computed: {
        total() {
            console.log('price', this.carts.reduce((acc, product) => acc + product.cQuantity * product.pPrice, 0))
            return parseFloat(
                this.carts.reduce((acc, product) => acc + product.cQuantity * product.pPrice, 0)
            ).toFixed(2);
        },
    },
    data: function () {
        return {
            carts: [],
            selectedSize: null,
            quantityErr: null,
            isLoading: true
        };
    },
    props: {},
    methods: {
        goToProductPage() {
            this.$router.push(`/allproducts`);
        },
        goToProducts(id) {
            this.$router.push(`/details?productId=${id}`);
        },
        removeItem(index) {
            this.carts.splice(index, 1);
        },
        parseImages(imageData) {
            try {
                return typeof imageData === 'string' ? JSON.parse(imageData) : imageData;
            } catch (error) {
                console.error('Failed to parse productImage:', error);
                return [];
            }
        },
        async getCartList() {
            const storedUser = JSON.parse(localStorage.getItem('user'));

            try {
                if (storedUser && storedUser.userID) {
                    const userID = storedUser.userID;
                    const res = await this.$axios.get(`/cart/${userID}`);
                    if (res.status === 200 && res.data.cart_items) {
                        this.carts = res.data.cart_items;
                    } else {
                        this.carts = [];
                    }
                } else {
                    console.warn('User not logged in or no userID');
                    this.carts = [];
                }
            } catch (err) {
                console.error('Error fetching cart:', err);
                this.carts = [];
            } finally {
                this.isLoading = false;
            }
        },

        deleteItem(cartID, item) {
            Swal.fire({
                title: 'Remove Item',
                text: `Do you want to remove "${item.pName}" from the cart?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$axios
                        .post(`/cart/delete/${cartID}`)
                        .then((res) => {
                            this.carts = this.carts.filter((i) => i.cartID !== cartID);
                            Swal.fire('Removed!', `"${item.pName}" has been removed from the cart.`, 'success');
                        })
                        .catch((error) => {
                            Swal.fire('Error!', `Failed to delete "${item.pName}" from cart.`, 'error');
                            console.error(error);
                        });
                }
            });
        },
        checkout() {
            this.$router.push(`/checkout`);
        },
        
        async updateCartQuantity(item) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser.userID) {
            console.warn('User not logged in');
            return;
        }

        try {
            const payload = {
                userID: storedUser.userID,
                productID: item.pID,
                quantity: item.cQuantity,
                variant: item.variant,
            };

            const response = await this.$axios.post('/cart/update', payload);

            if (response.status === 200) {
                console.log('Quantity updated:', response.data);
                // Optional: show success toast
                this.$bvToast.toast('Quantity updated successfully!', {
                    title: 'Success',
                    variant: 'success',
                    solid: true,
                });
            }
        } catch (error) {
            console.error('Failed to update quantity', error);
            this.$bvToast.toast('Failed to update quantity', {
                title: 'Error',
                variant: 'danger',
                solid: true,
            });
        }
    },
    },
    async mounted() {
        await this.getCartList();
        this.carts.forEach(item => {
            if (typeof item.variant === 'string') {
                try {
                    item.variant = JSON.parse(item.variant);
                } catch {
                    item.variant = [];
                }
            }
        });
    },
    watch: {},
};
</script>

<style scoped>
.shopping-cart h2 {
    font-weight: 800;
}
</style>