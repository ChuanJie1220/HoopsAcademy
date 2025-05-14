<template>
    <div class="h-100">
        <!-- {{ productDetails.productName }}
{{ productDetails.productPrice }}
{{ productDetails.productCategory }} -->
        <div class="product-detail-wrapper">
            <b-container fluid class="h-100">
                <b-row class="h-100">
                    <!-- Left side with product image -->
                    <b-col md="6" class="align-content-center">
                        <b-carousel id="product-carousel" v-if="productImages.length" :interval="0" controls
                            :indicators="false" background="#ffffff" img-width="100%" img-height="300"
                            style="text-align: center;">
                            <b-carousel-slide v-for="(img, index) in productImages" :key="index"
                                :img-src="require(`@/assets/${img}`)" :alt="'Image ' + (index + 1)" />
                        </b-carousel>
                    </b-col>

                    <!-- Right side with product details -->
                    <b-col md="6" class="h-100">
                        <b-card class="h-100">
                            <b-card-title>
                                <h2>{{ productDetails.productBrand }} {{ productDetails.productName }}</h2>
                            </b-card-title>

                            <b-row>
                                <b-col>
                                    <article style="white-space: pre-line">
                                        {{ productDetails.productDescription }}
                                    </article>
                                </b-col>
                            </b-row>

                            <div class="spec">
                                <div class="d-flex flex-row justify-content-between">
                                    <h6>SPECIFICATIONS</h6>
                                    <h6>RM {{ formatPrice(productDetails.productPrice) }}</h6>
                                </div>


                                <b-row>
                                    <b-col>
                                        <b-table :items="specs" :fields="specFields" bordered small thead-class="d-none"
                                            responsive="sm" class="spec-table mt-2">
                                            <template #cell(key)="data">
                                                <strong>{{ data.value }}</strong>
                                            </template>
                                        </b-table>
                                    </b-col>
                                </b-row>
                            </div>

                            <b-form-group label="Available Choices">
                                <template v-if="cleanSizes.length">
                                    <b-button v-for="(variant, index) in cleanSizes" :key="index"
                                        variant="outline-secondary" class="size-button me-2 mb-2" :class="{
                                            active: selectedSize === variant.variant,
                                            'locked-variant': variant.quantity <= 0
                                        }" @click="handleSizeClick(variant)">
                                        {{ variant.variant }}
                                    </b-button>
                                </template>
                                <template v-else>
                                    <p class="text-danger mt-2">Out of Stock</p>
                                </template>
                            </b-form-group>

                            <!-- Quantity -->
                            <b-form-group label="Quantity">
                                <b-form-spinbutton :state="quantityErr" type="number" v-model="quantity" min="1" inline
                                    :disabled="!cleanSizes.length" />
                                <b-form-invalid-feedback>
                                    Amount exceeded {{ selectedSizeQuantity }}
                                </b-form-invalid-feedback>
                            </b-form-group>

                            <div class="add-to-cart">
                                <b-button @click="addToCart" variant="primary" :disabled="!cleanSizes.length">
                                    Add To Cart
                                </b-button>
                                <b-button variant="light" class="love-icon mr-2" @click.stop="addToFavourite"
                                    :class="{ 'text-danger': is_favourite }">
                                    <i class="bi bi-heart-fill me-2"></i>Favourite
                                </b-button>
                                <b-dropdown text="Share" variant="primary" class="mt-2">
                                    <b-dropdown-item @click="shareOn('whatsapp')"><i
                                            class="bi bi-whatsapp me-2"></i>WhatsApp</b-dropdown-item>
                                    <b-dropdown-item @click="copyLink()"><i class="bi bi-copy me-2"></i>Copy
                                        Link</b-dropdown-item>
                                </b-dropdown>
                            </div>
                        </b-card>
                    </b-col>
                </b-row>

            </b-container>
        </div>
    </div>
</template>

