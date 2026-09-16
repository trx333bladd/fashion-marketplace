<template>

    <article class="product-card">

        <RouterLink
            :to="'/product/' + product.id"
            class="product-card-link"
        >

            <div class="product-image">

                <img
                    :src="product.images[0]"
                    :alt="product.name"
                    @error="imageError"
                >


                <span
                    v-if="product.is_new"
                    class="product-badge"
                >
                    NEW
                </span>

            </div>


            <div class="product-info">

                <p class="product-category">
                    {{ product.type }}
                </p>


                <h3>
                    {{ product.name }}
                </h3>


                <p class="product-brand">
                    {{ product.brand }}
                </p>


                <strong class="product-price">
                    {{ price(product.price) }}
                </strong>

            </div>

        </RouterLink>


        <button
            class="favorite-button"
            @click="favorite"
        >
            {{ isFavorite ? "♥" : "♡" }}
        </button>

    </article>

</template>


<script setup>

import {
    computed
} from "vue";


import {
    store,
    toggleFavorite
} from "../store";


const props =
    defineProps({

        product: {
            type: Object,
            required: true
        }

    });


const isFavorite =
    computed(() => {

        return store.favorites.some(
            item =>
                Number(item.id) ===
                Number(props.product.id)
        );

    });


function price(value) {

    return Number(value)
        .toLocaleString("ru-RU")
        + " ₸";

}


async function favorite() {

    if (!store.user) {

        alert(
            "Сначала войдите в аккаунт."
        );

        return;

    }


    try {

        await toggleFavorite(
            props.product.id
        );

    } catch (error) {

        alert(error.message);

    }

}


function imageError(event) {

    event.target.style.display =
        "none";

}

</script>