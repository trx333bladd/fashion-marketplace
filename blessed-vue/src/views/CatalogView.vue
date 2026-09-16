<template>

    <main class="catalog-page">

        <div class="catalog-head">

            <div>

                <p class="section-label">
                    {{ eyebrow }}
                </p>

                <h1>
                    {{ title }}
                </h1>

            </div>


            <span>
                {{ filteredProducts.length }}
                товаров
            </span>

        </div>


        <div class="catalog-layout">

            <aside class="filters">

                <div class="filter-section">

                    <h3>
                        Категория
                    </h3>


                    <button
                        :class="{
                            active:
                                selectedCategory === 'all'
                        }"
                        @click="setCategory('all')"
                    >
                        Все
                    </button>


                    <button
                        :class="{
                            active:
                                selectedCategory === 'men'
                        }"
                        @click="setCategory('men')"
                    >
                        Мужское
                    </button>


                    <button
                        :class="{
                            active:
                                selectedCategory === 'women'
                        }"
                        @click="setCategory('women')"
                    >
                        Женское
                    </button>


                    <button
                        :class="{
                            active:
                                selectedCategory === 'shoes'
                        }"
                        @click="setCategory('shoes')"
                    >
                        Обувь
                    </button>

                </div>


                <div
                    v-if="types.length"
                    class="filter-section"
                >

                    <h3>
                        Раздел
                    </h3>


                    <button
                        :class="{
                            active:
                                selectedType === ''
                        }"
                        @click="selectedType = ''"
                    >
                        Все
                    </button>


                    <button
                        v-for="type in types"
                        :key="type"
                        :class="{
                            active:
                                selectedType === type
                        }"
                        @click="selectedType = type"
                    >
                        {{ type }}
                    </button>

                </div>


                <div class="filter-section">

                    <h3>
                        Размер
                    </h3>


                    <div class="size-buttons">

                        <button
                            :class="{
                                active:
                                    selectedSize === ''
                            }"
                            @click="selectedSize = ''"
                        >
                            Все
                        </button>


                        <button
                            v-for="size in sizes"
                            :key="size"
                            :class="{
                                active:
                                    selectedSize === size
                            }"
                            @click="selectedSize = size"
                        >
                            {{ size }}
                        </button>

                    </div>

                </div>


                <div class="filter-section">

                    <h3>
                        Цена
                    </h3>


                    <div class="price-inputs">

                        <input
                            v-model.number="minPrice"
                            type="number"
                            placeholder="От"
                        >

                        <input
                            v-model.number="maxPrice"
                            type="number"
                            placeholder="До"
                        >

                    </div>

                </div>


                <div class="filter-section">

                    <h3>
                        Сортировка
                    </h3>


                    <select v-model="sort">

                        <option value="default">
                            По умолчанию
                        </option>

                        <option value="cheap">
                            Сначала дешевле
                        </option>

                        <option value="expensive">
                            Сначала дороже
                        </option>

                        <option value="new">
                            Новинки
                        </option>

                    </select>

                </div>

            </aside>


            <section class="catalog-results">

                <div
                    v-if="loading"
                    class="catalog-message"
                >
                    Загрузка товаров...
                </div>


                <div
                    v-else-if="error"
                    class="catalog-message"
                >
                    {{ error }}
                </div>


                <div
                    v-else-if="filteredProducts.length === 0"
                    class="catalog-message"
                >
                    Ничего не найдено.
                </div>


                <div
                    v-else
                    class="product-grid"
                >

                    <ProductCard
                        v-for="product in filteredProducts"
                        :key="product.id"
                        :product="product"
                    />

                </div>

            </section>

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
    useRoute,
    useRouter
} from "vue-router";

import ProductCard
    from "../components/ProductCard.vue";

import {
    getProducts
} from "../api";


const route =
    useRoute();

const router =
    useRouter();


const products =
    ref([]);

const loading =
    ref(true);

const error =
    ref("");


const selectedCategory =
    ref(
        route.query.category || "all"
    );

const selectedType =
    ref("");

const selectedSize =
    ref("");

const minPrice =
    ref(null);

const maxPrice =
    ref(null);

const sort =
    ref("default");


const categoryNames = {

    all: "Все товары",

    men: "Мужское",

    women: "Женское",

    shoes: "Обувь"

};


const categoryMap = {

    all: null,

    men: "Мужское",

    women: "Женское",

    shoes: "Обувь"

};


async function loadProducts() {

    try {

        products.value =
            await getProducts();

    } catch (err) {

        error.value =
            "Не удалось загрузить товары.";

        console.error(err);

    } finally {

        loading.value = false;

    }

}


onMounted(
    loadProducts
);


const categoryProducts =
    computed(() => {

        if (
            selectedCategory.value === "all"
        ) {

            return products.value;

        }


        return products.value.filter(
            product =>
                product.category ===
                categoryMap[
                    selectedCategory.value
                ]
        );

    });


const types =
    computed(() => {

        return [
            ...new Set(
                categoryProducts.value.map(
                    product =>
                        product.type
                )
            )
        ];

    });


const sizes =
    computed(() => {

        if (
            selectedCategory.value === "shoes"
        ) {

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


        return [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ];

    });


const filteredProducts =
    computed(() => {

        let result =
            [...categoryProducts.value];


        if (selectedType.value) {

            result =
                result.filter(
                    product =>
                        product.type ===
                        selectedType.value
                );

        }


        if (selectedSize.value) {

            result =
                result.filter(
                    product =>
                        product.sizes.includes(
                            selectedSize.value
                        )
                );

        }


        if (minPrice.value !== null) {

            result =
                result.filter(
                    product =>
                        Number(product.price) >=
                        Number(minPrice.value)
                );

        }


        if (maxPrice.value !== null) {

            result =
                result.filter(
                    product =>
                        Number(product.price) <=
                        Number(maxPrice.value)
                );

        }


        if (sort.value === "cheap") {

            result.sort(
                (a, b) =>
                    a.price - b.price
            );

        }


        if (sort.value === "expensive") {

            result.sort(
                (a, b) =>
                    b.price - a.price
            );

        }


        if (sort.value === "new") {

            result.sort(
                (a, b) =>
                    Number(b.is_new) -
                    Number(a.is_new)
            );

        }


        return result;

    });


const title =
    computed(() => {

        return categoryNames[
            selectedCategory.value
        ];

    });


const eyebrow =
    computed(() => {

        if (
            selectedCategory.value === "shoes"
        ) {
            return "FOOTWEAR";
        }

        if (
            selectedCategory.value === "men"
        ) {
            return "MEN COLLECTION";
        }

        if (
            selectedCategory.value === "women"
        ) {
            return "WOMEN COLLECTION";
        }

        return "BLESSED ARCHIVE";

    });


function setCategory(category) {

    selectedCategory.value =
        category;

    selectedType.value = "";

    selectedSize.value = "";


    router.push({
        path: "/catalog",
        query:
            category === "all"
                ? {}
                : { category }
    });

}

</script>