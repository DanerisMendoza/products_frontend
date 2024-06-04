<template>
    <div style="display: flex; flex-direction: column; gap: 0.5rem; ">
        <!-- list -->
        <v-card elevated>
            <v-card-text>
                <!-- list header -->
                <h1 style="text-align: center; margin-bottom: 1.5rem">LIST OF PRODUCTS</h1>
                <div style="display: flex; align-items: start; gap: 1%; ">
                    <v-btn @click="create" size="large" style="margin-top: 0.1rem;">Create</v-btn>
                    <v-autocomplete v-model="category" label="Category" variant="outlined" density="comfortable"
                        :items="['best seller', 'budget product', 'new arrival']"
                        @update:modelValue="fetchTable"></v-autocomplete>

                    <v-text-field label="Search" variant="outlined" hide-details="auto" clearable density="comfortable"
                        v-model="search" @keydown.enter="fetchTable">
                        <template v-slot:append-inner>
                            <v-icon @click="fetchTable">mdi-magnify</v-icon>
                        </template>
                    </v-text-field>

                </div>


                <v-list lines="three">
                    <v-list-item v-for="(product, index) in PRODUCTS.data" :key="product.id">
                        <v-card variant="tonal">
                            <v-card-text>
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                                    <div style="align-self: end; display: flex; gap: 0.5rem">
                                        <v-icon size="x-large" class="cursor" style="color: red;"
                                            @click="DeleteProduct(product)">mdi-delete</v-icon>
                                        <v-icon size="x-large" class="cursor" color="secondary"
                                            @click="EditProduct(product)">mdi-pencil</v-icon>
                                    </div>
                                    <v-carousel v-if="product.images.length > 0" hide-delimiter-background>
                                        <v-carousel-item v-for="(item, index) in product.images" :key="index"
                                            :src="item.base64img"></v-carousel-item>
                                    </v-carousel>
                                    <div style="display: flex;  gap: 0.5rem;  align-items: center;">
                                        <p><strong>{{ product.name }}</strong></p>
                                    </div>
                                    <v-chip color="primary">{{ product.category }}</v-chip>
                                    <p>Description: {{ product.description }}</p>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-list-item>
                </v-list>
                <div style="display: flex; flex-direction: column; ">
                    <div style="display: flex;  align-self: center; gap: 0.5rem">
                        <v-pagination v-if="pagination_length>0" v-model="page" :length="pagination_length" density="compact" style="margin-top: 0.2rem" @update:modelValue="(fetchTable)"></v-pagination>
                        <div>
                            <v-select variant="solo" v-model="perPage" @update:modelValue="fetchTable"
                                :items="['5', '10', '15', '20', '30', '50']"       density="compact"></v-select>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>

        <!-- edit modal -->
        <v-dialog v-model="EditModal" max-width="80rem" persistent>
            <v-card>
                <v-card-text>
                    <v-form ref="myForm" @submit.prevent>
                        <v-text-field label="name" v-model="form.name"></v-text-field>
                        <v-autocomplete v-model="form.category" label="Category" :rules="rules.required"
                            :items="['best seller', 'budget product', 'new arrival']"></v-autocomplete>
                        <v-textarea v-model="form.description" :rules="rules.required" label="Description"></v-textarea>
                        <v-file-input @change="handleFileChange()" style="display: none" ref="fileInput"
                            v-model="pictureData" truncate-length="15" outlined multiple accept="image/*"
                            color="orange lighten-2"></v-file-input>

                        <v-menu :close-on-content-click="false">
                            <v-date-picker color="primary"
                                @update:modelValue="(newValue) => { form.date_and_time = formatDate(newValue) }"></v-date-picker>
                            <template v-slot:activator="{ props }" transition="scale-transition" offset-y>
                                <v-text-field v-model="form.date_and_time" clearable label="Date" readonly
                                    v-bind="props" variant="outlined">
                                </v-text-field>
                            </template>
                        </v-menu>
                    </v-form>

                    <div style="display: flex; gap: 0.5rem">
                        <v-btn @click="() => EditModal = false" elevation="2" color="yellow">
                            Cancel
                        </v-btn>
                        <v-btn @click="openFileInput" elevation="2" color="green">
                            <v-icon>mdi-image-plus</v-icon>Upload
                        </v-btn>
                        <v-btn v-if="pictures.length > 0" @click="openModal" elevation="2" outlined color="warning">
                            <v-icon>mdi-image-multiple</v-icon>View
                        </v-btn>
                        <v-btn :loading="loadSubmit" elevation="2" @click="submit" color="red">
                            Submit
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- picture modal -->
        <v-dialog v-model="showModal" max-width="800px" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">Pictures</span>
                    <v-icon color="gray" class="float-right" @click="closeModal">mdi-close-circle</v-icon>
                </v-card-title>
                <v-card-text>
                    <div v-for="(item, index) in pictures" :key="index" cols="12">
                        <v-card @click="enlargeImage(item)">
                            <v-card-title>
                                <v-btn icon size="x-small" color="red" @click.stop="removeImage(index)"
                                    class="float-right">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-card-title>

                            <v-card-text class="image-label text-center">
                                <div class="image-container">
                                    <v-img contain :src="item.src" eager class="image"></v-img>
                                </div>
                                {{ item.name }}
                            </v-card-text>
                        </v-card>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import { mapGetters } from "vuex";
import moment from 'moment';

