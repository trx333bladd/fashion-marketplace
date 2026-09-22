<template>
    <main class="product-page">

        <RouterLink
            to="/catalog"
            class="back"
        >
            ← Вернуться в каталог
        </RouterLink>


        <div
            v-if="loading"
            class="empty-products"
        >
            Загрузка товара...
        </div>


        <div
            v-else-if="error"
            class="empty-products"
        >
            {{ error }}
        </div>


        <template v-else-if="product">

            <div class="product-layout">

                <section class="product-gallery">

                    <div class="main-photo">

                        <img
                            :src="getImageUrl(product.images[currentImage])"
                            :alt="product.name"
                        >

                        <button
                            v-if="product.images.length > 1"
                            class="gallery-arrow gallery-left"
                            type="button"
                            @click="previousImage"
                        >
                            ←
                        </button>

                        <button
                            v-if="product.images.length > 1"
                            class="gallery-arrow gallery-right"
                            type="button"
                            @click="nextImage"
                        >
                            →
                        </button>

                    </div>


                    <div
                        v-if="product.images.length > 1"
                        class="thumbnails"
                    >

                        <button
                            v-for="(image, index) in product.images"
                            :key="image + index"
                            type="button"
                            :class="{
                                active: currentImage === index
                            }"
                            @click="currentImage = index"
                        >

                            <img
                                :src="getImageUrl(image)"
                                :alt="product.name"
                            >

                        </button>

                    </div>

                </section>


                <section class="product-info-page">

                    <p class="eyebrow">
                        {{ product.type }}
                    </p>

                    <p class="product-brand">
                        {{ product.brand }}
                    </p>

                    <h1>
                        {{ product.name }}
                    </h1>

                    <div class="big-price">
                        {{ formatPrice(product.price) }}
                    </div>


                    <div
                        v-if="recommendedSize"
                        class="recommended-size"
                    >
                        <span>Рекомендуем вам:</span>
                        <strong>{{ recommendedSize }}</strong>
                    </div>


                    <section class="product-section">

                        <div class="section-row">

                            <h2>Размер</h2>

                            <span>
                                {{
                                    selectedSize
                                        ? "Выбран " + selectedSize
                                        : "Выберите размер"
                                }}
                            </span>

                        </div>


                        <div class="product-sizes">

                            <button
                                v-for="size in product.sizes"
                                :key="size"
                                type="button"
                                :class="{
                                    active: selectedSize === size
                                }"
                                @click="selectedSize = size"
                            >
                                {{ size }}
                            </button>

                        </div>

                    </section>


                    <div class="product-buttons">

                        <button
                            class="main-button"
                            type="button"
                            @click="add"
                        >
                            {{ added ? "Добавлено ✓" : "В КОРЗИНУ" }}
                        </button>

                        <button
                            class="second-button"
                            type="button"
                            @click="favorite"
                        >
                            {{ isFavorite ? "♥ Сохранено" : "♡ В ИЗБРАННОЕ" }}
                        </button>

                    </div>


                    <section class="product-section">

                        <h2>О товаре</h2>

                        <p class="long-text">
                            {{ product.description || "Описание товара отсутствует." }}
                        </p>

                    </section>


                    <section class="product-section">

                        <h2>Характеристики</h2>

                        <div class="specs">

                            <div>
                                <span>Бренд</span>
                                <strong>{{ product.brand || "—" }}</strong>
                            </div>

                            <div>
                                <span>Материал</span>
                                <strong>{{ product.material || "—" }}</strong>
                            </div>

                            <div>
                                <span>Цвет</span>
                                <strong>{{ product.color || "—" }}</strong>
                            </div>

                            <div>
                                <span>Сезон</span>
                                <strong>{{ product.season || "—" }}</strong>
                            </div>

                            <div>
                                <span>Стилистика</span>
                                <strong>{{ product.style || "—" }}</strong>
                            </div>

                        </div>

                    </section>


                    <section class="product-section">

                        <h2>Размерная сетка</h2>

                        <div
                            v-if="!isShoes"
                            class="size-chart"
                        >

                            <div class="chart-head">
                                <span>Размер</span>
                                <span>Грудь</span>
                                <span>Талия</span>
                            </div>

                            <div
                                v-for="row in clothingSizes"
                                :key="row.size"
                                class="chart-row"
                                :class="{
                                    active: product.sizes.includes(row.size)
                                }"
                            >

                                <span>{{ row.size }}</span>
                                <span>{{ row.chest }}</span>
                                <span>{{ row.waist }}</span>

                            </div>

                        </div>


                        <div
                            v-else
                            class="size-chart"
                        >

                            <div class="chart-head shoe-head">
                                <span>EU</span>
                                <span>Стопа</span>
                            </div>

                            <div
                                v-for="row in shoeSizes"
                                :key="row.size"
                                class="chart-row shoe-row"
                                :class="{
                                    active: product.sizes.includes(row.size)
                                }"
                            >

                                <span>{{ row.size }}</span>
                                <span>{{ row.cm }}</span>

                            </div>

                        </div>

                    </section>

                </section>

            </div>


            <!-- =========================
                 RECENT PRODUCTS
            ========================== -->

            <section
                v-if="recentProducts.length > 1"
                class="recent-products"
            >

                <div class="recent-products-head">

                    <p class="eyebrow">
                        ВЫ СМОТРЕЛИ
                    </p>

                    <h2>
                        Недавно просмотренные
                    </h2>

                </div>


                <div class="recent-products-grid">

                    <RouterLink
                        v-for="item in recentProducts.filter(
                            item =>
                                Number(item.id) !==
                                Number(product.id)
                        )"
                        :key="item.id"
                        :to="'/product/' + item.id"
                        class="recent-product-card"
                    >

                        <div class="recent-product-image">

                            <img
                                :src="getImageUrl(item.images?.[0])"
                                :alt="item.name"
                            >

                        </div>


                        <div class="recent-product-info">

                            <span>
                                {{ item.brand || item.type || "BLESSED" }}
                            </span>

                            <strong>
                                {{ item.name }}
                            </strong>

                            <b>
                                {{ formatPrice(item.price) }}
                            </b>

                        </div>

                    </RouterLink>

                </div>

            </section>

        </template>


        <div
            v-else
            class="empty-products"
        >
            Товар не найден.
        </div>

    </main>
