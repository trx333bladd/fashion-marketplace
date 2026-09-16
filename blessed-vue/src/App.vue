<template>

    <Header />

    <RouterView />

</template>


<script setup>

import { onMounted } from "vue";

import Header from "./components/Header.vue";

import { loadUserData } from "./store";


onMounted(() => {

    loadUserData();

});

</script>