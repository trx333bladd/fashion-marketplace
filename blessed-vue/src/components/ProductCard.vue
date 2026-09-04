<template>

    <article class="card">

        <div class="card-image">

            <RouterLink
                :to="'/product/' + product.id"
                class="card-link"
            >

                <img
                    :src="product.images[0]"
                    :alt="product.name"
                >

            </RouterLink>


            <button
                class="heart"
                @click.stop.prevent="toggle"
            >
                {{ isFavorite ? "♥" : "♡" }}
            </button>


            <span
                v-if="product.isNew"
                class="new-label"
            >
                NEW
            </span>

        </div>


        <RouterLink
            :to="'/product/' + product.id"
            class="card-info"
        >

            <div>

                <small>
                    {{ product.type }}
                </small>

                <h3>
                    {{ product.name }}
                </h3>

                <span>
                    {{ product.brand }}
                </span>

            </div>

            <strong>
                {{ product.price.toLocaleString("ru-RU") }} ₸
            </strong>

        </RouterLink>

    </article>

</template>


<script setup>

import { computed } from "vue";

import {
    store,
    toggleFavorite
} from "../store";


const props = defineProps({

    product: {
        type: Object,
        required: true
    }

});


const isFavorite = computed(() => {

    return store.favorites.includes(
        props.product.id
    );

});


function toggle() {

    toggleFavorite(
        props.product.id
    );

}

</script>