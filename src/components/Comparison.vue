<template>
    <div class="container mt-4">
        <div class="d-flex justify-content-between">
            <h2 class="mb-4">Product Comparison</h2>
            <b-button variant="dark" class="d-inline-flex align-items-center" @click="goToProductPage">
                Browse Product
                <b-icon icon="arrow-right" class="ms-2"></b-icon>
            </b-button>
        </div>

        <!-- Category Selector -->
        <div class="btn-group mb-3" role="group">
            <button v-for="cat in categories" :key="cat" class="btn"
                :class="selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'" @click="selectCategory(cat)">
                {{ cat }}
            </button>
        </div>

        <!-- Product Selection Dropdowns -->
        <div v-if="products.length" class="row mb-4">
            <div class="col-md-4" v-for="(product, index) in selectedProducts" :key="index">
                <label>Select Product {{ index + 1 }}</label>
                <select class="form-select" v-model="selectedProducts[index]" @change="updateCompareList">
                    <option :value="null">-- Select a Product --</option>
                    <option v-for="p in availableProducts(index)" :key="p.productID" :value="p">
                        {{ p.productName }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Comparison Table -->
        <div v-if="compareList.length >= 2" class="mt-1">
            <h4>Compare Products</h4>
            <div class="table-responsive">
                <table class="table table-bordered table-fixed">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th v-for="p in compareList" :key="p.productID">{{ p.productName }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Image</td>
                            <td v-for="p in compareList" :key="p.productID">
                                <img v-if="Array.isArray(parseImages(p.productImage)) && parseImages(p.productImage).length"
                                    :src="require(`@/assets/${parseImages(p.productImage)[0]}`)" alt="Product Image"
                                    class="img-fluid" style="max-width: 100px;">
                            </td>
                        </tr>
                        <tr>
                            <td>Brand</td>
                            <td v-for="p in compareList" :key="p.productID">{{ p.productBrand }}</td>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td v-for="p in compareList" :key="p.productID">RM {{ p.productPrice }}</td>
                        </tr>
                        <!-- <tr>
                            <td>Description</td>
                            <td v-for="p in compareList" :key="p.productID">{{ p.productDescription }}</td>
                        </tr> -->
                        <tr>
                            <td>Information</td>
                            <td v-for="p in compareList" :key="p.productID">
                                <ul v-if="p.productInformation">
                                    <li v-for="(value, key) in parseProductInformation(p.productInformation)"
                                        :key="key">
                                        <strong>{{ key }}:</strong> {{ value }}
                                    </li>
                                </ul>
                                <span v-else>No information available</span>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
/* eslint-disable */
export default {
    name: "comparison",
    components: {
    },
    computed: {
        type() {
            return this.$route.query.categories;
        },
    },
    data: function () {
        return {
            categories: ['Accessories', 'Apparel', 'Bags', 'Footwear', 'Racquet'],
            selectedCategory: null,
            products: [],
            selectedProducts: [null, null, null],
            compareList: [],
        };
    },
    props: {
    },
    methods: {
        goToProductPage() {
            this.$router.push(`/allproducts`);
        },
        async selectCategory(category) {
            this.selectedCategory = category;
            this.compareList = [];
            this.selectedProducts = [null, null, null];
            await this.getProducts();
        },
        async getProducts() {
            try {
                if (!this.selectedCategory) {
                    this.products = [];
                    return;
                }
                const res = await axios.get(`products`, {
                    params: {
                        categories: this.selectedCategory,
                    },
                });
                if (res.status === 200) {
                    this.products = res.data;
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        updateCompareList() {
            // Remove duplicates and nulls
            this.compareList = this.selectedProducts.filter(
                (p, idx, self) => p && self.findIndex(x => x?.productID === p.productID) === idx
            );
        },
        availableProducts(currentIndex) {
            const selectedIds = this.selectedProducts
                .filter((p, idx) => p && idx !== currentIndex)
                .map(p => p.productID);
            return this.products.filter(p => !selectedIds.includes(p.productID));
        },
        parseImages(imageData) {
            try {
                // Check if the data is a string and try to parse it
                const parsed = typeof imageData === 'string' ? JSON.parse(imageData) : imageData;

                // Ensure the parsed data is an array of strings (URLs)
                if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                    return parsed;
                } else {
                    console.error('Parsed image data is not an array of strings.');
                    return [];
                }
            } catch (error) {
                console.error('Failed to parse productImage:', error);
                return [];
            }
        },
        parseProductInformation(productInformation) {
            try {
                if (typeof productInformation === 'string') {
                    let parsed = JSON.parse(productInformation);

                    if (typeof parsed === 'string') {
                        parsed = JSON.parse(parsed);
                    }

                    return parsed;
                } else if (typeof productInformation === 'object') {
                    return productInformation;
                }
                return {};
            } catch (error) {
                console.error('Failed to parse productInformation:', error);
                return {};
            }
        }

    },
    mounted() {
        if (this.type) {
            this.selectedCategory = this.type;
            this.getProducts();
        }
    },
    watch: {
        type() {
            this.selectedCategory = this.type;
            this.getProducts();
        }
    }
}
</script>

<style scoped>
select.form-select {
    min-width: 100%;
}

.table-fixed {
    width: 100%;
}

.table-fixed th,
.table-fixed td {
    width: max-content;
}
</style>