<template>
    <div class="container">
        <v-container class="mt-12">

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
                                <v-text-field v-model="form.date_and_time" clearable label="Date" readonly v-bind="props"
                                    variant="outlined">
                                </v-text-field>
                            </template>
                        </v-menu>
                        
                        
                    </v-form>


                    <div style="display: flex; gap: 0.5rem">
                        <v-btn @click="openFileInput" elevation="2" color="green">
                            <v-icon >mdi-image-plus</v-icon>Upload
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

            <v-dialog v-model="showModal" max-width="800px">
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

            <v-dialog v-model="showEnlarged" width="700px" max-width="800px">
                <v-card>
                    <v-card-text>
                        <v-img v-if="showEnlarged" contain :src="selectedImage" class="enlarged-image"></v-img>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
    data: () => ({
        loadSubmit: false,
        isCardActive: false,
        isCommitCompleted: false,
        showEnlarged: false,
        showModal: false,
        selectedImage: null,
        form: {
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
    }),

    methods: {
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
                this.$store.dispatch("InsertProduct", payload).then((response) => {
                    this.loadSubmit = false
                    if (response === "success") {
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
    computed: {
        ...mapGetters(["", "", ""]),
    },
    created() {

    },
    mounted() {
        this.form.barangay_id = Math.floor(Math.random() * 10) + 1;
    },

    watch: {
        'pictureData'(val) {
            // console.log(val)
        },
    },

};
</script>

<style scoped>
.image-container {
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>