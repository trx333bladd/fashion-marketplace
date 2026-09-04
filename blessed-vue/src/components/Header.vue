<template>

    <header class="header">

        <RouterLink
            to="/"
            class="logo"
        >
            BLESSED.
        </RouterLink>


        <nav>

            <RouterLink to="/">
                Главная
            </RouterLink>

            <RouterLink to="/catalog">
                Каталог
            </RouterLink>

            <RouterLink to="/catalog?category=men">
                Мужское
            </RouterLink>

            <RouterLink to="/catalog?category=women">
                Женское
            </RouterLink>

            <RouterLink to="/catalog?category=shoes">
                Обувь
            </RouterLink>

        </nav>


        <div class="header-actions">

            <button @click="openSearch">
                Поиск
            </button>

            <button @click="favoritesOpen = true">
                ♡ {{ store.favorites.length }}
            </button>

            <button @click="cartOpen = true">
                🛒 {{ cartCount }}
            </button>

        </div>


        <!-- ПОИСК -->

        <div
            v-if="searchOpen"
            class="modal search-modal"
            @click.self="searchOpen = false"
        >

            <div class="search-window">

                <button
                    class="close"
                    @click="searchOpen = false"
                >
                    ×
                </button>

                <p class="eyebrow">
                    BLESSED SEARCH
                </p>

                <h2>
                    Найти товар
                </h2>

                <div class="search-input-wrap">

                    <span>
                        /
                    </span>

                    <input
                        v-model="search"
                        type="text"
                        placeholder="Nike, Corteiz, футболка..."
                        autofocus
                    >

                </div>


                <div class="search-results">

                    <RouterLink
                        v-for="product in searchResults"
                        :key="product.id"
                        :to="'/product/' + product.id"
                        @click="searchOpen = false"
                        class="search-result"
                    >

                        <img
                            :src="product.images[0]"
                            :alt="product.name"
                        >

                        <div class="search-result-info">

                            <strong>
                                {{ product.name }}
                            </strong>

                            <span>
                                {{ product.brand }}
                            </span>

                        </div>

                        <b>
                            {{ product.price.toLocaleString("ru-RU") }} ₸
                        </b>

                    </RouterLink>


                    <div
                        v-if="!search"
                        class="search-empty"
                    >
                        Начните вводить название товара
                    </div>


                    <div
                        v-if="search && searchResults.length === 0"
                        class="search-empty"
                    >
                        Ничего не найдено
                    </div>

                </div>

            </div>

        </div>


        <!-- ИЗБРАННОЕ -->

        <div
            v-if="favoritesOpen"
            class="modal"
            @click.self="favoritesOpen = false"
        >

            <aside class="side-panel">

                <button
                    class="close"
                    @click="favoritesOpen = false"
                >
                    ×
                </button>

                <p class="eyebrow">
                    YOUR ARCHIVE
                </p>

                <h2>
                    Избранное
                </h2>


                <p v-if="favoriteProducts.length === 0">
                    В избранном пока ничего нет.
                </p>


                <div
                    v-for="product in favoriteProducts"
                    :key="product.id"
                    class="side-item"
                >

                    <img
                        :src="product.images[0]"
                        :alt="product.name"
                    >

                    <div>

                        <strong>
                            {{ product.name }}
                        </strong>

                        <p>
                            {{ product.price.toLocaleString("ru-RU") }} ₸
                        </p>

                        <button @click="addToCart(product.id)">
                            В корзину
                        </button>

                        <button @click="toggleFavorite(product.id)">
                            Удалить
                        </button>

                    </div>

                </div>

            </aside>

        </div>


        <!-- КОРЗИНА -->

        <div
            v-if="cartOpen"
            class="modal"
            @click.self="cartOpen = false"
        >

            <aside class="side-panel">

                <button
                    class="close"
                    @click="cartOpen = false"
                >
                    ×
                </button>

                <p class="eyebrow">
                    YOUR ORDER
                </p>

                <h2>
                    Корзина
                </h2>


                <p v-if="cartProducts.length === 0">
                    Корзина пока пуста.
                </p>


                <div
                    v-for="item in cartProducts"
                    :key="item.id + item.size"
                    class="side-item"
                >

                    <img
                        :src="item.product.images[0]"
                        :alt="item.product.name"
                    >

                    <div>

                        <strong>
                            {{ item.product.name }}
                        </strong>

                        <p>
                            {{ item.product.price.toLocaleString("ru-RU") }} ₸
                        </p>

                        <small v-if="item.size">
                            Размер: {{ item.size }}
                        </small>


                        <div class="quantity">

                            <button
                                @click="
                                    changeQuantity(
                                        item.id,
                                        item.size,
                                        -1
                                    )
                                "
                            >
                                −
                            </button>

                            <span>
                                {{ item.quantity }}
                            </span>

                            <button
                                @click="
                                    changeQuantity(
                                        item.id,
                                        item.size,
                                        1
                                    )
                                "
                            >
                                +
                            </button>

                        </div>


                        <button
                            class="remove-button"
                            @click="
                                removeFromCart(
                                    item.id,
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
                    class="total"
                >

                    <span>
                        Итого
                    </span>

                    <strong>
                        {{ total.toLocaleString("ru-RU") }} ₸
                    </strong>

                </div>


                <button
                    v-if="cartProducts.length"
                    class="clear"
                    @click="clearCart"
                >
                    Очистить корзину
                </button>

            </aside>

        </div>

    </header>

</template>


<script setup>

import { ref, computed } from "vue";

import { products } from "../products";

import {
    store,
    addToCart,
    toggleFavorite,
    changeQuantity,
    removeFromCart,
    clearCart
} from "../store";


const searchOpen = ref(false);

const favoritesOpen = ref(false);

const cartOpen = ref(false);

const search = ref("");


function openSearch() {

    searchOpen.value = true;

    search.value = "";

}


const searchResults = computed(() => {

    const value = search.value
        .toLowerCase()
        .trim();

    if (!value) {
        return [];
    }

    return products.filter(product => {

        return (
            product.name
                .toLowerCase()
                .includes(value)

            ||

            product.brand
                .toLowerCase()
                .includes(value)

            ||

            product.type
                .toLowerCase()
                .includes(value)
        );

    });

});


const favoriteProducts = computed(() => {

    return products.filter(product =>
        store.favorites.includes(product.id)
    );

});


const cartProducts = computed(() => {

    return store.cart
        .map(item => {

            const product = products.find(
                product => product.id === item.id
            );

            return {
                ...item,
                product
            };

        })
        .filter(item => item.product);

});


const cartCount = computed(() => {

    return store.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

});


const total = computed(() => {

    return cartProducts.value.reduce(
        (sum, item) =>
            sum +
            item.product.price *
            item.quantity,
        0
    );

});

</script>