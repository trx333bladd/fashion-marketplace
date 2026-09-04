<template>

    <main class="product-page">

        <RouterLink
            to="/catalog"
            class="back"
        >
            ← Вернуться в каталог
        </RouterLink>


        <div
            v-if="product"
            class="product-layout"
        >

            <section class="product-gallery">

                <div class="main-photo">

                    <img
                        :src="product.images[currentImage]"
                        :alt="product.name"
                    >


                    <button
                        v-if="product.images.length > 1"
                        class="gallery-arrow gallery-left"
                        @click="previousImage"
                    >
                        ←
                    </button>


                    <button
                        v-if="product.images.length > 1"
                        class="gallery-arrow gallery-right"
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
                        :key="image"
                        :class="{
                            active: currentImage === index
                        }"
                        @click="currentImage = index"
                    >

                        <img
                            :src="image"
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
                    {{ product.price.toLocaleString("ru-RU") }} ₸
                </div>


                <!-- РАЗМЕР -->

                <section class="product-section">

                    <div class="section-row">

                        <h2>
                            Размер
                        </h2>

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
                            :class="{
                                active: selectedSize === size
                            }"
                            @click="selectedSize = size"
                        >
                            {{ size }}
                        </button>

                    </div>

                </section>


                <!-- КНОПКИ -->

                <div class="product-buttons">

                    <button
                        class="main-button"
                        @click="add"
                    >
                        {{ added ? "Добавлено ✓" : "В КОРЗИНУ" }}
                    </button>


                    <button
                        class="second-button"
                        @click="favorite"
                    >
                        {{
                            isFavorite
                                ? "♥ Сохранено"
                                : "♡ В ИЗБРАННОЕ"
                        }}
                    </button>

                </div>


                <!-- ОПИСАНИЕ -->

                <section class="product-section">

                    <h2>
                        О товаре
                    </h2>

                    <p class="long-text">
                        {{ product.description }}
                    </p>

                </section>


                <!-- ХАРАКТЕРИСТИКИ -->

                <section class="product-section">

                    <h2>
                        Характеристики
                    </h2>

                    <div class="specs">

                        <div>
                            <span>Бренд</span>
                            <strong>{{ product.brand }}</strong>
                        </div>

                        <div>
                            <span>Материал</span>
                            <strong>{{ product.material }}</strong>
                        </div>

                        <div>
                            <span>Цвет</span>
                            <strong>{{ product.color }}</strong>
                        </div>

                        <div>
                            <span>Сезон</span>
                            <strong>{{ product.season }}</strong>
                        </div>

                        <div>
                            <span>Стилистика</span>
                            <strong>{{ product.style }}</strong>
                        </div>

                    </div>

                </section>


                <!-- РАЗМЕРНАЯ СЕТКА -->

                <section class="product-section">

                    <h2>
                        Размерная сетка
                    </h2>


                    <div
                        v-if="product.category !== 'shoes'"
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
                                active:
                                    product.sizes.includes(row.size)
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
                                active:
                                    product.sizes.includes(row.size)
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

import { computed, ref } from "vue";

import { useRoute } from "vue-router";

import { products } from "../products";

import {
    store,
    addToCart,
    toggleFavorite
} from "../store";


const route = useRoute();


const currentImage = ref(0);

const selectedSize = ref("");

const added = ref(false);


const product = computed(() => {

    return products.find(product =>
        product.id === route.params.id
    );

});


const isFavorite = computed(() => {

    if (!product.value) {
        return false;
    }

    return store.favorites.includes(
        product.value.id
    );

});


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


function nextImage() {

    currentImage.value =
        (currentImage.value + 1) %
        product.value.images.length;

}


function previousImage() {

    currentImage.value =
        (currentImage.value - 1 + product.value.images.length) %
        product.value.images.length;

}


function add() {

    if (!product.value) {
        return;
    }


    if (!selectedSize.value) {

        alert("Сначала выберите размер.");

        return;

    }


    addToCart(
        product.value.id,
        selectedSize.value
    );


    added.value = true;

}


function favorite() {

    if (!product.value) {
        return;
    }

    toggleFavorite(
        product.value.id
    );

}

</script>