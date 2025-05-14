<template>
    <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between p-4">
            <div class="search-container">
                <!-- Search Bar -->
                <b-form class="search-form">
                    <b-form-input type=text v-model.trim="searchQuery" class="search"
                        placeholder="Search..."></b-form-input>
                </b-form>
            </div>
            <div class="d-flex flex-row gap-2">
                <div v-if="isAdmin">
                    <b-button class="create-btn" @click="addProduct">
                        Create Product
                        <b-icon icon="plus-square"></b-icon>
                    </b-button>
                </div>

                <div class="filter">
                    <!-- Filter Button -->
                    <button class="filter-btn" @click="showFilters = true">
                        Filter & Sort <img src="@/assets/filterIcon.png" alt="Filter Icon" width="30px">
                    </button>
                </div>
            </div>
        </div>

        <div class="main-content">
            <b-container fluid>
                <!-- Product Cards -->
                <b-row>
                    <b-col v-for="(product, index) in paginatedProducts" :key="index" cols="12" md="6" lg="4">
                        <b-card class="product-card text-center" @click="getDetails(product.productID)">
                            <!-- Product Image Carousel -->
                            <div class="image-wrapper">
                                <img v-if="Array.isArray(parseImages(product.productImage)) && parseImages(product.productImage).length"
                                    :src="require(`@/assets/${parseImages(product.productImage)[0]}`)"
                                    alt="Product image" class="product-image" />
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
                        <b-pagination v-model="currentPage" :total-rows="products.length" :per-page="perPage"
                            align="center" class="my-4" />
                    </b-col>
                </b-row>
            </b-container>
        </div>

        <!-- Filter Modal -->
        <div class="filter-sidebar" :class="{ 'open': showFilters }">
            <div class="filter-header">
                <h3>Filter & Sort</h3>
                <span @click="showFilters = false" class="close-btn">✕</span>
            </div>

            <div class="filter-body">
                <!-- Selected Filters (Excluding Sort By) -->
                <div class="appliedFilters" v-if="selectedFilters.length">
                    <p class="appliedTitle">Applied Filters</p>
                    <div class="filterSet">
                        <div v-for="(filter, index) in selectedFilters" :key="index" class="filter-item">
                            <span>{{ filter.label }}</span>
                            <button @click="removeFilter(filter.value)">✕</button>
                        </div>
                    </div>
                </div>

                <hr>

                <!-- Sort Options (Applies Immediately) -->
                <div class="filter-block">
                    <!-- Sort By Section -->
                    <div class="filter-header" @click="toggleDropdown('sort')">
                        <p class="filter-title">SORT BY</p>
                        <i class="fa fa-chevron-down" :class="dropdowns.sort ? 'rotate-up' : 'rotate-down'"></i>
                    </div>

                    <!-- Dropdown Options -->
                    <div v-if="dropdowns.sort" class="filter-content">
                        <label v-for="option in sortOptions" :key="option.value" class="filter-option">
                            <input type="radio" v-model="sortBy" :value="option.value" @change="applySort">
                            {{ option.label }}
                        </label>
                    </div>
                </div>

                <hr>

                <!-- Categories -->
                <div class="filter-block">
                    <div class="filter-header" @click="toggleDropdown('category')">
                        <p>Categories</p>
                        <i class="fa fa-chevron-down" :class="dropdowns.category ? 'rotate-up' : 'rotate-down'"></i>
                    </div>
                    <div v-if="dropdowns.category" class="filter-content">
                        <label v-for="category in categories" :key="category.value">
                            <input type="checkbox" v-model="tempCategories" :value="category.value"
                                @change="updateSelectedFilters">
                            {{ category.label }}
                        </label>
                    </div>
                </div>

                <hr>

                <!-- Brands -->
                <div class="filter-block">
                    <div class="filter-header" @click="toggleDropdown('brand')">
                        <p>Brands</p>
                        <i class="fa fa-chevron-down" :class="dropdowns.brand ? 'rotate-up' : 'rotate-down'"></i>
                    </div>
                    <div v-if="dropdowns.brand" class="filter-content">
                        <label v-for="brand in brands" :key="brand.value">
                            <input type="checkbox" v-model="tempBrands" :value="brand.value"
                                @change="updateSelectedFilters">
                            {{ brand.label }}
                        </label>
                    </div>
                </div>

                <hr>

                <!-- Price (Only One Selection) -->
                <div class="filter-block">
                    <div class="filter-header" @click="toggleDropdown('price')">
                        <p>Price</p>
                        <i class="fa fa-chevron-down" :class="dropdowns.price ? 'rotate-up' : 'rotate-down'"></i>
                    </div>
                    <div v-if="dropdowns.price" class="filter-content">
                        <label v-for="price in priceRanges" :key="price.value">
                            <input type="radio" v-model="tempPrice" :value="price.value"
                                @change="updateSelectedFilters">
                            {{ price.label }}
                        </label>
                    </div>
                </div>

                <hr>

                <!-- Apply Filters Button -->
                <div class="d-flex justify-content-between mt-3">
                    <button class="btn btn-secondary" @click="resetFilters">Reset</button>
                    <button class="btn btn-secondary" @click="applyFilters">Apply Filters</button>
                </div>
            </div>
        </div>
        <div v-if="showFilters" class="overlay" @click="closeOnOverlay"></div>
    </div>
