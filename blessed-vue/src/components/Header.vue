<template>

    <!-- =====================================================
         ADMIN HEADER
    ====================================================== -->

    <header
        v-if="isAdmin"
        class="header admin-header"
    >

        <RouterLink
            to="/admin"
            class="logo"
        >
            BLESSED.
        </RouterLink>


        <div class="admin-header-center">
            ADMIN PANEL
        </div>


        <div class="admin-header-actions">

            <div class="admin-user-block">

                <span class="admin-user-label">
                    ADMIN
                </span>

                <strong>
                    {{ store.user?.name || "ADMIN" }}
                </strong>

            </div>


            <button
                class="admin-logout"
                type="button"
                @click="logoutUser"
            >
                Выйти
            </button>

        </div>

    </header>


    <!-- =====================================================
         USER HEADER
    ====================================================== -->

    <header
        v-else
        class="header"
    >

        <RouterLink
            to="/"
            class="logo"
        >
            BLESSED.
        </RouterLink>


        <nav class="navigation">

            <RouterLink to="/">
                Главная
            </RouterLink>

            <RouterLink to="/catalog">
                Каталог
            </RouterLink>

        </nav>


        <div class="header-actions">

            <RouterLink
                v-if="store.user"
                to="/profile"
                class="profile-link"
            >
                Личный кабинет
            </RouterLink>


            <RouterLink
                v-else
                to="/login"
                class="profile-link"
            >
                Войти
            </RouterLink>


            <!-- THEME -->

            <button
                class="header-button theme-button"
                type="button"
                @click="toggleTheme"
                :title="
                    darkMode
                        ? 'Светлая тема'
                        : 'Тёмная тема'
                "
            >

                <span
                    v-if="darkMode"
                    class="theme-icon"
                >
                    ☀
                </span>

                <span
                    v-else
                    class="theme-icon"
                >
                    ☾
                </span>

            </button>


            <!-- SEARCH -->

            <button
                class="header-button"
                type="button"
                @click="openSearch"
            >
                Поиск
            </button>


            <!-- NOTIFICATIONS -->

            <RouterLink
                to="/notifications"
                class="header-button notification-header-button"
            >
                🔔
                <span>
                    {{ notificationCount }}
                </span>
            </RouterLink>


            <!-- FAVORITES -->

            <RouterLink
                to="/favorites"
                class="header-button favorites-header-button"
            >
                ♡
                <span>
                    {{ store.favorites.length }}
                </span>
            </RouterLink>


            <!-- CART -->

            <button
                class="header-button"
                type="button"
                @click="openCart"
            >
                🛒
                <span>
                    {{ cartCount }}
                </span>
            </button>

        </div>


        <!-- =================================================
             SEARCH
        ================================================== -->

        <div
            v-if="searchOpen"
            class="overlay"
            @click.self="closeSearch"
        >

            <div class="search-modal">

                <button
                    class="modal-close"
                    type="button"
                    @click="closeSearch"
                >
                    ×
                </button>


                <p class="section-label">
                    ПОИСК
                </p>


                <h2>
                    Найти товар
                </h2>


                <input
                    v-model="search"
                    class="big-search"
                    placeholder="Название или бренд"
                    autofocus
                >


                <button
                    class="photo-search-button"
                    type="button"
                    @click="openPhotoPicker"
                >
                    ИСКАТЬ ПО ФОТО
                </button>


                <input
                    ref="photoInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    hidden
                    @change="onPhotoSelected"
                >


                <div
                    v-if="aiSearching"
                    class="ai-photo-status"
                >
                    Анализируем фотографию...
                </div>


                <div
                    v-if="aiDescription"
                    class="ai-photo-description"
                >
                    {{ aiDescription }}
                </div>


                <div
                    v-if="aiResults.length"
                    class="ai-photo-results"
                >

                    <p class="ai-photo-title">
                        Похожие товары
                    </p>


                    <RouterLink
                        v-for="product in aiResults"
                        :key="product.id"
                        :to="'/product/' + product.id"
                        class="search-product"
                        @click="closeSearch"
                    >

                        <img
                            :src="imageUrl(product)"
                            :alt="product.name"
                        >


                        <div>

                            <strong>
                                {{ product.name }}
                            </strong>

                            <span>
                                {{ product.brand || "BLESSED" }}
                            </span>

                        </div>


                        <b>
                            {{ price(product.price) }}
                        </b>

                    </RouterLink>

                </div>


                <div class="search-list">

                    <RouterLink
                        v-for="product in searchResults"
                        :key="product.id"
                        :to="'/product/' + product.id"
                        class="search-product"
                        @click="closeSearch"
                    >

                        <img
                            :src="imageUrl(product)"
                            :alt="product.name"
                        >


                        <div>

                            <strong>
                                {{ product.name }}
                            </strong>

                            <span>
                                {{ product.brand || "BLESSED" }}
                            </span>

                        </div>


                        <b>
                            {{ price(product.price) }}
                        </b>

                    </RouterLink>


                    <p
                        v-if="
                            search &&
                            searchResults.length === 0
                        "
                        class="empty-message"
                    >
                        Ничего не найдено.
                    </p>

                </div>

            </div>

        </div>


        <!-- =================================================
             FAVORITES
        ================================================== -->

        <div
            v-if="favoritesOpen"
            class="overlay"
            @click.self="favoritesOpen = false"
        >

            <aside class="side-panel">

                <div class="panel-top">

                    <div>

                        <p class="panel-label">
                            BLESSED
                        </p>

                        <h2>
                            Избранное
                        </h2>

                    </div>


                    <button
                        class="modal-close"
                        type="button"
                        @click="favoritesOpen = false"
                    >
                        ×
                    </button>

                </div>


                <p
                    v-if="store.favorites.length === 0"
                    class="empty-message"
                >
                    В избранном пока ничего нет.
                </p>


                <RouterLink
                    v-for="product in store.favorites"
                    :key="product.id"
                    :to="'/product/' + product.id"
                    class="panel-product"
                    @click="favoritesOpen = false"
                >

                    <img
                        :src="imageUrl(product)"
                        :alt="product.name"
                    >


                    <div>

                        <strong>
                            {{ product.name }}
                        </strong>


                        <span>
                            {{ product.brand || "BLESSED" }}
                        </span>


                        <b>
                            {{ price(product.price) }}
                        </b>

                    </div>

                </RouterLink>

            </aside>

        </div>


        <!-- =================================================
             CART
        ================================================== -->

        <div
            v-if="cartOpen"
            class="overlay"
            @click.self="cartOpen = false"
        >

            <aside class="side-panel">

                <div class="panel-top">

                    <div>

                        <p class="panel-label">
                            BLESSED
                        </p>

                        <h2>
                            Корзина
                        </h2>

                    </div>


                    <button
                        class="modal-close"
                        type="button"
                        @click="cartOpen = false"
                    >
                        ×
                    </button>

                </div>


                <p
                    v-if="cartProducts.length === 0"
                    class="empty-message"
                >
                    Корзина пуста.
                </p>


                <div
                    v-for="item in cartProducts"
                    :key="
                        item.product_id +
                        '-' +
                        item.size
                    "
                    class="panel-product cart-product"
                >

                    <img
                        :src="imageUrl(item)"
                        :alt="item.name"
                    >


                    <div>

                        <strong>
                            {{ item.name }}
                        </strong>


                        <span>
                            {{ item.brand || "BLESSED" }}
                        </span>


                        <span v-if="item.size">
                            Размер: {{ item.size }}
                        </span>


                        <b>
                            {{ price(item.price) }}
                        </b>


                        <div class="quantity-controls">

                            <button
                                type="button"
                                @click.stop="
                                    changeQuantity(
                                        item.product_id,
                                        item.size,
                                        item.quantity - 1
                                    )
                                "
                            >
                                −
                            </button>


                            <span>
                                {{ item.quantity }}
                            </span>


                            <button
                                type="button"
                                @click.stop="
                                    changeQuantity(
                                        item.product_id,
                                        item.size,
                                        item.quantity + 1
                                    )
                                "
                            >
                                +
                            </button>

                        </div>


                        <button
                            class="remove-link"
                            type="button"
                            @click.stop="
                                removeItem(
                                    item.product_id,
                                    item.size
                                )
                            "
                        >
                            Удалить
                        </button>

                    </div>

                </div>


                <div
                    v-if="cartProducts.length"
                    class="cart-bottom"
                >

                    <div class="cart-total">

                        <span>
                            Итого
                        </span>


                        <strong>
                            {{ price(total) }}
                        </strong>

                    </div>


                    <button
                        class="main-button"
                        type="button"
                        @click="checkout"
                    >
                        Оформить заказ
                    </button>

                </div>

            </aside>

        </div>

    </header>

