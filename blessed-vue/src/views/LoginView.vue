<template>

    <main class="auth-page">

        <section class="auth-card">

            <p class="section-label">
                BLESSED ACCOUNT
            </p>


            <h1>
                Вход
            </h1>


            <p class="auth-description">
                Войдите в свой личный кабинет.
            </p>


            <form
                @submit.prevent="login"
            >

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

                    Пароль

                    <input
                        v-model="password"
                        type="password"
                        required
                        placeholder="Ваш пароль"
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
                    type="submit"
                    :disabled="loading"
                >

                    {{
                        loading
                            ? "Вход..."
                            : "Войти"
                    }}

                </button>

            </form>


            <p class="auth-switch">

                Нет аккаунта?

                <RouterLink to="/register">
                    Зарегистрироваться
                </RouterLink>

            </p>

        </section>

    </main>

</template>


<script setup>

import { ref } from "vue";

import {
    useRouter
} from "vue-router";

import {
    loginUser
} from "../api";

import {
    loginSession
} from "../store";


const router =
    useRouter();


const email =
    ref("");


const password =
    ref("");


const error =
    ref("");


const loading =
    ref(false);


async function login() {

    error.value = "";

    loading.value = true;


    try {

        const result =
            await loginUser({

                email:
                    email.value.trim(),

                password:
                    password.value

            });


        await loginSession(
            result
        );


        router.push(
            "/profile"
        );


    } catch (err) {

        console.error(err);

        error.value =
            err.message ||
            "Не удалось выполнить вход.";


    } finally {

        loading.value = false;

    }

}

</script>