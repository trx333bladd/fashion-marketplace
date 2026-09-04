<template>

    <main class="catalog-page">

        <div class="catalog-head">

            <div>

                <p class="eyebrow">
                    {{ eyebrow }}
                </p>

                <h1>
                    {{ title }}
                </h1>

                <p class="catalog-description">
                    {{ description }}
                </p>

            </div>

            <div class="catalog-number">
                {{ filteredProducts.length }} товаров
            </div>

        </div>


        <div class="catalog-layout">

            <!-- ЛЕВАЯ ПАНЕЛЬ -->

            <aside class="filters">

                <div class="filters-top">

                    <span>
                        ФИЛЬТРЫ
                    </span>

                    <button @click="resetFilters">
                        СБРОСИТЬ
                    </button>

                </div>


                <!-- КАТЕГОРИЯ -->

                <section class="filter-section">

                    <button
                        class="filter-title"
                        @click="categoryOpen = !categoryOpen"
                    >
                        <span>Категория</span>
                        <span>
                            {{ categoryOpen ? "−" : "+" }}
                        </span>
                    </button>


                    <div v-if="categoryOpen">

                        <button
                            class="category-option"
                            :class="{ active: category === 'men' }"
                            @click="setCategory('men')"
                        >
                            <span>Мужское</span>
                            <b>{{ countCategory("men") }}</b>
                        </button>


                        <div
                            v-if="category === 'men'"
                            class="subcategory"
                        >

                            <button
                                v-for="type in categoryTypes"
                                :key="type"
                                :class="{
                                    active: selectedType === type
                                }"
                                @click="setType(type)"
                            >
                                <span>
                                    {{ type }}
                                </span>

                                <span>
                                    {{ countType(type) }}
                                </span>
                            </button>

                        </div>


                        <button
                            class="category-option"
                            :class="{ active: category === 'women' }"
                            @click="setCategory('women')"
                        >
                            <span>Женское</span>
                            <b>{{ countCategory("women") }}</b>
                        </button>


                        <div
                            v-if="category === 'women'"
                            class="subcategory"
                        >

                            <button
                                v-for="type in categoryTypes"
                                :key="type"
                                :class="{
                                    active: selectedType === type
                                }"
                                @click="setType(type)"
                            >
                                <span>
                                    {{ type }}
                                </span>

                                <span>
                                    {{ countType(type) }}
                                </span>
                            </button>

                        </div>


                        <button
                            class="category-option"
                            :class="{ active: category === 'shoes' }"
                            @click="setCategory('shoes')"
                        >
                            <span>Обувь</span>
                            <b>{{ countCategory("shoes") }}</b>
                        </button>


                        <div
                            v-if="category === 'shoes'"
                            class="subcategory"
                        >

                            <button
                                v-for="type in categoryTypes"
                                :key="type"
                                :class="{
                                    active: selectedType === type
                                }"
                                @click="setType(type)"
                            >
                                <span>
                                    {{ type }}
                                </span>

                                <span>
                                    {{ countType(type) }}
                                </span>
                            </button>

                        </div>

                    </div>

                </section>


                <!-- СОРТИРОВКА -->

                <section class="filter-section">

                    <button
                        class="filter-title"
                        @click="sortOpen = !sortOpen"
                    >
                        <span>Сортировка</span>
                        <span>
                            {{ sortOpen ? "−" : "+" }}
                        </span>
                    </button>


                    <div
                        v-if="sortOpen"
                        class="radio-list"
                    >

                        <label>
                            <input
                                v-model="sort"
                                value="default"
                                type="radio"
                            >
                            <span>По умолчанию</span>
                        </label>

                        <label>
                            <input
                                v-model="sort"
                                value="popular"
                                type="radio"
                            >
                            <span>По популярности</span>
                        </label>

                        <label>
                            <input
                                v-model="sort"
                                value="cheap"
                                type="radio"
                            >
                            <span>По увеличению цены</span>
                        </label>

                        <label>
                            <input
                                v-model="sort"
                                value="expensive"
                                type="radio"
                            >
                            <span>По уменьшению цены</span>
                        </label>

                    </div>

                </section>


                <!-- РАЗМЕР -->

                <section class="filter-section">

                    <button
                        class="filter-title"
                        @click="sizeOpen = !sizeOpen"
                    >
                        <span>Размер</span>
                        <span>
                            {{ sizeOpen ? "−" : "+" }}
                        </span>
                    </button>


                    <div
                        v-if="sizeOpen"
                        class="sizes"
                    >

                        <button
                            v-for="size in availableSizes"
                            :key="size"
                            :class="{
                                active: selectedSize === size
                            }"
                            @click="setSize(size)"
                        >
                            {{ size }}
                        </button>

                    </div>

                </section>


                <!-- ЦЕНА -->

                <section class="filter-section">

                    <button
                        class="filter-title"
                        @click="priceOpen = !priceOpen"
                    >
                        <span>Цена</span>
                        <span>
                            {{ priceOpen ? "−" : "+" }}
                        </span>
                    </button>


                    <div
                        v-if="priceOpen"
                        class="price-box"
                    >

                        <div class="price-inputs">

                            <label>
                                ОТ

                                <input
                                    v-model.number="minPrice"
                                    type="number"
                                    :min="priceLimit.min"
                                    :max="priceLimit.max"
                                >
                            </label>


                            <label>
                                ДО

                                <input
                                    v-model.number="maxPrice"
                                    type="number"
                                    :min="priceLimit.min"
                                    :max="priceLimit.max"
                                >
                            </label>

                        </div>


                        <input
                            v-model.number="minPrice"
                            type="range"
                            :min="priceLimit.min"
                            :max="priceLimit.max"
                        >


                        <input
                            v-model.number="maxPrice"
                            type="range"
                            :min="priceLimit.min"
                            :max="priceLimit.max"
                        >

                    </div>

                </section>


                <!-- ДОПОЛНИТЕЛЬНЫЕ -->

                <section class="filter-section">

                    <label class="switch">

                        <span>
                            Только в наличии
                        </span>

                        <input
                            v-model="onlyAvailable"
                            type="checkbox"
                        >

                        <i></i>

                    </label>


                    <label class="switch">

                        <span>
                            Только новинки
                        </span>

                        <input
                            v-model="onlyNew"
                            type="checkbox"
                        >

                        <i></i>

                    </label>

                </section>

            </aside>


            <!-- ПРАВАЯ ЧАСТЬ -->

            <section class="results">

                <div class="results-top">

                    <span>
                        {{ filteredProducts.length }} результатов
                    </span>

                    <span>
                        BLESSED / ARCHIVE
                    </span>

                </div>


                <div class="products">

                    <ProductCard
                        v-for="product in filteredProducts"
                        :key="product.id"
                        :product="product"
                    />

                </div>


                <div
                    v-if="filteredProducts.length === 0"
                    class="empty-products"
                >
                    По выбранным параметрам ничего не найдено.
                </div>

            </section>

        </div>

    </main>