</template>


<script setup>

import {
    computed,
    onMounted,
    ref
} from "vue";


import {
    store,
    changeCartQuantity,
    removeFromCart,
    makeOrder,
    logout
} from "../store";


import {
    getProducts,
    searchProductsByPhoto
} from "../api";


import {
    products as localProducts
} from "../products";


/* =====================================================
   PRODUCTS
===================================================== */

const products = ref([]);


/* =====================================================
   SEARCH
===================================================== */

const search = ref("");

const searchOpen = ref(false);


/* =====================================================
   FAVORITES
===================================================== */

const favoritesOpen = ref(false);


/* =====================================================
   NOTIFICATIONS
===================================================== */

const notificationCount = ref(0);


function updateNotificationCount() {

    const readNotifications = JSON.parse(
        localStorage.getItem(
            "blessedReadNotifications"
        ) || "[]"
    );


    notificationCount.value =
        store.orders.filter(order => {

            const notificationId =
                `order-${order.id}-${order.status}`;

            return !readNotifications.includes(
                notificationId
            );

        }).length;

}


window.addEventListener(
    "notifications-updated",
    updateNotificationCount
);


/* =====================================================
   CART
===================================================== */

const cartOpen = ref(false);


/* =====================================================
   PHOTO SEARCH
===================================================== */

