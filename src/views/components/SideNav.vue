<template>
  <v-app app>
    <v-navigation-drawer app color="#343a40" v-model="drawer" :width="drawerWidth">
      <v-list dense>
        <!-- Loop through links and create router links -->
        <router-link v-if="USER_DETAILS.user_role === 0" v-for="link in links" :to="link.to" :key="link.to"
          class="sidenav-link">
          <v-list-item link :class="{ 'highlighted-link': isLinkActive(link.to) }" class="pl-8">
            <v-list>
              {{ link.text }}
            </v-list>
          </v-list-item>
        </router-link>

        <!-- Products Dropdown -->
        <v-list v-if="USER_DETAILS.user_role === 0 || USER_DETAILS.user_role === 1">
          <v-list-item class="pl-8 pr-8" @click="toggleReportsDropdown">
            <v-list>
              Products
              <div class="float-right">
                <v-icon v-if="reportsDropdownOpen">mdi-menu-up</v-icon>
                <v-icon v-else>mdi-menu-down</v-icon>
              </div>
            </v-list>
          </v-list-item>

          <!-- Dropdown Items -->
          <v-list v-show="reportsDropdownOpen">
            <div class="submenu-bg">
              <router-link :to="'/SideNav/CreateProduct'" :key="'/SideNav/CreateProduct'" class="submenu-link">
                <v-list-item link class="pl-8"
                  :class="{ 'highlighted-link': $route.path === '/SideNav/CreateProduct', }">
                  <v-list-item>
                    Create Product
                  </v-list-item>
                </v-list-item>
              </router-link>
              <router-link :to="'/SideNav/ListProducts'" :key="'/SideNav/ListProducts'" class="submenu-link">
                <v-list-item link class="pl-8"
                  :class="{ 'highlighted-link': $route.path === '/SideNav/ListProducts', }">
                  <v-list-item>
                    List of Products
                  </v-list-item>
                </v-list-item>
              </router-link>
            </div>
          </v-list>
        </v-list>

        <v-list-item @click="logout" class="pl-8">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main style="background: #f4f6f9;">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-app-bar app elevation="0" color="#ffffff" :style="{ marginLeft: drawer ? drawerWidth : '0' }">
      <v-app-bar-nav-icon @click.stop.prevent="drawer = !drawer" color="#7e7e7e"></v-app-bar-nav-icon>
    </v-app-bar>
  </v-app>
</template>

<script setup>
// Import Vue features
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";


const drawer = ref(true);
const drawerWidth = ref(350);
const reportsDropdownOpen = ref(false);
const menuOpen = ref(false);
const store = useStore();
const router = useRouter();
const USER_DETAILS = computed(() => store.getters.USER_DETAILS);


console.log(localStorage.getItem("product-token"));
console.log(sessionStorage.getItem("product-token"));

const route = useRoute();

const links = [
  { to: "/SideNav/USERS", text: "Users" },
];

// const links = [
//   admin links 
//   [
//     { to: "/SideNav/USERS", text: "Users" },
//     { to: "/SideNav/ListProducts", text: "ListProducts" },
//     { to: "/SideNav/CreateProduct", text: "CreateProduct" },
//   ],
//   end-user links
//   [
//     { to: "/SideNav/ListProducts", text: "ListProducts" },
//     { to: "/SideNav/CreateProduct", text: "CreateProduct" },
//   ],
// ];

const toggleReportsDropdown = () => {
  reportsDropdownOpen.value = !reportsDropdownOpen.value;
};

const isLinkActive = (to) => {
  return route.path === to;
};

const logout = () => {
  store
    .dispatch("Logout")
    .then((response) => {
      console.log(response)
      if (response.message === "success") {
        localStorage.removeItem("product-token");
        sessionStorage.removeItem("product-token");
        router.push("/");
      }
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
};

store.dispatch("GetUserDetails").then(() => {
  console.log(USER_DETAILS.value.user_role);
});

</script>

<style scoped>
.sidenav-link,
.submenu-link {
  color: white;
  text-decoration: none;
}

.highlighted-link {
  background: #007bff;
}
</style>