</template>


<script setup>

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    useRoute
} from "vue-router";

import {
    getProducts
} from "../api";

import {
    store,
    addToCart,
    toggleFavorite
} from "../store";


const route = useRoute();


const products = ref([]);


const loading = ref(true);


const error = ref("");


const currentImage = ref(0);


const selectedSize = ref("");


const added = ref(false);


const recentProducts = ref([]);


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    try {

        loading.value = true;

        error.value = "";


        products.value = await getProducts();


        /* =========================
           RECENT PRODUCTS
        ========================== */

        const currentProduct =
            products.value.find(
                item =>
                    Number(item.id) ===
                    Number(route.params.id)
            );


        if (currentProduct) {

            let recent =
                JSON.parse(
                    localStorage.getItem(
                        "recentProducts"
                    ) || "[]"
                );


            recent =
                recent.filter(
                    item =>
                        Number(item.id) !==
                        Number(currentProduct.id)
                );


            recent.unshift(
                currentProduct
            );


            recent =
                recent.slice(0, 6);


            localStorage.setItem(
                "recentProducts",
                JSON.stringify(recent)
            );


            recentProducts.value =
                recent;

        }

    } catch (err) {

        console.error(err);

        error.value =
            "Не удалось загрузить товар.";

    } finally {

        loading.value = false;

    }

}


onMounted(loadProducts);


/* =========================
   CURRENT PRODUCT
========================= */

const product = computed(() => {

    return products.value.find(
        item =>
            Number(item.id) ===
            Number(route.params.id)
    );

});


/* =========================
   SHOES
========================= */

const isShoes = computed(() => {

    if (!product.value) {
        return false;
    }


    const category =
        String(
            product.value.category || ""
        ).toLowerCase();


    const type =
        String(
            product.value.type || ""
        ).toLowerCase();


    return category === "shoes" ||
        category === "обувь" ||
        type.includes("обув") ||
        type.includes("кроссов") ||
        type.includes("тапоч");

});


/* =========================
   FAVORITE
========================= */

const isFavorite = computed(() => {

    if (!product.value) {
        return false;
    }


    return store.favorites.some(
        item =>
            Number(
                item.id ||
                item.product_id
            ) ===
            Number(product.value.id)
    );

});


/* =========================
   RECOMMENDED SIZE
========================= */

const recommendedSize = computed(() => {

    if (!product.value || !store.user) {
        return "";
    }


    if (isShoes.value) {

        if (!store.user.shoe_size) {
            return "";
        }


        const size =
            String(
                store.user.shoe_size
            );


        return product.value.sizes.includes(
            size
        )
            ? size
            : "";

    }


    const weight =
        Number(
            store.user.weight
        );


    if (!weight) {
        return "";
    }


    let size = "M";


    if (weight <= 65) {

        size = "S";

    } else if (weight <= 80) {

        size = "M";

    } else if (weight <= 95) {

        size = "L";

    } else {

        size = "XL";

    }


    return product.value.sizes.includes(
        size
    )
        ? size
        : "";

});


/* =========================
   CLOTHING SIZE CHART
========================= */

const clothingSizes = [

    {
        size: "XS",
        chest: "82–86 см",
        waist: "62–66 см"
    },

    {
        size: "S",
        chest: "86–92 см",
        waist: "66–72 см"
    },

    {
        size: "M",
        chest: "92–98 см",
        waist: "72–78 см"
    },

    {
        size: "L",
        chest: "98–104 см",
        waist: "78–84 см"
    },

    {
        size: "XL",
        chest: "104–110 см",
        waist: "84–90 см"
    }

];


