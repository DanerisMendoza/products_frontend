// Composables
import { createRouter, createWebHistory } from 'vue-router'
import SideNav from '@/views/components/SideNav.vue';
import CreateProduct from '@/views/modules/CreateProduct.vue';
import ListProducts from '@/views/modules/ListProducts.vue';
import LOGIN from '@/views/modules/LOGIN.vue';
import USERS from '@/views/modules/USERS.vue';
import { useStore } from 'vuex';

const routes = [
    {
        path: '/',
        redirect: '/LOGIN'
    },
    {
        path: '/LOGIN',
        name: '/LOGIN',
        component: LOGIN,
    },
    {
        path: '/SideNav',
        component: SideNav,
        children: [
            {
                path: '',
                redirect: { name: 'ListProducts' }
            },
            {
                path: 'CreateProduct',
                name: 'CreateProduct',
                component: CreateProduct,
                meta: { role: ['0','1'] }
            },
            {
                path: 'ListProducts',
                name: 'ListProducts',
                component: ListProducts,
                meta: { role: ['0','1'] }
            },
            {
                path: 'USERS',
                name: 'USERS',
                component: USERS,
                meta: { role: ['0'] }
            },
        ]
    },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    const store = useStore();
    const tabs = [
        [
            { label: "USERS", route: "/SideNav/USERS" },
            { label: "ListProducts", route: "/SideNav/ListProducts" },
            { label: "CreateProduct", route: "/SideNav/CreateProduct" },
        ],
        [
            { label: "ListProducts", route: "/SideNav/ListProducts" },
            { label: "CreateProduct", route: "/SideNav/CreateProduct" },
        ],
    ];

    if (to.name == '/LOGIN') {
        store.dispatch("GetUserDetails").then((response) => {
            next(`${tabs[response.user_role][0].route}`);
        }).catch((error) => {
            next();
        });
    }
    else {
        store.dispatch("GetUserDetails").then((response) => {
            if ((to.meta.role as any).includes(response.user_role.toString())) {
                next();
            }
            else {
                next(`${tabs[response.user_role][0].route}`);
            }
        }).catch((error) => {
            next('/LOGIN');
        });
    }
});


export default router