<script>
import store from "../store.js";
/* eslint-disable */
export default {
    name: "productDetails",
    components: {
    },
    computed: {
        cleanSizes() {
            try {
                const variants = typeof this.productDetails.productVariant === 'string'
                    ? JSON.parse(this.productDetails.productVariant)
                    : this.productDetails.productVariant;

                return Array.isArray(variants)
                    ? variants.filter(v => v.quantity >= 0)
                    : [];
            } catch {
                return [];
            }
        },
        selectedSizeQuantity() {
            const selected = this.cleanSizes.find(v => v.variant === this.selectedSize);
            return selected ? selected.quantity : 0;
        }

    },
    data: function () {
        return {
            id: '',
            productDetails: {
                productVariant: []
            },
            selectedSize: null,
            specs: [],
            specFields: [
                { key: 'key', label: '' },
                { key: 'value', label: '' }
            ],
            productImages: [],
            cartProduct: [],
            is_favourite: false,
            quantity: 1,
            quantityErr: null
        };
    },
    props: {
    },
    methods: {
        async getProductDetails() {
            try {
                const res = await this.$axios.get(`/products/${this.id}`);
                if (res.status === 200) {
                    this.productDetails = res.data;

                    if (typeof res.data.productInformation === 'string') {
                        try {
                            this.specs = Object.entries(JSON.parse(res.data.productInformation)).map(([key, value]) => ({
                                key,
                                value
                            }));
                        } catch (e) {
                            console.error("Error parsing productInformation:", e);
                        }
                    }

                    this.productImages = Array.isArray(res.data.productImage)
                        ? res.data.productImage
                        : [res.data.productImage];
                }
            } catch (err) {
                console.error("Failed to fetch product details:", err);
            }
        },
        formatPrice(value) {
            if (Number(value)) {
                return value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return '0.00';
        },
        async addToCart() {
            if (!store.isLogin) {
                console.log('store', store.isLogin)
                this.$showSuccess("warning", "Please login to use.");
                this.$router.push({ name: "loginPage" });
                this.$emit("openModal");
                return;
            }

            // Get the selected variant
            const variant = this.cleanSizes.find(v => v.variant === this.selectedSize);

            if (!variant) {
                this.$showSuccess("danger", "Please select a variant before adding to cart.");
                return;
            }

            console.log("User ID:", store.user?.id);
            const dataToPost = {
                userID: store.user.userID,
                productID: this.productDetails.productID,
                quantity: this.quantity,
                variant: variant,
            };

            try {
                const result = await this.$axios.post("/cart/add", dataToPost);
                this.$showSuccess("success", `${this.productDetails.productName} added to cart successfully`);
                console.log("Add to cart result", result);
            } catch (error) {
                console.error("Add to cart error", error);
                this.$showSuccess("danger", error.response?.data?.error || "Failed to add product to cart.");
            }
        },

        async addToFavourite() {
            if (store.isLogin) {
                this.is_favourite = !this.is_favourite;
                const dataToPost = {
                    productID: this.productDetails.productID,
                    userID: store.user.userID,
                    is_favourite: this.is_favourite ? 1 : 0,
                };

                try {
                    const result = await this.$axios.post("/addFavourite", dataToPost);
                    this.$showSuccess("success", this.is_favourite ? "Added to Favourites" : "Removed from Favourites");
                    console.log('favourite', result)
                } catch (error) {
                    this.$showSuccess("danger", "Failed to update favourite status.");
                    console.error("Add to favourite error:", error);
                }
            } else {
                this.$showSuccess("warning", "Please login to use.");
                this.$router.push({ name: "home" });
                this.$emit("openModal");
            }
        },
        async checkIsFavourite() {
            if (!store.isLogin) {
                this.is_favourite = false;
                return;
            }

            try {
                const result = await this.$axios.get(
                    `checkFavourite/${store.user.userID}/${this.id}`
                );
                console.log(result)
                this.is_favourite = result.data.is_favourite;
            } catch (error) {
                console.error("Failed to check favourite:", error);
                this.is_favourite = false;
            }
        },

        async share() {
            const shareData = {
                title: this.productDetails.productName,
                text: "Check out this awesome product!",
                url: window.location.href,
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                    console.log("Product shared successfully");
                } catch (err) {
                    console.error("Error sharing", err);
                }
            } else {
                // fallback
                this.copyLink();
            }
        },

        copyLink() {
            const productUrl = window.location.href;
            navigator.clipboard.writeText(productUrl)
                .then(() => {
                    this.$showSuccess("success", "Link copied to clipboard!");
                })
                .catch(() => {
                    this.$showSuccess("error", "Failed to copy the link.");
                });
        },

        shareOn(platform) {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent(this.productDetails.productName);
            let shareUrl = "";

            switch (platform) {
                case "whatsapp":
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
                default:
                    return;
            }

            window.open(shareUrl, "_blank");
        },

        handleSizeClick(variant) {
            if (variant.quantity > 0) {
                this.selectedSize = variant.variant;
            } else {
                // Optional: give visual feedback or show toast/toastify alert
                console.log(`${variant.variant} is out of stock`);
            }
        },
        autoSelectFirstAvailable() {
            const firstAvailable = this.cleanSizes.find(variant => variant.quantity > 0);
            if (firstAvailable) {
                this.selectedSize = firstAvailable.variant;
            }
        },

    },
    mounted() {
        this.id = this.$route.query.productId;
        this.getProductDetails()
        this.checkIsFavourite()
    },
    watch: {
        quantity(newVal) {
            this.quantityErr = newVal > this.selectedSizeQuantity ? false : null;
        },
        selectedSize() {
            // Reset quantity when size changes to avoid invalid state
            this.quantity = 1;
            this.quantityErr = null;
        },
        cleanSizes: {
            handler(newVal) {
                this.autoSelectFirstAvailable();
            },
            immediate: true
        }
    },

}
</script>

<style scoped>
.product-detail-wrapper {
    padding: 20px;
    height: 100%;
}

.img {
    background-color: white;
    border-radius: 40px;
    padding: 30px;
    max-height: 400px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}

.carousel-indicators li {
    text-indent: -999px;
    /* this hides the number, shows just the dot */
}

#product-carousel .carousel-control-prev-icon,
#product-carousel .carousel-control-next-icon {
    background-color: black;
    /* Change to your preferred color */
    border-radius: 50%;
    background-size: 60% 60%;
    width: 3rem;
    height: 3rem;
    filter: invert(1);
}

b-col.md-6.border {
    display: flex;
    align-items: center;
    justify-content: center;
}

b-card-title h2 {
    font-weight: 800;
    font-size: 24px;
}

b-card-text h4 {
    font-size: 20px;
    font-weight: bold;
}

.spec-box {
    background-color: #e6f0ff;
    padding: 15px;
    margin-top: 10px;
    font-size: 14px;
    border-radius: 8px;
}

.add-to-cart {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.spec-table {
    background-color: #f0f8ff;
    border-radius: 8px;
    overflow: hidden;
}

.spec-table td,
.spec-table th {
    padding: 8px 12px;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.btn-check:checked+.btn,
:not(.btn-check)+.btn:active,
.btn:first-child:active,
.btn.active,
.btn.show {
    background-color: black;
}

.locked-variant {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: auto;
}

.carousel-control-prev-icon,
::v-deep .carousel-control-prev-icon,
::v-deep .carousel-control-next-icon {
    background-color: black;
    /* Change this to your desired color */
    border-radius: 50%;
    padding: 10px;
}
</style>