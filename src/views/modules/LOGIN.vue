<template>
  <v-app>
    <v-card class="card">
      <p style="text-align: center">Login</p>
      <v-form ref="myForm" class="form" @submit.prevent="login">
        <v-text-field v-model="username" :rules="rules.required" outlined dense label="Username"></v-text-field>
        <v-text-field v-model="password" type="password" :rules="rules.required" outlined dense
          label="Password"></v-text-field>
        <v-btn type="submit" class="submit-button">Sign in</v-btn>
        <v-checkbox v-model="rememberMe" label="Remember Me" class="remember_me_checkbox" dense></v-checkbox>
      </v-form>
    </v-card>
  </v-app>
</template>


<script>
export default {
  data() {
    return {
      rememberMe: false,
      username: null,
      password: null,
      role: null,
      user_id: null,
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

  methods: {
    login() {
      if (this.$refs.myForm.validate()) {
        const payload = {
          username: this.username,
          password: this.password,
        };
        this.$store.dispatch("LOGIN", payload).then((response) => {
          if (response.message === "Login Successfully!") {
            localStorage.setItem("product-token", response.token);
            this.$router.push("SideNav");
          } else {
            localStorage.removeItem("product-token");
            this.$swal.fire({
              icon: "warning",
              title: "Credential Incorrect!",
              text: "Please Check your Username or Password!",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.card {
  padding: 2rem;
  width: 20rem;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
}

.submit-button {
  align-self: center;
  width: 100%;
}
</style>