</template>

<script>

export default {
    name: "productPage",
    data() {
        return {
            isAdmin: false,
            searchQuery: "",
            showFilters: false,
            // Track the dropdown states for each section
            dropdowns: {
                sort: false,
                category: false,
                brand: false,
                price: false
            },
            displayedProducts: [],
            selectedFilters: [],
            tempCategories: [],
            tempBrands: [],
            tempPrice: null,
            tempSortBy: 'default',
            // Active values used for actual filtering
            activeCategories: [],
            activeBrands: [],
            activePrice: null,
            activeSortBy: 'default',
            sortBy: "default",
            sortOptions: [
                { label: "Default", value: "default" },
                { label: "Name (A - Z)", value: "name_asc" },
                { label: "Name (Z - A)", value: "name_desc" },
                { label: "Price (Low > High)", value: "price_asc" },
                { label: "Price (High > Low)", value: "price_desc" },
                { label: "Latest Date", value: "latest" }
            ],
            categories: [
                { label: "Accessories", value: "accessories" },
                { label: "Apparel", value: "apparel" },
                { label: "Bag", value: "bags" },
                { label: "Footwear", value: "footwear" },
                { label: "Racquet", value: "racquet" }
            ],
            brands: [
                { label: "Nike", value: "nike" },
                { label: "Adidas", value: "adidas" },
                { label: "Yonex", value: "yonex" },
                { label: "Li-Ning", value: "li-ning" }
            ],
            priceRanges: [
                { label: "RM0 - RM99.99", value: "0_100" },
                { label: "RM100 - RM499.99", value: "100_500" },
                { label: "RM500 - RM999.99", value: "500_1000" },
                { label: "RM1000 - Onwards", value: "1000+" }
            ],

            hoveredIndex: null,
            products: [],
            currentPage: 1,
            // search: this.searchInput,
            // type: '',
            perPage: 6,
        };
    },
    methods: {
        toggleDropdown(section) {
            this.dropdowns[section] = !this.dropdowns[section];
        },
        updateSelectedFilters() {
            this.selectedFilters = [
                ...this.tempCategories.map((c) => ({ label: this.getCategoryLabel(c), value: c })),
                ...this.tempBrands.map((b) => ({ label: this.getBrandLabel(b), value: b })),
                ...(this.tempPrice ? [{ label: this.getPriceLabel(this.tempPrice), value: this.tempPrice }] : [])
            ];
        },
        applyFilters() {
            this.activeCategories = [...this.tempCategories];
            this.activeBrands = [...this.tempBrands];
            this.activePrice = this.tempPrice;
            this.activeSortBy = this.tempSortBy;

            this.currentPage = 1;
            this.showFilters = false;

            let result = [...this.products];

            if (this.activeCategories.length) {
                result = result.filter(p => this.activeCategories.includes(p.productCategory?.toLowerCase()));
            }

            if (this.activeBrands.length) {
                result = result.filter(p => this.activeBrands.includes(p.productBrand?.toLowerCase()));
            }

            if (this.activePrice) {
                result = result.filter(p => {
                    const price = parseFloat(p.productPrice);
                    if (this.activePrice === '0_100') return price < 100;
                    if (this.activePrice === '100_500') return price >= 100 && price < 500;
                    if (this.activePrice === '500_1000') return price >= 500 && price < 1000;
                    if (this.activePrice === '1000+') return price >= 1000;
                    return true;
                });
            }

            if (this.searchQuery.trim() !== '') {
                const query = this.searchQuery.trim().toLowerCase();
                result = result.filter(p =>
                    p.productName?.toLowerCase().includes(query) ||
                    p.productBrand?.toLowerCase().includes(query)
                );
            }

            switch (this.activeSortBy) {
                case 'name_asc':
                    result.sort((a, b) => a.productName.localeCompare(b.productName));
                    break;
                case 'name_desc':
                    result.sort((a, b) => b.productName.localeCompare(a.productName));
                    break;
                case 'price_asc':
                    result.sort((a, b) => parseFloat(a.productPrice) - parseFloat(b.productPrice));
                    break;
                case 'price_desc':
                    result.sort((a, b) => parseFloat(b.productPrice) - parseFloat(a.productPrice));
                    break;
                case 'latest':
                    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                default:
                    result.sort((a, b) => a.productID - b.productID);
                    break;
            }

            this.displayedProducts = result;

            this.$emit("filtersUpdated", {
                categories: this.activeCategories,
                brands: this.activeBrands,
                price: this.activePrice
            });
        },
        resetFilters() {
            // Reset values
            this.tempCategories = [];
            this.tempBrands = [];
            this.tempPrice = null;
            this.tempSortBy = 'default';

            this.activeCategories = [];
            this.activeBrands = [];
            this.activePrice = null;
            this.activeSortBy = 'default';

            this.selectedFilters = [];

            this.currentPage = 1;
            this.showFilters = false;

            this.getProductList();
        },
        applySort() {
            this.tempSortBy = this.sortBy;
            this.applyFilters();
            this.searchQuery = '';
        },
        removeFilter(value) {
            this.tempCategories = this.tempCategories.filter((c) => c !== value);
            this.tempBrands = this.tempBrands.filter((b) => b !== value);
            if (this.tempPrice === value) this.tempPrice = "";
            this.updateSelectedFilters();
            this.applyFilters();
        },
        getCategoryLabel(value) {
            return this.categories.find((cat) => cat.value === value)?.label || value;
        },
        getBrandLabel(value) {
            return this.brands.find((br) => br.value === value)?.label || value;
        },
        getPriceLabel(value) {
            return this.priceRanges.find((pr) => pr.value === value)?.label || value;
        },
        closeOnOverlay() {
            this.showFilters = false;
        },
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
            const { categories, brands } = this.$route.query;

            // Apply route-based filters to temp and active filters
            this.tempCategories = categories ? [categories.toLowerCase()] : [];
            this.tempBrands = brands ? [brands.toLowerCase()] : [];
            this.tempPrice = null;
            this.tempSortBy = 'default';

            this.activeCategories = [...this.tempCategories];
            this.activeBrands = [...this.tempBrands];
            this.activePrice = null;
            this.activeSortBy = 'default';

            this.selectedFilters = [
                ...this.tempCategories.map((c) => ({ label: this.getCategoryLabel(c), value: c })),
                ...this.tempBrands.map((b) => ({ label: this.getBrandLabel(b), value: b }))
            ];

            const res = await this.$axios.get('products', {
                params: {
                    categories: this.type,
                    brands: this.brand
                }
            });

            if (res.status === 200) {
                this.products = res.data;
                this.applyFilters();
            }
        },
        addProduct() {
            this.$router.push({ name: "productManagement", params: { id: "" } });
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
        filteredProducts() {
            let result = this.products;

            if (this.activeCategories.length) {
                result = result.filter(p => this.activeCategories.includes(p.productCategory?.toLowerCase()));
            }

            if (this.activeBrands.length) {
                result = result.filter(p => this.activeBrands.includes(p.productBrand?.toLowerCase()));
            }

            if (this.activePrice) {
                result = result.filter(p => {
                    const price = parseFloat(p.productPrice);
                    if (this.activePrice === '0_100') return price < 100;
                    if (this.activePrice === '100_500') return price >= 100 && price < 500;
                    if (this.activePrice === '500_1000') return price >= 500 && price < 1000;
                    if (this.activePrice === '1000+') return price >= 1000;
                    return true;
                });
            }

            if (this.searchQuery.trim() !== '') {
                const query = this.searchQuery.trim().toLowerCase();
                result = result.filter(p =>
                    p.productName?.toLowerCase().includes(query) ||
                    p.productBrand?.toLowerCase().includes(query)
                );
            }

            return result;
        },
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.displayedProducts.slice(start, start + this.perPage);
        },
        type() {
            return this.$route.query.categories;
        },
        brand() {
            return this.$route.query.brands;
        }
    },
    mounted() {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        const isAdmin = userDetails.is_admin;
        this.isAdmin = isAdmin === 0 ? false : true;
        // console.log('type', this.$route.query.type)
        // this.type = this.$route.query.categories;
        // this.brand = this.$route.query.brands;
        this.getProductList();
    },
    watch: {
        '$route.query'(newQuery) {
            // Reset filters when route changes
            this.tempCategories = newQuery.categories ? [newQuery.categories.toLowerCase()] : [];
            this.tempBrands = newQuery.brands ? [newQuery.brands.toLowerCase()] : [];
            this.tempPrice = null;
            this.tempSortBy = 'default';

            // Sync selected filters
            this.updateSelectedFilters();

            // Fetch fresh product list
            this.getProductList();
        },
        searchQuery() {
            this.applyFilters();
        }
    }
};
</script>