const photoInput = ref(null);

const aiSearching = ref(false);

const aiDescription = ref("");

const aiResults = ref([]);


/* =====================================================
   THEME
===================================================== */

const darkMode = ref(
    localStorage.getItem(
        "blessedTheme"
    ) === "dark"
);


/* =====================================================
   ADMIN
===================================================== */

const isAdmin = computed(() => {

    return (
        !!store.user &&
        store.user.role === "admin"
    );

});


/* =====================================================
   THEME
===================================================== */

function applyTheme() {

    document.documentElement.classList.toggle(
        "theme-dark",
        darkMode.value
    );


    localStorage.setItem(
        "blessedTheme",
        darkMode.value
            ? "dark"
            : "light"
    );

}


function toggleTheme() {

    darkMode.value =
        !darkMode.value;

    applyTheme();

}


/* =====================================================
   ADMIN LOGOUT
===================================================== */

function logoutUser() {

    logout();

    document.documentElement.classList.remove(
        "admin-mode"
    );

    window.location.href = "/";

}


/* =====================================================
   MOUNT
===================================================== */

onMounted(async () => {

    applyTheme();

    updateNotificationCount();


    if (!isAdmin.value) {

        try {

            products.value =
                await getProducts();

        } catch (error) {

            console.error(error);

            products.value =
                localProducts;

        }

    }

});


/* =====================================================
   SEARCH RESULTS
===================================================== */

