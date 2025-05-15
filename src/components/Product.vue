<template>
    <b-container fluid>
        <!-- Product Cards -->
        <b-row>
            <b-col v-for="(product, index) in paginatedProducts" :key="index" cols="12" md="6" lg="4">
                <b-card class="product-card text-center" @click="getDetails(product.productID)">
                    <!-- Product Image Carousel -->
                    <div class="image-wrapper">
                        <img v-if="Array.isArray(parseImages(product.productImage)) && parseImages(product.productImage).length"
                            :src="require(`@/assets/${parseImages(product.productImage)[0]}`)" alt="Product image"
                            class="product-image" />
                    </div>

                    <!-- Product Details -->
                    <b-card-body>
                        <h6 class="card-title">{{ product.productBrand }} {{ product.productName }} </h6>

                        <h5 class="text-dark fw-bold">
                            RM{{ formatPrice(product.productPrice) }}
                        </h5>
                    </b-card-body>

                    <div class="d-flex flex-row justify-content-end gap-2" v-if="isAdmin">
                        <b-button @click="editProduct(product.productID)" variant="secondary"
                            class="me-2 button">Edit</b-button>
                        <b-button @click.stop="deleteProduct(product.productName, product.productID)" variant="danger"
                            class="me-2 button">Delete</b-button>
                    </div>
                </b-card>
            </b-col>
        </b-row>

        <!-- Pagination -->
        <b-row>
            <b-col>
                <b-pagination v-model="currentPage" :total-rows="products.length" :per-page="perPage" align="center"
                    class="my-4" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'productCard',
    components: {},
    props: ['searchInput'],
    data() {
        return {
            hoveredIndex: null,
            products: [],
            currentPage: 1,
            // search: this.searchInput,
            // type: '',
            perPage: 3,
            isAdmin: false,
        };
    },
    methods: {
        formatPrice(value) {
            if (Number(value)) {
                return value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return '0.00';
        },
        getDetails(id) {
            this.$router.push(`details?productId=${id}`);
        },
        parseImages(imageData) {
            try {
                return typeof imageData === 'string' ? JSON.parse(imageData) : imageData;
            } catch (error) {
                console.error('Failed to parse productImage:', error);
                return [];
            }
        },
        async getProductList() {
            const res = await this.$axios.get('products', {
                params: {
                    categories: this?.type ? this.type : null,
                    brands: this?.brand ? this.brand : null
                }
            });
            if (res.status === 200) {
                this.products = res.data;
            }
        },
        editProduct(id) {
            this.$router.push({ name: "productManagement", params: { id } });
            console.log("Edit Product");
        },
        async deleteProduct(name, id) {
            let deleting = await this.$showAlert(
                "warning",
                "Delete Product",
                `Are you sure you want to delete <b>${name}</b>?`,
                [
                    { text: "Delete", textColor: "white", color: "red" },
                    { text: "Cancel", textColor: "black", color: "lightgray" },
                ]
            );
            if (deleting) {
                let result = await this.$axios.post(
                    "/products/delete/" + id
                );
                if (result.status === 200) {
                    this.$showSuccess(
                        "success",
                        "Product Deleted",
                        `Successfully deleted <b>${name}</b>`
                    );
                    this.$nextTick(async () => {
                        await this.getProductList();
                    });
                }
            }
        },

    },
    computed: {
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.products.slice(start, end);
        },
        type() {
            return this.$route.query.categories;
        },
        brand() {
            return this.$route.query.brands;
        }
    },
    mounted() {
        console.log('type', this.$route.query.categories)
        this.type = this.$route.query.categories;
        this.brand = this.$route.query.brands;
        const userDetails = JSON.parse(localStorage.getItem('user'));
        this.getProductList();
        const isAdmin = userDetails.is_admin;
        this.isAdmin = isAdmin === 0 ? false : true;
    },
    watch: {
        type() {
            this.getProductList();
        },
        brand() {
            this.getProductList();
        }
    }
};
</script>

<style scoped>
.product-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px;
}

.image-wrapper {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.product-image {
    object-fit: contain;
    height: 100%;
    width: 100%;
    transition: 0.3s ease-in-out;
}

</style>
