<template>
  <v-app>
    <div :style="{ display: 'flex', flexDirection: 'row' }">
      <h1>USERS</h1>
      <div :style="{ flex: '1' }"></div>
      <v-btn @click="setDialog(true)">Add New User</v-btn>
    </div>

    <v-dialog v-model="isDialogOpen" width="400">
      <v-card>
        <v-card-text class="pt-6">
          <v-form ref="myForm" @submit.prevent="submit">
            <v-text-field
              v-model="form.first_name"
              :rules="rules.required"
              outlined
              dense
              label="First Name"
            ></v-text-field>
            <v-text-field
              v-model="form.middle_name"
              :rules="rules.required"
              outlined
              dense
              label="Middle Name"
            ></v-text-field>
            <v-text-field
              v-model="form.last_name"
              :rules="rules.required"
              outlined
              dense
              label="Last Name"
            ></v-text-field>
            <v-text-field
              v-model="form.username"
              :rules="rules.required"
              outlined
              dense
              label="Username"
            ></v-text-field>
            <v-text-field
              v-model="form.email"
              :rules="rules.required"
              outlined
              dense
              label="Email"
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              type="password"
              :rules="rules.required"
              outlined
              dense
              label="Password"
            ></v-text-field>
            <v-autocomplete filled dense
              :rules="rules.required"
              v-model="form.gender"
              label="Gender"
              :items="['Male', 'Female', 'Others']"
            ></v-autocomplete>
          </v-form>
          <div :style="{ display: 'flex', flexDirection: 'column' }">
            <div
              :style="{ display: 'flex', alignSelf: 'center', gap: '0.5rem' }"
            >
              <v-btn @click="setDialog(false)">Close</v-btn>
              <v-btn @click="submit">Submit</v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="USERS"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.id }}</td>
          <td>{{ item.first_name }}</td>
          <td>{{ item.middle_name }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.user_role }}</td>
          <td>
            <!-- <v-icon @click="viewItem(item)" class="mr-2">mdi-eye</v-icon> -->
            <!-- <v-icon @click="editItem(item)" color="orange">mdi-pencil</v-icon> -->
            <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-app>
</template>
  
  <script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      isDialogOpen: false,
      form: {
        first_name: null,
        middle_name: null,
        last_name: null,
        email: null,
        gender: null,
      },
      headers: [
        { title: "id", sortable: false },
        { title: "FirstName", sortable: false },
        { title: "MiddleName", sortable: false },
        { title: "LastName", sortable: false },
        { title: "Username", sortable: false },
        { title: "Email", sortable: false },
        { title: "User_role", sortable: false },
        { title: "Actions", value: "actions", sortable: false },
      ],
      
      rules: {
        required: [
          (v) => !!v || "Field is required",
          (v) =>
            (v !== null && v !== undefined && !/^\s*$/.test(v)) ||
            "Field is required",
        ],
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
          (v) =>
            (v !== null && v !== undefined && v.length <= 11) ||
            "Max 11 characters",
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["USERS", "", ""]),
  },
  methods: {
    resetForm(){
        this.form.first_name = null
        this.form.middle_name = null
        this.form.last_name = null
        this.form.username = null
        this.form.email = null
        this.form.gender = null
        this.$refs.myForm.reset();
    },
    submit() {
      if (this.$refs.myForm.validate()) {
        this.$store.dispatch("InsertUser", this.form).then((response) => {
          if (response.message === "User inserted successfully") {
            this.resetForm()
            this.setDialog(false)
            this.$store.dispatch("GetUsers")
            this.$swal.fire({
              icon: "success", // Set a warning icon (you can choose a different icon class)
              title: "User Register Successfully!", // Updated title
              showConfirmButton: false, // Remove the "OK" button
              timer: 2000, // Auto-close the alert after 1.5 seconds (adjust as needed)
            });
          }
        });
      }
    },
    setDialog(state) {
      this.isDialogOpen = state;
    },
    deleteItem(item) {
      console.log(item);
      const payload = {
        params: {
          id: item.id,
        },
      };
      console.log(payload);
      this.$store.dispatch("DeleteUser", payload).then(() => {
        this.$store.dispatch("GetUsers");
      });
    },
  },
  created() {
    this.$store.dispatch("GetUsers").then((response) => {
      //   console.log(this.USERS);
    });
  },
};
</script>
  
  <style scoped>
/* Add your styling if needed */
</style>
  