/* =========================
   SHOE SIZE CHART
========================= */

const shoeSizes = [

    {
        size: "36",
        cm: "23 см"
    },

    {
        size: "37",
        cm: "23.5 см"
    },

    {
        size: "38",
        cm: "24 см"
    },

    {
        size: "39",
        cm: "25 см"
    },

    {
        size: "40",
        cm: "25.5 см"
    },

    {
        size: "41",
        cm: "26 см"
    },

    {
        size: "42",
        cm: "27 см"
    },

    {
        size: "43",
        cm: "28 см"
    },

    {
        size: "44",
        cm: "28.5 см"
    },

    {
        size: "45",
        cm: "29 см"
    }

];


/* =========================
   IMAGE URL
========================= */

function getImageUrl(image) {

    if (!image) {
        return "";
    }


    const path =
        String(image).trim();


    if (
        /^https?:\/\//i.test(path) ||
        path.startsWith("/")
    ) {

        return path;

    }


    return "/" + path;

}


/* =========================
   PRICE
========================= */

function formatPrice(value) {

    return Number(value)
        .toLocaleString("ru-RU") +
        " ₸";

}


/* =========================
   GALLERY
========================= */

function nextImage() {

    if (
        !product.value ||
        product.value.images.length <= 1
    ) {

        return;

    }


    currentImage.value =
        (
            currentImage.value + 1
        ) %
        product.value.images.length;

}


function previousImage() {

    if (
        !product.value ||
        product.value.images.length <= 1
    ) {

        return;

    }


    currentImage.value =
        (
            currentImage.value -
            1 +
            product.value.images.length
        ) %
        product.value.images.length;

}


/* =========================
   ADD TO CART
========================= */

async function add() {

    if (!product.value) {
        return;
    }


    if (!store.user) {

        alert(
            "Сначала войдите в аккаунт."
        );

        return;

    }


    if (!selectedSize.value) {

        alert(
            "Сначала выберите размер."
        );

        return;

    }


    try {

        await addToCart(
            product.value.id,
            selectedSize.value
        );


        added.value = true;

    } catch (err) {

        alert(err.message);

    }

}


/* =========================
   FAVORITE
========================= */

async function favorite() {

    if (!product.value) {
        return;
    }


    if (!store.user) {

        alert(
            "Сначала войдите в аккаунт."
        );

        return;

    }


    try {

        await toggleFavorite(
            product.value.id
        );

    } catch (err) {

        alert(err.message);

    }

}

</script>

<style scoped>

/* =========================================
   RECENT PRODUCTS
========================================= */

.recent-products {
    width: 100%;
    max-width: 1400px;
    margin: 80px auto 0;
    padding: 0 40px 100px;
    box-sizing: border-box;
}

.recent-products-head {
    margin-bottom: 28px;
}

.recent-products-head .eyebrow {
    margin: 0 0 8px;
    font-size: 9px;
    letter-spacing: 2.5px;
    color: #777;
    text-transform: uppercase;
}

.recent-products-head h2 {
    margin: 0;
    font-size: 32px;
    line-height: 1;
    font-weight: 400;
    letter-spacing: -1px;
}


/* =========================================
   GRID
========================================= */

.recent-products-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
}


/* =========================================
   CARD
========================================= */

.recent-product-card {
    display: block;
    min-width: 0;
    color: #111;
    text-decoration: none;
    transition: transform .25s ease;
}

.recent-product-card:hover {
    transform: translateY(-4px);
}


/* =========================================
   IMAGE
========================================= */

.recent-product-image {
    width: 100%;
    height: 320px;
    overflow: hidden;
    background: #eeeae3;
}

.recent-product-image img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform .35s ease;
}

.recent-product-card:hover .recent-product-image img {
    transform: scale(1.04);
}


/* =========================================
   INFO
========================================= */

.recent-product-info {
    padding: 13px 2px 0;
}

.recent-product-info span {
    display: block;
    margin-bottom: 6px;
    color: #777;
    font-size: 8px;
    line-height: 1;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

.recent-product-info strong {
    display: block;
    margin-bottom: 8px;
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.recent-product-info b {
    display: block;
    font-size: 12px;
    font-weight: 500;
}


/* =========================================
   TABLET
========================================= */

@media (max-width: 1000px) {

    .recent-products {
        padding-left: 25px;
        padding-right: 25px;
    }

    .recent-products-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .recent-product-image {
        height: 300px;
    }

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 700px) {

    .recent-products {
        margin-top: 55px;
        padding: 0 18px 70px;
    }

    .recent-products-head h2 {
        font-size: 26px;
    }

    .recent-products-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
    }

    .recent-product-image {
        height: 240px;
    }

}


/* =========================================
   SMALL MOBILE
========================================= */

@media (max-width: 450px) {

    .recent-products-grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .recent-product-image {
        height: 210px;
    }

    .recent-product-info strong {
        font-size: 11px;
    }

    .recent-product-info b {
        font-size: 11px;
    }

}

</style>