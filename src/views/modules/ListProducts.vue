<template>
    <v-app style="display: flex; flex-direction: column;">
        <h1>LIST OF PRODUCTS</h1>
        <v-btn style="align-self: end;" @click="create">Create</v-btn>
    </v-app>
</template>

<script>

import { mapGetters } from "vuex";
import moment from 'moment';

export default {
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters(["", "", ""]),
    },
    methods: {
        create() {
            this.$router.push("/SideNav/CreateProduct");
        }

    },
    created() {

    },
};
</script>

<style scoped>
/* Add your styling if needed */
</style>