const searchResults = computed(() => {

    const value =
        search.value
            .toLowerCase()
            .trim();


    if (!value) {

        return [];

    }


    return products.value.filter(
        product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();


            const brand =
                String(
                    product.brand || ""
                ).toLowerCase();


            const type =
                String(
                    product.type || ""
                ).toLowerCase();


            return (
                name.includes(value) ||
                brand.includes(value) ||
                type.includes(value)
            );

        }
    );

});


/* =====================================================
   SEARCH
===================================================== */

function openSearch() {

    searchOpen.value = true;

}


function closeSearch() {

    searchOpen.value = false;

    search.value = "";

}


/* =====================================================
   PHOTO SEARCH
===================================================== */

function openPhotoPicker() {

    photoInput.value?.click();

}


function fileToDataUrl(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                resolve(
                    reader.result
                );

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Не удалось прочитать фотографию."
                    )
                );

            };


            reader.readAsDataURL(file);

        }
    );

}


async function onPhotoSelected(event) {

    const file =
        event.target.files?.[0];


    event.target.value = "";


    aiDescription.value = "";

    aiResults.value = [];


    if (!file) {

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert(
            "Можно загрузить только изображение."
        );

        return;

    }


    if (file.size > 5 * 1024 * 1024) {

        alert(
            "Фото должно быть не больше 5 МБ."
        );

        return;

    }


    try {

        aiSearching.value = true;


        const image =
            await fileToDataUrl(file);


        const result =
            await searchProductsByPhoto(
                image
            );


        aiDescription.value =
            result.description || "";


        aiResults.value =
            Array.isArray(
                result.products
            )
                ? result.products
                : [];

    } catch (error) {

        console.error(
            "AI PHOTO SEARCH:",
            error
        );


        alert(
            error.message ||
            "Не удалось выполнить поиск по фото."
        );

    } finally {

        aiSearching.value = false;

    }

}


/* =====================================================
   IMAGE
===================================================== */

function imageUrl(product) {

    const image =
        product?.images?.[0] ||
        product?.image ||
        "";


    if (!image) {

        return "";

    }


    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("/")
    ) {

        return image;

    }


    return "/" + image;

}


/* =====================================================
   PRICE
===================================================== */

function price(value) {

    return Number(value)
        .toLocaleString("ru-RU") +
        " ₸";

}


/* =====================================================
   CART
===================================================== */

const cartProducts = computed(() => {

    return store.cart;

});


const cartCount = computed(() => {

    return store.cart.reduce(
        (sum, item) =>
            sum +
            Number(
                item.quantity || 0
            ),
        0
    );

});


const total = computed(() => {

    return store.cart.reduce(
        (sum, item) =>
            sum +
            Number(
                item.price || 0
            ) *
            Number(
                item.quantity || 0
            ),
        0
    );

});


function openCart() {

    if (!store.user) {

        alert(
            "Сначала войдите в аккаунт."
        );

        return;

    }


    cartOpen.value = true;

}


function openFavorites() {

    if (!store.user) {

        alert(
            "Сначала войдите в аккаунт."
        );

        return;

    }


    favoritesOpen.value = true;

}


/* =====================================================
   CART ACTIONS
===================================================== */

async function changeQuantity(
    productId,
    size,
    quantity
) {

    try {

        await changeCartQuantity(
            productId,
            size,
            quantity
        );

    } catch (error) {

        alert(
            error.message
        );

    }

}


async function removeItem(
    productId,
    size
) {

    try {

        await removeFromCart(
            productId,
            size
        );

    } catch (error) {

        alert(
            error.message
        );

    }

}


async function checkout() {

    if (!store.user) {

        alert(
            "Сначала войдите в аккаунт."
        );

        return;

    }


    if (!store.user.address) {

        alert(
            "Сначала укажите адрес в личном кабинете."
        );

        cartOpen.value = false;

        return;

    }


    try {

        await makeOrder();

        cartOpen.value = false;


        alert(
            "Заказ успешно оформлен."
        );

    } catch (error) {

        alert(
            error.message
        );

    }

}

