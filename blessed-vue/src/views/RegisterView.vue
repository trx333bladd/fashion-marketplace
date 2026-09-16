<template>

    <main class="auth-page">

        <section class="auth-card">

            <p class="section-label">
                BLESSED ACCOUNT
            </p>

            <h1>
                Регистрация
            </h1>

            <p class="auth-text">
                Создайте аккаунт для заказов,
                избранного и личного кабинета.
            </p>


            <form @submit.prevent="register">

                <label>
                    Имя

                    <input
                        v-model="name"
                        required
                        placeholder="Ваше имя"
                    >
                </label>


                <label>
                    Email

                    <input
                        v-model="email"
                        type="email"
                        required
                        placeholder="example@mail.com"
                    >
                </label>


                <label>
                    Телефон

                    <input
                        v-model="phone"
                        placeholder="+7 700 000 00 00"
                    >
                </label>


                <label>
                    Пароль

                    <input
                        v-model="password"
                        type="password"
                        minlength="6"
                        required
                        placeholder="Минимум 6 символов"
                    >
                </label>


                <label>
                    Повторите пароль

                    <input
                        v-model="confirmPassword"
                        type="password"
                        minlength="6"
                        required
                        placeholder="Повторите пароль"
                    >
                </label>


                <p
                    v-if="error"
                    class="auth-error"
                >
                    {{ error }}
                </p>


                <button
                    class="auth-button"
                    :disabled="loading"
                >
                    {{
                        loading
                            ? "Создание..."
                            : "Создать аккаунт"
                    }}
                </button>

            </form>


            <p class="auth-bottom">

                Уже есть аккаунт?

                <RouterLink to="/login">
                    Войти
                </RouterLink>

            </p>

        </section>

    </main>

</template>


<script setup>

import { ref } from "vue";

import { useRouter } from "vue-router";

import { registerUser } from "../api";

import { saveSession } from "../store";


const router = useRouter();


const name = ref("");

const email = ref("");

const phone = ref("");

const password = ref("");

const confirmPassword = ref("");

const error = ref("");

const loading = ref(false);


async function register() {

    error.value = "";


    if (
        password.value !==
        confirmPassword.value
    ) {

        error.value =
            "Пароли не совпадают";

        return;

    }


    loading.value = true;


    try {

        const result =
            await registerUser({
                name: name.value,
                email: email.value,
                phone: phone.value,
                password: password.value
            });


        saveSession(result);


        router.push("/profile");

    } catch (err) {

        error.value =
            err.message;

    } finally {

        loading.value = false;

    }

}

</script>