</template>


<script setup>

import { computed, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import { products } from "../products";

import ProductCard from "../components/ProductCard.vue";


const route = useRoute();

const router = useRouter();


const categoryOpen = ref(true);
const sortOpen = ref(true);
const sizeOpen = ref(true);
const priceOpen = ref(true);


const category = computed(() => {

    return route.query.category || "all";

});


const selectedType = computed(() => {

    return route.query.type || "";

});


const selectedSize = computed(() => {

    return route.query.size || "";

});


const sort = ref("default");

const minPrice = ref(0);

const maxPrice = ref(60000);

const onlyAvailable = ref(false);

const onlyNew = ref(false);


// =========================
// ТОВАРЫ КАТЕГОРИИ
// =========================

const categoryProducts = computed(() => {

    if (category.value === "all") {
        return products;
    }

    return products.filter(product =>
        product.category === category.value
    );

});


// =========================
// ПОДКАТЕГОРИИ
// =========================

const categoryTypes = computed(() => {

    return [
        ...new Set(
            categoryProducts.value.map(
                product => product.type
            )
        )
    ];

});


// =========================
// РАЗМЕРЫ
// =========================

const availableSizes = computed(() => {

    // ОБУВЬ
    if (category.value === "shoes") {

        return [
            "36",
            "37",
            "38",
            "39",
            "40",
            "41",
            "42",
            "43",
            "44",
            "45"
        ];

    }


    // ДЖИНСЫ
    if (selectedType.value === "Джинсы") {

        return [
            "26",
            "28",
            "30",
            "32",
            "34",
            "36"
        ];

    }


    // ВЕРХНЯЯ ОДЕЖДА
    return [
        "XS",
        "S",
        "M",
        "L",
        "XL"
    ];

});


// =========================
// ЦЕНЫ
// =========================

const priceLimit = computed(() => {

    const prices = categoryProducts.value.map(
        product => product.price
    );

    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };

});


