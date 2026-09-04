<template>

    <main>

        <section class="hero">

            <div class="hero-text">

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


            <div class="hero-image">

                <img
                    src="/images/banners/bannershop.jpg"
                    alt="Blessed Shop"
                >

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