</script>


<style>

/* =====================================================
   HEADER VARIABLES
===================================================== */

:root {

    --header-bg: #ebe9e2;
    --header-text: #111;
    --header-border: #111;
    --header-muted: #777;

}


html.theme-dark {

    --header-bg: #0d0d0d;
    --header-text: #f5f5f5;
    --header-border: #444;
    --header-muted: #888;

}


/* =====================================================
   HEADER
===================================================== */

.header {

    position: sticky;

    top: 0;

    z-index: 500;

    height: 70px;

    display: grid;

    grid-template-columns:
        1fr auto 1fr;

    align-items: center;

    padding: 0 38px;

    background:
        var(--header-bg);

    color:
        var(--header-text);

    border-bottom:
        1px solid var(--header-border);

    transition:
        background-color .25s ease,
        color .25s ease,
        border-color .25s ease;

}


.logo {

    color:
        var(--header-text);

    font-size:
        27px;

    font-weight:
        800;

    letter-spacing:
        4px;

}


.navigation {

    display:
        flex;

    gap:
        28px;

}


.navigation a {

    position:
        relative;

    color:
        var(--header-text);

    font-size:
        10px;

    text-transform:
        uppercase;

    letter-spacing:
        1px;

}


.navigation a::after {

    content:
        "";

    position:
        absolute;

    left:
        0;

    bottom:
        -6px;

    width:
        0;

    height:
        1px;

    background:
        var(--header-text);

    transition:
        .2s;

}


.navigation a:hover::after,
.navigation a.router-link-exact-active::after {

    width:
        100%;

}


/* =====================================================
   HEADER ACTIONS
===================================================== */

.header-actions {

    display:
        flex;

    align-items:
        center;

    justify-content:
        flex-end;

    gap:
        5px;

}


.header-button {

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    min-height:
        34px;

    gap:
        5px;

    padding:
        0 9px;

    border:
        1px solid transparent;

    background:
        transparent;

    color:
        var(--header-text);

    font-size:
        9px;

    text-transform:
        uppercase;

    letter-spacing:
        .8px;

    transition:
        .2s;

}


.header-button:hover {

    border-color:
        var(--header-text);

}


.theme-button {

    width:
        34px;

    padding:
        0;

    border-color:
        transparent;

    font-size:
        15px;

}


.theme-button:hover {

    background:
        var(--header-text);

    color:
        var(--header-bg);

}


.profile-link {

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    min-height:
        34px;

    padding:
        0 13px;

    margin-right:
        4px;

    border:
        1px solid var(--header-text);

    color:
        var(--header-text);

    font-size:
        9px;

    text-transform:
        uppercase;

    letter-spacing:
        1px;

    transition:
        .2s;

}


.profile-link:hover {

    background:
        var(--header-text);

    color:
        var(--header-bg);

}


/* =====================================================
   ADMIN HEADER
===================================================== */

.admin-header {

    grid-template-columns:
        1fr auto 1fr;

    background:
        #090909 !important;

    color:
        #fff !important;

    border-bottom:
        1px solid #2d2d2d !important;

}


.admin-header .logo {

    color:
        #fff !important;

}


.admin-header-center {

    color:
        #777;

    font-size:
        9px;

    letter-spacing:
        4px;

    text-transform:
        uppercase;

}


.admin-header-actions {

    display:
        flex;

    align-items:
        center;

    justify-content:
        flex-end;

    gap:
        20px;

}


.admin-user-block {

    display:
        flex;

    align-items:
        flex-end;

    flex-direction:
        column;

    gap:
        3px;

}


.admin-user-label {

    color:
        #555;

    font-size:
        7px;

    letter-spacing:
        2px;

}


.admin-user-block strong {

    color:
        #fff;

    font-size:
        11px;

    font-weight:
        500;

    text-transform:
        uppercase;

}