// =========================
// ФИЛЬТРАЦИЯ
// =========================

const filteredProducts = computed(() => {

    let list = [...categoryProducts.value];


    if (selectedType.value) {

        list = list.filter(product =>
            product.type === selectedType.value
        );

    }


    if (selectedSize.value) {

        list = list.filter(product =>
            product.sizes.includes(
                selectedSize.value
            )
        );

    }


    list = list.filter(product => {

        return (
            product.price >= minPrice.value &&
            product.price <= maxPrice.value
        );

    });


    if (onlyAvailable.value) {

        list = list.filter(product =>
            product.status === "В наличии"
        );

    }


    if (onlyNew.value) {

        list = list.filter(product =>
            product.isNew
        );

    }


    if (sort.value === "cheap") {

        list.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sort.value === "expensive") {

        list.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sort.value === "popular") {

        list.sort(
            (a, b) =>
                Number(b.isNew) -
                Number(a.isNew)
        );

    }


    return list;

});


// =========================
// ЗАГОЛОВКИ
// =========================

const title = computed(() => {

    if (category.value === "men") {
        return "Мужское";
    }

    if (category.value === "women") {
        return "Женское";
    }

    if (category.value === "shoes") {
        return "Обувь";
    }

    return "Все товары";

});


const eyebrow = computed(() => {

    if (selectedType.value) {
        return selectedType.value.toUpperCase();
    }

    if (category.value === "men") {
        return "МУЖСКАЯ КОЛЛЕКЦИЯ";
    }

    if (category.value === "women") {
        return "ЖЕНСКАЯ КОЛЛЕКЦИЯ";
    }

    if (category.value === "shoes") {
        return "SHOE ARCHIVE";
    }

    return "BLESSED ARCHIVE";

});


const description = computed(() => {

    if (category.value === "men") {
        return "Футболки, кофты, джинсы, поло.";
    }

    if (category.value === "women") {
        return "Футболки, кофты, джинсы, поло.";
    }

    if (category.value === "shoes") {
        return "Кроссовки, тапочки и обувь.";
    }

    return "Вся коллекция Blessed в одном архиве.";

});


// =========================
// ФУНКЦИИ
// =========================

function countCategory(name) {

    return products.filter(
        product => product.category === name
    ).length;

}


function countType(type) {

    return categoryProducts.value.filter(
        product => product.type === type
    ).length;

}


function setCategory(value) {

    router.push({
        path: "/catalog",
        query: {
            category: value
        }
    });

}


function setType(type) {

    if (selectedType.value === type) {

        router.push({
            path: "/catalog",
            query: {
                category: category.value
            }
        });

        return;
    }


    router.push({
        path: "/catalog",
        query: {
            category: category.value,
            type: type
        }
    });

}


function setSize(size) {

    if (selectedSize.value === size) {

        router.push({
            path: "/catalog",
            query: {
                ...route.query,
                size: undefined
            }
        });

        return;
    }


    router.push({
        path: "/catalog",
        query: {
            ...route.query,
            size
        }
    });

}


function resetFilters() {

    router.push({
        path: "/catalog",
        query: {
            category: category.value
        }
    });


    sort.value = "default";

    minPrice.value = 0;

    maxPrice.value = 60000;

    onlyAvailable.value = false;

    onlyNew.value = false;

}

</script>