export default {
    data() {
        return {
            // list data
            perPage: 5,
            options: {},
            page: 1,
            sortBy: "",
            sortDesc: false,
            category: null,
            search: null,
            total: 0,

            // update data
            loadSubmit: false,
            isCardActive: false,
            isCommitCompleted: false,
            showEnlarged: false,
            showModal: false,
            EditModal: false,
            selectedImage: null,
            form: {
                id: null,
                name: null,
                category: null,
                description: null,
                date_and_time: null,
            },
            pictureFile: [],
            pictureData: [],
            pictures: [],

            rules: {
                required: [(v) => !!v || "Field is required"],
                min: [(v) => v.length >= 8 || "Min 8 characters"],
                email: [
                    (v) => !!v || "E-mail is required",
                    (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
                ],
                contact: [
                    (v) =>
                        (v !== null && v !== undefined && /^\d+$/.test(v)) ||
                        "Only numeric values are allowed",
                    (v) =>
                        (v !== null && v !== undefined && v.length >= 11) ||
                        "Min 11 characters",
                ],
            },
        };
    },
    computed: {
        ...mapGetters(["PRODUCTS", "", ""]),
        pagination_length(){
            // console.log(this.total)
            // console.log(this.perPage)
            // console.log( Math.ceil(this.total / this.perPage))
            // return 5
            return Math.ceil(this.total / this.perPage)
        }
    },
    methods: {
        base64ToFile(base64, filename) {
            let arr = base64.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        },

        EditProduct(product) {
            // cloud pictures to local as picture
            const imagesArray = product.images;
            const imageElements = imagesArray.map((image, index) => {
                return {
                    src: image.base64img
                };
            });
            this.pictures = imageElements
            // cloud pictures to local as file
            this.pictureFile = imagesArray.map((image, index) => {
                const fileName = `image${index + 1}.png`; // Create a filename for each image
                return this.base64ToFile(image.base64img, fileName);
            });
            //selected product setup
            this.EditModal = true
            this.form.id = product.id
            this.form.name = product.name
            this.form.category = product.category
            this.form.description = product.description
            this.form.date_and_time = this.formatDate(product.date_and_time)
        },

        DeleteProduct(product) {
            const payload = {
                params: {
                    product_id: product.id
                }
            }
            this.$store.dispatch('DeleteProduct', payload).then(() => {
                this.fetchTable()
            })
        },

        checkData(data) {
            console.log(data)
        },

        create() {
            this.$router.push("/SideNav/CreateProduct");
        },

        fetchTable() {
            const payload = {
                params: {
                    perPage: this.perPage,
                    page: this.page,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortDesc: this.sortDesc,
                    category: this.category,
                },
            }
            this.$store.dispatch('GetProducts', payload).then(() => {
                console.log(this.PRODUCTS.total)
                this.total = this.PRODUCTS.total
            })
        },

        async savePictures() {
            for (const pic of this.pictureData) {
                const reader = new FileReader();
                const loadPromise = new Promise((resolve) => {
                    reader.addEventListener("load", () => {
                        resolve(reader.result);
                    });
                });
                reader.readAsDataURL(pic);
                const result = await loadPromise;
                this.pictures.push({
                    src: result,
                    name: pic.name,
                });
                this.pictureFile.push(pic);
            }
            console.log(this.pictureFile)
            this.isCommitCompleted = true;
        },

        handleFileChange() {
            if (!this.isCommitCompleted) {
                this.savePictures()
                    .then(() => {
                        this.resetInputValue();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },

        resetInputValue() {
            if (this.isCommitCompleted) {
                this.$refs.fileInput.reset();
                this.isCommitCompleted = false;
            }
        },

        async submit() {
            const result = await this.$refs.myForm.validate();
            if (result.valid) {
                this.loadSubmit = true;
                const data = new FormData();
                const config = {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
                data.append("form", JSON.stringify(this.form));
                if (this.pictureFile.length > 0) {
                    for (let i = 0; i < this.pictureFile.length; i++) {
                        data.append("files[]", this.pictureFile[i]);
                    }
                }

                const payload = {
                    params: data,
                    config: config,
                };
                this.$store.dispatch("UpdateProduct", payload).then((response) => {
                    this.loadSubmit = false
                    if (response === "success") {
                        this.fetchTable()
                        this.clear()
                        this.drawer = false
                        this.$swal.fire({
                            title: "Success!",
                            text: "Form submitted successfully!",
                            icon: "success",
                        });
                        this.$router.push("/SideNav/ListProducts");
                    } else {
                        this.$swal.fire({
                            title: "Validation Error",
                            text: response,
                            icon: "warning",
                        });
                    }
                });
            }
        },

        clear() {
            this.$refs.myForm.resetValidation();
            for (let key in this.form) {
                if (this.form.hasOwnProperty(key)) {
                    this.form[key] = null;
                }
            }
            this.pictureFile = [];
            this.pictureData = [];
            this.pictures = [];
        },
        openFileInput() {
            this.$refs.fileInput.$el.querySelector("input").click();
        },

        openModal() {
            console.log(this.pictures)
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        enlargeImage(item) {
            this.selectedImage = item.src;
            this.showEnlarged = true;
        },
        removeImage(index) {
            this.pictures.splice(index, 1);
            this.pictureFile.splice(index, 1);
        },
        formatDate(date) {
            return moment(date).format("MMMM D, YYYY");
        },
    },

    created() {
        this.fetchTable()
    },
};
</script>

<style scoped>
.cursor:hover {
    cursor: pointer;
}
</style>