.admin-logout {

    min-height:
        34px;

    padding:
        0 15px;

    border:
        1px solid #555;

    background:
        transparent;

    color:
        #fff;

    font-size:
        9px;

    text-transform:
        uppercase;

    letter-spacing:
        1px;

    cursor:
        pointer;

    transition:
        .2s;

}


.admin-logout:hover {

    background:
        #fff;

    color:
        #111;

}


/* =====================================================
   OVERLAY
===================================================== */

.overlay {

    position:
        fixed;

    inset:
        0;

    z-index:
        1000;

    display:
        flex;

    justify-content:
        center;

    align-items:
        flex-start;

    padding:
        100px 20px 30px;

    background:
        rgba(0, 0, 0, .55);

    overflow:
        auto;

}


html.theme-dark .overlay {

    background:
        rgba(0, 0, 0, .82);

}


/* =====================================================
   SEARCH MODAL
===================================================== */

.search-modal {

    position:
        relative;

    width:
        min(820px, 100%);

    max-height:
        calc(100vh - 130px);

    overflow:
        auto;

    padding:
        48px;

    background:
        var(--header-bg);

    color:
        var(--header-text);

    border:
        1px solid var(--header-text);

}


.modal-close {

    position:
        absolute;

    top:
        18px;

    right:
        18px;

    width:
        35px;

    height:
        35px;

    border:
        1px solid var(--header-text);

    background:
        transparent;

    color:
        var(--header-text);

    font-size:
        22px;

    cursor:
        pointer;

}


.section-label,
.panel-label {

    margin:
        0 0 12px;

    color:
        var(--header-muted);

    font-size:
        9px;

    letter-spacing:
        2px;

    text-transform:
        uppercase;

}


.search-modal h2 {

    margin:
        0 0 28px;

    color:
        var(--header-text);

    font-size:
        52px;

    font-weight:
        400;

    letter-spacing:
        -3px;

}


.big-search {

    width:
        100%;

    padding:
        15px 0;

    border:
        0;

    border-bottom:
        1px solid var(--header-text);

    outline:
        none;

    background:
        transparent;

    color:
        var(--header-text);

    font-size:
        20px;

}


.big-search::placeholder {

    color:
        var(--header-muted);

}


.photo-search-button {

    margin-top:
        22px;

    min-height:
        44px;

    padding:
        0 18px;

    border:
        1px solid var(--header-text);

    background:
        var(--header-text);

    color:
        var(--header-bg);

    font-size:
        9px;

    letter-spacing:
        1.2px;

    text-transform:
        uppercase;

    cursor:
        pointer;

}


.ai-photo-status {

    margin-top:
        20px;

    color:
        var(--header-muted);

    font-size:
        12px;

}


.ai-photo-description {

    margin-top:
        20px;

    padding:
        15px;

    border:
        1px solid var(--header-border);

    font-size:
        13px;

    line-height:
        1.5;

}


.ai-photo-title {

    margin:
        35px 0 12px;

    color:
        var(--header-muted);

    font-size:
        9px;

    text-transform:
        uppercase;

    letter-spacing:
        2px;

}


.search-list {

    margin-top:
        30px;

}


.search-product {

    display:
        grid;

    grid-template-columns:
        75px 1fr auto;

    align-items:
        center;

    gap:
        15px;

    min-height:
        85px;

    padding:
        10px 0;

    border-top:
        1px solid var(--soft-border);

    color:
        var(--header-text);

}


.search-product img {

    width:
        75px;

    height:
        85px;

    object-fit:
        cover;

}


.search-product div {

    display:
        flex;

    flex-direction:
        column;

    gap:
        5px;

}


.search-product strong {

    color:
        var(--header-text);

    font-size:
        13px;

}


.search-product span {

    color:
        var(--header-muted);

    font-size:
        10px;

}


.search-product b {

    color:
        var(--header-text);

    font-size:
        11px;

}


/* =====================================================
   SIDE PANEL
===================================================== */

