<template>
    <div style="padding:30px">
        <b-form @submit.prevent="submit" class="form-container">
            <legend class="form-title">
                <h2 v-if="id === ''">Create New Product</h2>
                <h2 v-else>Edit Product</h2>
            </legend>
            <div class="form-content">
                <b-form-group id="brand" label="Brand" label-for="brand-input">
                    <b-form-input id="brand-input" v-model="brand" required trim></b-form-input>
                </b-form-group>
                <b-form-group id="name" label="Name" label-for="name-input">
                    <b-form-input id="name-input" v-model="name" required></b-form-input>
                </b-form-group>
                <b-form-group id="category" label="Category" label-for="category-input">
                    <b-form-input id="category-input" v-model="category" required></b-form-input>
                </b-form-group>
                <b-form-group id="information" label="Information" label-for="information-input">
                    <b-form-input id="information-input" v-model="information" required></b-form-input>
                </b-form-group>
                <b-form-group id="description" label="Description" label-for="description-input">
                    <b-form-textarea id="description-input" v-model="description" rows="5" required></b-form-textarea>
                </b-form-group>
                <b-form-group id="variant" label="Variant" label-for="variant-input">
                    <b-form-input id="variant-input" v-model="variant" required></b-form-input>
                </b-form-group>
                <b-form-group id="price" label="Price" label-for="price-input">
                    <b-input-group prepend="RM">
                        <b-form-input id="price-input" v-model="price" required></b-form-input>
                    </b-input-group>
                </b-form-group>
                <b-form-group id="file" label="Upload Image" label-for="file-input">
                    <b-form-file id="file-input" v-model="file" multiple :state="Boolean(file)" accept="image/*"
                        @change="handleFileUpload" placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here..."></b-form-file>
                    <b-form-text v-if="id !== '' && file !== null">Original File: {{ oriFileName }}</b-form-text>

                    <!-- Image Preview -->
                    <div v-if="previewUrl && previewUrl.length">
                        <div v-for="(url, index) in previewUrl" :key="index" style="margin-top: 10px;">
                            <img :src="url" alt="Preview" style="max-width: 150px;">
                        </div>
                    </div>
                </b-form-group>
            </div>
            <div class="form-button">
                <b-button type="submit" variant="success">Submit</b-button>
            </div>
        </b-form>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'productManagement',
    components: {
    },
    computed: {
    },
    data: function () {
        return {
            id: '',
            brand: '',
            name: '',
            category: '',
            information: '',
            description: '',
            price: '0.00',
            variant: '',
            file: '',
            oriFileName: '',
            previewUrl: null,
            debounceTimer: null,
        };
    },
    props: {
    },
    methods: {
        handleFileUpload(event) {
            const files = Array.from(event.target.files); // ← convert to array
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

            const validFiles = files.filter(file => allowedTypes.includes(file.type));

            if (validFiles.length > 0) {
                this.file = validFiles;

                // Revoke previous object URLs if needed
                if (this.previewUrl) {
                    this.previewUrl.forEach(url => URL.revokeObjectURL(url));
                }

                this.previewUrl = validFiles.map(file => URL.createObjectURL(file));
            } else {
                event.target.value = null;
                this.file = [];
                this.previewUrl = [];
                alert('Please select valid image files (JPEG, PNG, or GIF)');
            }
        },

        async submit() {
            if (!this.brand || !this.name || !this.category  || !this.description || !this.variant) {
                alert("All fields are required.");
                return;
            }

            if (isNaN(this.price) || this.price <= 0) {
                alert("Price must be a positive number.");
                return;
            }

            let formData = new FormData();
            formData.append('brand', this.brand.toUpperCase());
            formData.append('name', this.name.toUpperCase());
            formData.append('category', this.category.toLowerCase());
            formData.append('information', this.information); 
            formData.append('description', this.description);
            formData.append('price', this.price);
            formData.append('variant', this.variant); 

            // Important: Use the correct field name expected by backend
            this.file.forEach((fileItem) => {
                formData.append('productImage[]', fileItem);  // multiple images
            });

            if (this.id !== '') {
                let result = await this.$axios.post(`products/update/${this.id}`, formData);
                if (result.status === 200) {
                    this.$showSuccess('success', 'Product Edited', `Successfully edited <b>${this.name}</b>`);
                    this.$router.push(`details?productId=${this.id}`);
                }
            } else {
                let result = await this.$axios.post('products/create', formData);
                if (result.status === 200) {
                    this.$showSuccess('success', 'Product Created', `Successfully created <b>${this.name}</b>`);
                    this.$router.push({ name: 'productPage' });
                }
            }
        },

        clearForm() {
            this.brand = '';
            this.name = '';
            this.category = '';
            this.information = '';
            this.description = '';
            this.price = '0.00';
            this.variant = '';
            this.file = null;
            this.previewUrl = null;
            this.oriFileName = '';
        }
    },
    async mounted() {
        const productID = this.$route.params.id;
        this.id = productID;
        if (this.id !== '') {
            const response = await this.$axios.get('products/' + this.id);
            console.log('res', response)
            if (response.status === 200) {
                if (response?.data) {
                    const product = response?.data;
                    this.brand = product.productBrand;
                    this.name = product.productName;
                    this.category = product.productCategory;
                    this.description = product.productDescription;
                    this.variant = product.productVariant;
                    this.information = product.productInformation;
                    this.file = [];
                    this.price = product.productPrice;
                    this.oriFileName = product.productImage;
                }
            }
        }
    },
    watch: {
    }
}
</script>

<style scoped>
.form-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
}

.form-container {
    border: 1px solid black;
    border-radius: 10px;
    margin: auto;
    padding: 20px;
    max-width: 600px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0, 1);
}

.form-content {
    margin: 20px;
}

.form-button {
    margin: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-top: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

b-form-input,
b-form-textarea,
b-form-file {
    border-radius: 5px;
}
</style>