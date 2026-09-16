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


        <div
            v-else-if="product"
            class="product-layout"
        >

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

import { useRoute } from "vue-router";

import { getProducts } from "../api";

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


async function loadProducts() {

    try {

        loading.value = true;
        error.value = "";

        products.value = await getProducts();

    } catch (err) {

        console.error(err);
        error.value = "Не удалось загрузить товар.";

    } finally {

        loading.value = false;

    }

}


onMounted(loadProducts);


const product = computed(() => {

    return products.value.find(item =>
        Number(item.id) === Number(route.params.id)
    );

});


const isShoes = computed(() => {

    if (!product.value) {
        return false;
    }

    const category = String(product.value.category || "").toLowerCase();
    const type = String(product.value.type || "").toLowerCase();

    return category === "shoes" ||
        category === "обувь" ||
        type.includes("обув") ||
        type.includes("кроссов") ||
        type.includes("тапоч");

});


const isFavorite = computed(() => {

    if (!product.value) {
        return false;
    }

    return store.favorites.some(item =>
        Number(item.id || item.product_id) === Number(product.value.id)
    );

});


const recommendedSize = computed(() => {

    if (!product.value || !store.user) {
        return "";
    }

    if (isShoes.value) {

        if (!store.user.shoe_size) {
            return "";
        }

        const size = String(store.user.shoe_size);

        return product.value.sizes.includes(size) ? size : "";

    }

    const weight = Number(store.user.weight);

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

    return product.value.sizes.includes(size) ? size : "";

});


const clothingSizes = [
    { size: "XS", chest: "82–86 см", waist: "62–66 см" },
    { size: "S", chest: "86–92 см", waist: "66–72 см" },
    { size: "M", chest: "92–98 см", waist: "72–78 см" },
    { size: "L", chest: "98–104 см", waist: "78–84 см" },
    { size: "XL", chest: "104–110 см", waist: "84–90 см" }
];


const shoeSizes = [
    { size: "36", cm: "23 см" },
    { size: "37", cm: "23.5 см" },
    { size: "38", cm: "24 см" },
    { size: "39", cm: "25 см" },
    { size: "40", cm: "25.5 см" },
    { size: "41", cm: "26 см" },
    { size: "42", cm: "27 см" },
    { size: "43", cm: "28 см" },
    { size: "44", cm: "28.5 см" },
    { size: "45", cm: "29 см" }
];


function getImageUrl(image) {

    if (!image) {
        return "";
    }

    const path = String(image).trim();

    if (/^https?:\/\//i.test(path) || path.startsWith("/")) {
        return path;
    }

    return "/" + path;

}


function formatPrice(value) {

    return Number(value).toLocaleString("ru-RU") + " ₸";

}


function nextImage() {

    if (!product.value || product.value.images.length <= 1) {
        return;
    }

    currentImage.value =
        (currentImage.value + 1) % product.value.images.length;

}


function previousImage() {

    if (!product.value || product.value.images.length <= 1) {
        return;
    }

    currentImage.value =
        (currentImage.value - 1 + product.value.images.length) % product.value.images.length;

}


async function add() {

    if (!product.value) {
        return;
    }

    if (!store.user) {
        alert("Сначала войдите в аккаунт.");
        return;
    }

    if (!selectedSize.value) {
        alert("Сначала выберите размер.");
        return;
    }

    try {

        await addToCart(product.value.id, selectedSize.value);
        added.value = true;

    } catch (err) {

        alert(err.message);

    }

}


async function favorite() {

    if (!product.value) {
        return;
    }

    if (!store.user) {
        alert("Сначала войдите в аккаунт.");
        return;
    }

    try {

        await toggleFavorite(product.value.id);

    } catch (err) {

        alert(err.message);

    }

}

</script>
