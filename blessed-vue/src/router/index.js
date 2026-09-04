import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import ProductView from "../views/ProductView.vue";


const router = createRouter({

    history: createWebHistory(),

    routes: [

        {
            path: "/",
            component: HomeView
        },

        {
            path: "/catalog",
            component: CatalogView
        },

        {
            path: "/product/:id",
            component: ProductView
        }

    ]

});


export default router;