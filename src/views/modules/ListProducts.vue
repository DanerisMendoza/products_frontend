<template>
    <div style="display: flex; flex-direction: column; gap: 0.5rem; ">
        <h1 style="text-align: center">LIST OF PRODUCTS</h1>
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
        <v-card elevated>
            <v-card-text>
                <v-list lines="three">
                    <v-list-item v-for="(product, index) in PRODUCTS" :key="product.id">
                        <v-card variant="tonal">
                            <v-card-text>
                                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
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
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

import { mapGetters } from "vuex";
import moment from 'moment';

export default {
    data() {
        return {
            options: {},
            page: 1,
            sortBy: "",
            sortDesc: false,
            category: null,
            search: null,
            items: [
                {
                    title: 'Item #1',
                    value: 1,
                },
                {
                    title: 'Item #2',
                    value: 2,
                },
                {
                    title: 'Item #3',
                    value: 3,
                },
            ],
        };
    },
    computed: {
        ...mapGetters(["PRODUCTS", "", ""]),
    },
    methods: {
        checkData(data) {
            console.log(data)
        },
        create() {
            this.$router.push("/SideNav/CreateProduct");
        },
        fetchTable() {
            const payload = {
                params: {
                    perPage: this.options.itemsPerPage,
                    page: this.options.page,
                    search: this.search,
                    sortBy: this.sortBy,
                    sortDesc: this.sortDesc,
                    category: this.category,
                },
            }
            this.$store.dispatch('GetProducts', payload).then(() => {
                // console.log(this.PRODUCTS[10].images)
            })
        }
    },
    created() {
        this.fetchTable()
    },
};
</script>

<style scoped>
/* Add your styling if needed */
</style>