<style scoped>
.search-container {
    display: flex;
    align-items: center;
    width: 500px;
    height: 50px;
    border: 2px solid black;
    border-radius: 8px;
    overflow: hidden;
    background: white;
}

.search-form {
    display: flex;
    width: 100%;
}

.search {
    flex: 1;
    padding: 10px;
    border: none;
    outline: none;
    font-size: 14px;
    height: 46px;
    width: 100%;
}

.btn-primary[data-v-2e39931e] {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    width: 12%;
    border-radius: 5px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.filter-btn {
    right: 70px;
    background: white;
    color: black;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
}

.filter-sidebar {
    position: fixed;
    top: 0;
    right: -500px;
    width: 500px;
    height: 100%;
    background: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    transition: right 0.3s ease-in-out;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    padding: 15px;
}

.filter-sidebar.open {
    right: 0;
}

/* Overlay when sidebar is open */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

/* Close Button */
.close-btn {
    cursor: pointer;
    font-size: 20px;
}

/* Filter Content */
.filter-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}

/* Container for the sort section */
.filter-block {
    margin-bottom: 0px;
    border-bottom: 1px solid #ddd;
}


/* Custom scrollbar styling */
.filter-body::-webkit-scrollbar {
    width: 5px;
}

.filter-body::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.filter-body::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Header containing title and chevron */
.filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    padding: 6px 0;
    /* Reduce padding */
}

