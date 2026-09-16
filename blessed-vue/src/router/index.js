import {
    createRouter,
    createWebHistory
} from "vue-router";


import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import ProductView from "../views/ProductView.vue";
import ProfileView from "../views/ProfileView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";


import {
    store,
    loadUserData
} from "../store";


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
        },

        {
            path: "/profile",
            component: ProfileView
        },

        {
            path: "/login",
            component: LoginView
        },

        {
            path: "/register",
            component: RegisterView
        },

        {
            path: "/admin",
            component: AdminView,

            meta: {
                requiresAdmin: true
            }
        }

    ]

});


router.beforeEach(async (to) => {

    /*
        При обновлении страницы
        заново проверяем пользователя.
    */

    if (
        store.token &&
        !store.loaded
    ) {

        await loadUserData();

    }


    const isLoggedIn =
        !!store.token;


    const isAdmin =
        !!store.user &&
        store.user.role === "admin";


    /*
        Если пользователь хочет
        открыть админку
    */

    if (to.meta.requiresAdmin) {

        /*
            Не авторизован
        */

        if (!isLoggedIn) {

            return "/login";

        }


        /*
            Обычный пользователь
        */

        if (!isAdmin) {

            return "/";

        }


        /*
            Администратор
        */

        return true;

    }


    /*
        Администратор не может
        ходить по обычному сайту
    */

    if (isLoggedIn && isAdmin) {

        /*
            Админ может оставаться
            только на /admin
        */

        if (to.path === "/admin") {

            return true;

        }


        /*
            Даже login/register
            ему больше не нужны
        */

        return "/admin";

    }


    /*
        Обычный пользователь
        может пользоваться сайтом
    */

    return true;

});


export default router;