.side-panel {

    position:
        fixed;

    top:
        0;

    right:
        0;

    z-index:
        1100;

    width:
        min(440px, 100%);

    height:
        100vh;

    padding:
        35px 28px;

    background:
        var(--header-bg);

    color:
        var(--header-text);

    border-left:
        1px solid var(--header-border);

    overflow:
        auto;

}


.panel-top {

    display:
        flex;

    align-items:
        flex-start;

    justify-content:
        space-between;

    margin-bottom:
        30px;

}


.panel-top h2 {

    margin:
        0;

    color:
        var(--header-text);

    font-size:
        38px;

    font-weight:
        400;

    letter-spacing:
        -2px;

}


.empty-message {

    color:
        var(--header-muted);

    font-size:
        12px;

}


/* =====================================================
   PANEL PRODUCT
===================================================== */

.panel-product {

    display:
        grid;

    grid-template-columns:
        85px 1fr;

    gap:
        15px;

    padding:
        14px 0;

    border-top:
        1px solid var(--soft-border);

    color:
        var(--header-text);

}


.panel-product img {

    width:
        85px;

    height:
        108px;

    object-fit:
        cover;

}


.panel-product > div {

    display:
        flex;

    flex-direction:
        column;

    gap:
        6px;

}


.panel-product strong {

    color:
        var(--header-text);

    font-size:
        12px;

    font-weight:
        500;

}


.panel-product span {

    color:
        var(--header-muted);

    font-size:
        10px;

}


.panel-product b {

    color:
        var(--header-text);

    margin-top:
        3px;

    font-size:
        11px;

}


/* =====================================================
   QUANTITY
===================================================== */

.quantity-controls {

    display:
        flex;

    align-items:
        center;

    gap:
        10px;

    margin-top:
        5px;

}


.quantity-controls button {

    width:
        28px;

    height:
        28px;

    border:
        1px solid var(--header-border);

    background:
        transparent;

    color:
        var(--header-text);

    cursor:
        pointer;

}


.quantity-controls span {

    min-width:
        20px;

    color:
        var(--header-text);

    text-align:
        center;

}


.remove-link {

    align-self:
        flex-start;

    padding:
        0;

    border:
        0;

    background:
        transparent;

    color:
        #888;

    font-size:
        9px;

    text-transform:
        uppercase;

    cursor:
        pointer;

}


/* =====================================================
   CART
===================================================== */

.cart-bottom {

    position:
        sticky;

    bottom:
        0;

    margin-top:
        25px;

    padding-top:
        20px;

    background:
        var(--header-bg);

    border-top:
        1px solid var(--header-border);

}


.cart-total {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    margin-bottom:
        15px;

}


.cart-total span {

    color:
        var(--header-muted);

    font-size:
        10px;

    text-transform:
        uppercase;

    letter-spacing:
        1px;

}


.cart-total strong {

    color:
        var(--header-text);

    font-size:
        18px;

}


/* =====================================================
   DARK THEME — COMMON
===================================================== */

html.theme-dark body,
html.theme-dark #app {

    background:
        #0e0e0e !important;

    color:
        #f5f5f5 !important;

}


html.theme-dark .hero,
html.theme-dark .catalog-page,
html.theme-dark .product-page,
html.theme-dark .profile-page,
html.theme-dark .quick-catalog,
html.theme-dark .auth-page {

    background:
        #0e0e0e !important;

    color:
        #f5f5f5 !important;

}


html.theme-dark .hero-text,
html.theme-dark .catalog-head,
html.theme-dark .catalog-layout,
html.theme-dark .profile-page {

    color:
        #f5f5f5 !important;

}


/* =====================================================
   DARK THEME — TEXT
===================================================== */

html.theme-dark h1,
html.theme-dark h2,
html.theme-dark h3,
html.theme-dark h4,
html.theme-dark p,
html.theme-dark strong,
html.theme-dark b {

    color:
        #f5f5f5;

}