/* "SORT BY" Title */
.filter-title {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
}

/* Chevron icon */
.fa {
    font-size: 12px;
    transition: transform 0.3s ease;
}

.rotate-up {
    transform: rotate(180deg);
}

.rotate-down {
    transform: rotate(0deg);
}

/* Dropdown Content */
.filter-content {
    padding-top: 0px;
}

/* Sort options style */
.filter-content label {
    display: block;
    padding: 2px 0;
    /* Reduce space between options */
    font-size: 14px;
    cursor: pointer;
}


/* Sort option styles */
.filter-option {
    display: block;
    padding: 3px 0;
    /* Reduced spacing */
    font-size: 14px;
}

.close-btn {
    cursor: pointer;
}

.btn-primary {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    width: 100%;
    border-radius: 5px;
}

/* Applied Filters Section */
.appliedFilters {
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
    margin-bottom: 10px;
}

/* Filters are aligned in a row */
.filterSet {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

/* Each Filter Item */
.filter-item {
    display: flex;
    align-items: center;
    background: #007bff;
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
}

.filter-item button {
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
    margin-left: 5px;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

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

.button {
    margin: 5px;
}

.create-btn {
    right: 70px;
    background: white;
    color: black;
    padding: 15px 15px;
    gap: 5px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
}
</style>
