<template>
    <div style="display: flex; flex-direction: column; gap: 0.5rem; ">
        <h1>LIST OF PRODUCTS</h1>
        <v-btn style="align-self: end;" @click="create">Create</v-btn>
        <v-card elevated>
            <v-card-text>
                <v-list lines="three">
                    <v-list-item v-for="(product, index) in PRODUCTS" :key="product.id">
                        <v-card variant="outlined">
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
        }

    },
    created() {
        this.$store.dispatch('GetProducts').then(() => {
            // console.log(this.PRODUCTS[10].images)
        })
    },
};
</script>

<style scoped>
/* Add your styling if needed */
</style>