html.theme-dark .hero-description,
html.theme-dark .catalog-description,
html.theme-dark .eyebrow,
html.theme-dark .catalog-number,
html.theme-dark .profile-note {

    color:
        #888 !important;

}


/* =====================================================
   DARK THEME — PROFILE
===================================================== */

html.theme-dark .profile-card,
html.theme-dark .orders-card {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #444 !important;

}


html.theme-dark .profile-card input,
html.theme-dark .profile-card textarea,
html.theme-dark .profile-card select {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #555 !important;

}


html.theme-dark .profile-card input::placeholder,
html.theme-dark .profile-card textarea::placeholder {

    color:
        #777 !important;

}


/* =====================================================
   DARK THEME — CATALOG
===================================================== */

html.theme-dark .filters,
html.theme-dark .results,
html.theme-dark .filters-top,
html.theme-dark .filter-section,
html.theme-dark .results-top {

    border-color:
        #444 !important;

    color:
        #fff !important;

}


html.theme-dark .filter-title,
html.theme-dark .category-option,
html.theme-dark .subcategory button,
html.theme-dark .radio-list label {

    color:
        #fff !important;

}


html.theme-dark .subcategory {

    border-color:
        #444 !important;

}


html.theme-dark .sizes button {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #555 !important;

}


html.theme-dark .sizes button.active {

    background:
        #fff !important;

    color:
        #111 !important;

}


/* =====================================================
   DARK THEME — CARDS
===================================================== */

html.theme-dark .card-image {

    background:
        #191919 !important;

    border-color:
        #444 !important;

}


html.theme-dark .heart {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #555 !important;

}


html.theme-dark .image-arrow {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #555 !important;

}


/* =====================================================
   DARK THEME — AUTH
===================================================== */

html.theme-dark .auth-page {

    background:
        #0e0e0e !important;

}


html.theme-dark .auth-card {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #444 !important;

}


html.theme-dark .auth-card h1,
html.theme-dark .auth-card p,
html.theme-dark .auth-card label {

    color:
        #fff !important;

}


html.theme-dark .auth-description {

    color:
        #888 !important;

}


html.theme-dark .auth-card input {

    background:
        #171717 !important;

    color:
        #fff !important;

    border-color:
        #555 !important;

}


/* =====================================================
   DARK THEME — STATEMENT
===================================================== */

html.theme-dark .statement {

    background:
        #f5f5f5 !important;

    color:
        #111 !important;

}


html.theme-dark .statement h2,
html.theme-dark .statement p {

    color:
        #111 !important;

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 800px) {

    .header {

        grid-template-columns:
            1fr auto;

        padding:
            0 18px;

    }


    .navigation {

        display:
            none;

    }


    .header-actions {

        gap:
            2px;

    }


    .profile-link {

        padding:
            0 9px;

    }


    .header-button {

        padding:
            0 6px;

    }


    .admin-header {

        grid-template-columns:
            1fr auto;

    }


    .admin-header-center {

        display:
            none;

    }


    .admin-user-block {

        display:
            none;

    }


    .admin-header-actions {

        gap:
            10px;

    }


    .search-modal {

        padding:
            35px 22px;

    }


    .search-modal h2 {

        font-size:
            40px;

    }

}


@media (max-width: 500px) {

    .header {

        height:
            62px;

    }


    .logo {

        font-size:
            21px;

        letter-spacing:
            3px;

    }


    .profile-link {

        font-size:
            8px;

    }


    .header-button {

        min-height:
            30px;

        font-size:
            8px;

    }


    .theme-button {

        width:
            30px;

    }


    .side-panel {

        width:
            100%;

        padding:
            28px 20px;

    }


    .search-product {

        grid-template-columns:
            60px 1fr;

    }


    .search-product img {

        width:
            60px;

        height:
            70px;

    }


    .search-product b {

        display:
            none;

    }

}

</style>