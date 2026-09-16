import { reactive } from "vue";


import {
    getProfile,
    updateProfile,
    getCart,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    getFavorites,
    addFavorite,
    removeFavorite,
    getOrders,
    createOrder
} from "./api";


export const store = reactive({

    token:
        localStorage.getItem("token") || "",

    user:
        JSON.parse(
            localStorage.getItem("user") || "null"
        ),

    cart: [],

    favorites: [],

    orders: [],

    loaded: false

});


/* =========================
   SESSION
========================= */


export function saveSession(data) {

    store.token =
        data.token || "";

    store.user =
        data.user || null;


    localStorage.setItem(
        "token",
        store.token
    );


    localStorage.setItem(
        "user",
        JSON.stringify(
            store.user
        )
    );

}


export async function loginSession(data) {

    saveSession(data);

    await loadUserData();

}


/* =========================
   ADMIN
========================= */


export function isAdmin() {

    return (
        !!store.user &&
        store.user.role === "admin"
    );

}


/* =========================
   LOGOUT
========================= */


export function logout() {

    store.token = "";

    store.user = null;

    store.cart = [];

    store.favorites = [];

    store.orders = [];

    store.loaded = false;


    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

}


/* =========================
   LOAD USER DATA
========================= */


export async function loadUserData() {

    if (!store.token) {

        store.loaded = true;

        return;

    }


    try {

        store.user =
            await getProfile();


        store.cart =
            await getCart();


        store.favorites =
            await getFavorites();


        store.orders =
            await getOrders();


        localStorage.setItem(
            "user",
            JSON.stringify(
                store.user
            )
        );


    } catch (error) {

        console.error(
            "Ошибка загрузки пользователя:",
            error
        );

        logout();

    } finally {

        store.loaded = true;

    }

}


/* =========================
   CART
========================= */


export async function addToCart(
    productId,
    size
) {

    if (!store.token) {

        throw new Error(
            "Сначала войдите в аккаунт."
        );

    }


    await addCartItem(
        productId,
        size,
        1
    );


    store.cart =
        await getCart();

}


export async function changeCartQuantity(
    productId,
    size,
    quantity
) {

    await updateCartItem(
        productId,
        size,
        quantity
    );


    store.cart =
        await getCart();

}


export async function removeFromCart(
    productId,
    size
) {

    await deleteCartItem(
        productId,
        size
    );


    store.cart =
        await getCart();

}


/* =========================
   FAVORITES
========================= */


export async function toggleFavorite(
    productId
) {

    if (!store.token) {

        throw new Error(
            "Сначала войдите в аккаунт."
        );

    }


    const exists =
        store.favorites.some(
            product =>
                Number(product.id) ===
                Number(productId)
        );


    if (exists) {

        await removeFavorite(
            productId
        );

    } else {

        await addFavorite(
            productId
        );

    }


    store.favorites =
        await getFavorites();

}


/* =========================
   PROFILE
========================= */


export async function saveProfile(
    data
) {

    if (!store.token) {

        throw new Error(
            "Вы не авторизованы."
        );

    }


    store.user =
        await updateProfile(data);


    localStorage.setItem(
        "user",
        JSON.stringify(
            store.user
        )
    );

}


/* =========================
   ORDERS
========================= */


export async function reloadOrders() {

    if (!store.token) {

        store.orders = [];

        return [];

    }


    store.orders =
        await getOrders();


    return store.orders;

}


export async function makeOrder() {

    if (!store.token) {

        throw new Error(
            "Сначала войдите в аккаунт."
        );

    }


    const result =
        await createOrder();


    store.cart =
        await getCart();


    store.orders =
        await getOrders();


    return result;

}