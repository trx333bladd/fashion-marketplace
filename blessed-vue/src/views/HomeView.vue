<template>

    <main>

        <section class="hero">

            <div class="hero-image">

                <!-- LIGHT THEME -->
                <img
                    class="hero-banner hero-banner-light"
                    src="/images/banners/blessed-light.jpg"
                    alt="Blessed Shop"
                >

                <!-- DARK THEME -->
                <img
                    class="hero-banner hero-banner-dark"
                    src="/images/banners/blessed-dark.jpg"
                    alt="Blessed Shop"
                >

            </div>


            <div class="hero-content">

                <p class="eyebrow">
                    CURATED EVERYDAY WEAR
                </p>

                <h1>
                    Dress like
                    <br>
                    you mean it.
                </h1>

                <p class="hero-description">
                    Одежда и обувь для собственного стиля.
                    От базовых вещей до редких моделей.
                </p>

                <RouterLink
                    to="/catalog"
                    class="main-button"
                >
                    Смотреть коллекцию
                </RouterLink>

            </div>

        </section>


        <section class="archive-strip">

            <strong>
                NO SEASON. NO RULES.
            </strong>

            <span>
                BLESSED / 2026 ARCHIVE
            </span>

        </section>


        <section class="quick-catalog">

            <div class="quick-title">

                <p class="eyebrow">
                    КАТАЛОГ
                </p>

                <h2>
                    Выбери направление
                </h2>

            </div>


            <div class="quick-links">

                <RouterLink to="/catalog?category=men">

                    <span>
                        01
                    </span>

                    <strong>
                        Мужское
                    </strong>

                    <small>
                        Футболки · Кофты · Джинсы · Поло
                    </small>

                    <b>
                        →
                    </b>

                </RouterLink>


                <RouterLink to="/catalog?category=women">

                    <span>
                        02
                    </span>

                    <strong>
                        Женское
                    </strong>

                    <small>
                        Футболки · Кофты · Джинсы · Поло
                    </small>

                    <b>
                        →
                    </b>

                </RouterLink>


                <RouterLink to="/catalog?category=shoes">

                    <span>
                        03
                    </span>

                    <strong>
                        Обувь
                    </strong>

                    <small>
                        Кроссовки · Тапочки · Обувь
                    </small>

                    <b>
                        →
                    </b>

                </RouterLink>

            </div>

        </section>


        <section class="site-reviews-section">

            <div class="site-reviews-head">
                <div>
                    <p class="eyebrow">
                        ОТЗЫВЫ
                    </p>

                    <h2>
                        Что говорят о BLESSED
                    </h2>
                </div>

                <span>
                    {{ siteReviews.length }} отзывов
                </span>
            </div>

            <div
                v-if="siteReviews.length === 0"
                class="empty-site-reviews"
            >
                Пока здесь нет отзывов. Станьте первым!
            </div>

            <div
                v-else
                class="site-reviews-grid"
            >
                <article
                    v-for="review in siteReviews"
                    :key="review.id"
                    class="site-review-card"
                >
                    <div class="site-review-top">
                        <strong>{{ review.user_name }}</strong>
                        <span>{{ new Date(review.created_at).toLocaleDateString("ru-RU") }}</span>
                    </div>

                    <div class="review-stars">
                        {{ "★".repeat(Number(review.rating)) }}{{ "☆".repeat(5 - Number(review.rating)) }}
                    </div>

                    <p>{{ review.text }}</p>
                </article>
            </div>

            <div class="site-review-form">
                <div class="site-review-form-title">
                    <h3>Оставьте свой отзыв</h3>
                    <span v-if="!store.user">Войдите, чтобы поделиться мнением</span>
                </div>

                <div
                    v-if="store.user"
                    class="review-form-fields"
                >
                    <div class="review-rating-picker">
                        <button
                            v-for="star in 5"
                            :key="star"
                            type="button"
                            :class="{ active: star <= siteReviewRating }"
                            @click="siteReviewRating = star"
                        >
                            ★
                        </button>
                    </div>

                    <textarea
                        v-model="siteReviewText"
                        rows="3"
                        maxlength="1000"
                        placeholder="Расскажите о своём опыте в BLESSED..."
                    ></textarea>

                    <button
                        class="main-button"
                        type="button"
                        :disabled="siteReviewSubmitting"
                        @click="submitSiteReview"
                    >
                        {{ siteReviewSubmitting ? "ОТПРАВКА..." : "ОСТАВИТЬ ОТЗЫВ" }}
                    </button>
                </div>
            </div>

        </section>


        <section class="statement">

            <p>
                BLESSED ARCHIVE
            </p>

            <h2>
                WEAR WHAT<br>
                FEELS RIGHT.
            </h2>

        </section>

    </main>

</template>

<script setup>

import {
    onMounted,
    ref
} from "vue";

import {
    getSiteReviews,
    addSiteReview
} from "../api";

import {
    store
} from "../store";


const siteReviews = ref([]);

const siteReviewRating = ref(5);

const siteReviewText = ref("");

const siteReviewSubmitting = ref(false);


async function loadSiteReviews() {

    try {
        const data = await getSiteReviews();
        siteReviews.value = data.reviews || [];
    } catch (error) {
        console.error(error);
    }

}


async function submitSiteReview() {

    if (!store.user) {
        alert("Сначала войдите в аккаунт.");
        return;
    }

    if (!siteReviewText.value.trim()) {
        alert("Напишите текст отзыва.");
        return;
    }

    try {

        siteReviewSubmitting.value = true;

        await addSiteReview(
            Number(siteReviewRating.value),
            siteReviewText.value.trim()
        );

        siteReviewText.value = "";
        siteReviewRating.value = 5;

        await loadSiteReviews();

    } catch (error) {
        alert(error.message || "Не удалось отправить отзыв.");
    } finally {
        siteReviewSubmitting.value = false;
    }

}


onMounted(loadSiteReviews);

</script>
