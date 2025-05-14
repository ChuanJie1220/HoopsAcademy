<template>
    <div style="padding:30px">
        <h3>Checkout</h3>

        <div class="summary-block mb-4 border-bottom">
            <div class="summary-header d-flex flex-row justify-content-between align-items-center"
                @click="toggleSummary">
                <h5 class="fw-bold mb-3">Order Summary</h5>
                <i class="fa fa-chevron-down" :class="{ 'rotate-up': summaryOpen, 'rotate-down': !summaryOpen }"></i>
            </div>

            <div v-if="summaryOpen" class="order-content mt-3">
                <div v-for="item in carts" :key="item.cartID" class="d-flex border-bottom py-2">
                    <img :src="require(`@/assets/${parseImages(item.pImage)[0]}`)" alt="" class="me-3"
                        style="width: 80px; height: auto;" />
                    <div class="w-100">
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>{{ item.pName }}</strong>
                                <div class="text-muted small">Size: {{ item.variant.variant }}</div>
                                <div class="text-muted small">Qty: {{ item.cQuantity }}</div>
                            </div>
                            <div class="text-end">
                                <strong>RM {{ item.pPrice }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-row justify-content-between">
                    <span>Estimated Delivery and Handling Fee</span>
                    <span>RM {{ shippingFee }}</span>
                </div>
                <div class="d-flex flex-row justify-content-between">
                    <span>Total Price</span>
                    <span>RM {{ price }}</span>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-between fw-bold mt-3">
                <span>Subtotal</span>
                <span>RM {{ total }}</span>
            </div>
        </div>

        <div class="bg-light p-4 shadow-sm mt-4">
            <b-form @submit.prevent="createOrder">
                <div class="d-flex flex-column gap-4">
                    <div class="d-flex flex-column gap-3">
                        <h3>Personal information</h3>
                        <div class="d-flex flex-row justify-content-between">
                            <span>Name</span>
                            <b-form-input type="text" style="width: 40%" v-model="name" required
                                placeholder="Enter your name" />
                        </div>

                        <div class="d-flex flex-row justify-content-between">
                            <span>Email Address</span>
                            <b-form-input type="email" style="width: 40%" v-model="userEmail" required
                                placeholder="Enter your email" />
                        </div>

                        <div class="d-flex flex-row justify-content-between">
                            <span>Phone Number</span>
                            <b-form-input type="text" style="width: 40%" v-model="phoneNo" required
                                placeholder="Enter your phone number" />
                        </div>
                    </div>

                    <hr style="margin: 0px; border-color: black;">

                    <div class="d-flex flex-column gap-3">
                        <h3>Shipping</h3>
                        <div class="d-flex flex-row justify-content-between">
                            <span>Shipping Address </span>
                            <b-form-textarea style="width:40%" id="address" v-model="shippingAddress" rows="3"
                                required />
                        </div>

                        <div class="d-flex flex-row justify-content-between">
                            <span>Shipping Option</span>
                            <b-form-select id="shippingOption" v-model="selectedShipping" :options="shippingOptions"
                                required />
                        </div>

                        <div class="d-flex flex-row justify-content-between">
                            <span>Estimated Arrival Date</span>
                            <span>{{ estimatedArrival }}</span>
                        </div>
                    </div>

                    <hr style="margin: 0px; border-color: black;">

                    <div class="d-flex flex-column gap-3">
                        <h3>Payment</h3>
                        <p><strong>How would you like to pay?</strong></p>
                        <div v-for="option in paymentOptions" :key="option.value" class="payment-option"
                            :class="{ selected: paymentMethod === option.value }" @click="paymentMethod = option.value">
                            <img :src="require(`@/assets/${option.icon}`)" class="payment-icon" />
                            <span> {{ option.text }}</span>
                            <i v-if="paymentMethod === option.value" class="fa fa-check ms-auto text-success"></i>
                        </div>
                    </div>

                    <b-button variant="dark" type="submit" block>Proceed to Payment</b-button>
                </div>
            </b-form>
        </div>
    </div>
</template>


<script>
/* eslint-disable */
export default {
    name: "checkout",
    components: {
    },
    computed: {
        price() {
            return this.carts.reduce((acc, item) => acc + item.cQuantity * item.pPrice, 0).toFixed(2);
        },
        shippingFee() {
            return this.selectedShipping === 'express' ? 15.0 : 7.0;
        },
        total() {
            const subtotalValue = parseFloat(
                this.carts.reduce((acc, product) => acc + product.cQuantity * product.pPrice, 0)
            );
            return (subtotalValue + this.shippingFee).toFixed(2); 
        },
        estimatedArrival() {
            const today = new Date();
            const minDays = this.selectedShipping === 'express' ? 4 : 5;
            const maxDays = this.selectedShipping === 'express' ? 6 : 9;

            const minDate = new Date(today);
            minDate.setDate(today.getDate() + minDays);

            const maxDate = new Date(today);
            maxDate.setDate(today.getDate() + maxDays);

            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return `${minDate.toLocaleDateString(undefined, options)} - ${maxDate.toLocaleDateString(undefined, options)}`;
        }
    },
    data: function () {
        return {
            carts: [],
            summaryOpen: false,
            shippingAddress: '',
            selectedShipping: 'standard',
            shippingOptions: [
                { value: 'standard', text: 'Standard ' },
                { value: 'express', text: 'Express ' }
            ],
            userEmail: '',
            paymentOptions: [
                { text: "Credit or Debit Card", value: "Credit / Debit Card", icon: "credit-card.png" },
                { text: "FPX Online Banking", value: "FPX", icon: "fpx.png" },
            ],
            paymentMethod: '',
            phoneNo: '',
            name: '',
        };
    },
    props: {
    },
    methods: {
        async getCartList() {
            const storedUser = JSON.parse(localStorage.getItem('user'));

            try {
                if (storedUser && storedUser.userID) {
                    const userID = storedUser.userID;
                    const res = await this.$axios.get(`/cart/${userID}`);
                    if (res.status === 200 && res.data.cart_items) {
                        console.log(res)
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
        parseImages(imageData) {
            try {
                return typeof imageData === 'string' ? JSON.parse(imageData) : imageData;
            } catch (error) {
                console.error('Failed to parse productImage:', error);
                return [];
            }
        },
        toggleSummary() {
            this.summaryOpen = !this.summaryOpen;
        },
        loadUser() {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.email && !this.userEmail) {
                this.userEmail = storedUser.email;
            }
            if (storedUser.phoneNo && !this.phoneNo) {
                this.phoneNo = storedUser.phoneNo;
            }
            if (storedUser.name && !this.name) {
                this.name = storedUser.name;
            }
        },
        async createOrder() {
            if (!this.shippingAddress.trim()) {
                this.$bvToast.toast('Please enter a shipping address.', {
                    title: 'Missing Address',
                    variant: 'danger',
                    solid: true,
                    noAutoHide: true,
                });
                return;
            }
            if (!this.userEmail.trim()) {
                this.$bvToast.toast('Please enter a valid email address.', {
                    title: 'Missing Email',
                    variant: 'danger',
                    solid: true,
                    noAutoHide: true
                });
                return;
            }
            if (!/^\d{9,15}$/.test(this.phoneNo)) {
                this.$bvToast.toast('Please enter a valid phone number.', {
                    title: 'Invalid Phone Number',
                    variant: 'danger',
                    solid: true,
                    noAutoHide: true
                });
                return;
            }
            if (!this.paymentMethod) {
                this.$bvToast.toast('Please select a payment method.', {
                    title: 'Payment Method Required',
                    variant: 'danger',
                    solid: true,
                    noAutoHide: true
                });
                return;
            }

            const store = JSON.parse(localStorage.getItem('user'));
            console.log("User ID:", store.user);
            try {
                console.log('carts', this.carts)
                const productArray = this.carts.map((item, index) => {
                    return (
                        {
                            productID: item.pID,
                            quantity: item.cQuantity
                        }
                    )
                })

                let dataToPost = {
                    userID: store.userID,
                    products: productArray,
                    shipping_option: this.selectedShipping === 'express' ? 'Express' : 'Standard',
                    delivery_address: this.shippingAddress,
                    email_address: this.userEmail,
                    payment_method: this.paymentMethod,
                };

                let result = await this.$axios.post('order/create', dataToPost);

                if (result.status === 201) { // Fixed here
                    for (let items of this.carts) {
                        await this.$axios.post('cart/delete/' + items.cartID).catch(error => {
                            console.error('Error deleting cart item', error);
                        });
                    }
                    this.$router.push({ name: 'paymentPage', params: { payment_method: this.paymentMethod, total: this.total } });
                }

            } catch (error) {
                if (error.response && error.response.status === 422) {
                    this.errors = error.response.data.errors;
                    this.checkInputError();
                }
                console.error('Error in create Order', error);
            }

            console.log('Orders', this.carts);
        }
    },

    async mounted() {
        await this.getCartList();
        this.loadUser();
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
    watch: {
    }
}
</script>

<style scoped>
.summary-header {
    cursor: pointer;
    font-weight: bold;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.rotate-up {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}

.rotate-down {
    transform: rotate(0deg);
    transition: transform 0.3s ease;
}

.order-content {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.order-content img {
    border-radius: 5px;
}

.bg-light {
    border-radius: 10px;
    background-color: #f7f7f7 !important;
}

h3,
h5 {
    font-weight: 600;
}

p,
span {
    font-size: 16px;
}

hr {
    border-color: #ddd;
}

.b-form-group label {
    font-weight: 500;
}

.b-button {
    margin-top: 10px;
}

.shadow-sm {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05) !important;
}

.summary-block {
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.text-muted {
    color: #6c757d !important;
}

.fw-bold {
    font-weight: 600;
}

.payment-icon {
    width: 50px;
    height: 50px;
    object-fit: contain;
    /* or 'cover' if you want to fill the box */
    margin-right: 12px;
}

.payment-option {
    display: flex;
    align-items: center;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
}

.payment-option:hover {
    border-color: #999;
}

.payment-option.selected {
    border-color: #28a745;
}
</style>