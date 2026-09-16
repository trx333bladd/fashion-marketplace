<template>

    <main class="admin-page">

        <!-- =====================================================
             ADMIN TOP
        ====================================================== -->

        <section class="admin-hero">

            <div class="hero-left">

                <div class="hero-kicker">
                    BLESSED / ADMINISTRATION
                </div>

                <h1>
                    Управление
                    <br>
                    магазином
                </h1>

                <p>
                    Заказы, клиенты и статусы доставки
                    в одном месте.
                </p>

            </div>


            <div class="hero-right">

                <div class="online-status">

                    <span class="online-dot"></span>

                    <span>
                        SYSTEM ONLINE
                    </span>

                </div>


                <div class="current-date">
                    {{ currentDate }}
                </div>

            </div>

        </section>


        <!-- =====================================================
             STATISTICS
        ====================================================== -->

        <section class="stats">

            <div class="stat">

                <div class="stat-top">
                    ВСЕ ЗАКАЗЫ
                </div>

                <div class="stat-number">
                    {{ orders.length }}
                </div>

                <div class="stat-bottom">
                    TOTAL
                </div>

            </div>


            <div class="stat">

                <div class="stat-top">
                    НОВЫЕ
                </div>

                <div class="stat-number">
                    {{ newOrders }}
                </div>

                <div class="stat-bottom">
                    ACCEPTED
                </div>

            </div>


            <div class="stat">

                <div class="stat-top">
                    В РАБОТЕ
                </div>

                <div class="stat-number">
                    {{ processingOrders }}
                </div>

                <div class="stat-bottom">
                    PROCESSING
                </div>

            </div>


            <div class="stat stat-done">

                <div class="stat-top">
                    ДОСТАВЛЕНО
                </div>

                <div class="stat-number">
                    {{ deliveredOrders }}
                </div>

                <div class="stat-bottom">
                    COMPLETED
                </div>

            </div>

        </section>


        <!-- =====================================================
             ORDERS PANEL
        ====================================================== -->

        <section class="orders-panel">

            <div class="panel-header">

                <div>

                    <div class="panel-kicker">
                        ORDER MANAGEMENT
                    </div>

                    <h2>
                        Все заказы
                    </h2>

                    <p>
                        Здесь отображаются все заказы
                        пользователей магазина.
                    </p>

                </div>


                <button
                    class="refresh-button"
                    type="button"
                    :disabled="loading"
                    @click="loadOrders"
                >

                    <span class="refresh-icon">
                        ↻
                    </span>

                    {{
                        loading
                            ? "Загрузка..."
                            : "Обновить"
                    }}

                </button>

            </div>


            <!-- =================================================
                 ERROR
            ================================================== -->

            <div
                v-if="error"
                class="error-box"
            >
                {{ error }}
            </div>


            <!-- =================================================
                 LOADING
            ================================================== -->

            <div
                v-if="loading"
                class="empty-state"
            >

                <div class="loading-circle"></div>

                <span>
                    Загружаем заказы...
                </span>

            </div>


            <!-- =================================================
                 EMPTY
            ================================================== -->

            <div
                v-else-if="orders.length === 0"
                class="empty-state"
            >
                Заказов пока нет.
            </div>


            <!-- =================================================
                 ORDERS
            ================================================== -->

            <div
                v-else
                class="orders"
            >

                <article
                    v-for="order in orders"
                    :key="order.id"
                    class="order"
                >

                    <!-- ORDER HEADER -->

                    <div class="order-header">

                        <div class="order-client">

                            <div class="order-number">
                                #{{ order.id }}
                            </div>


                            <div>

                                <h3>
                                    {{ order.user_name }}
                                </h3>

                                <a
                                    :href="
                                        'mailto:' +
                                        order.email
                                    "
                                >
                                    {{ order.email }}
                                </a>

                            </div>

                        </div>


                        <div class="order-total">

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                {{ price(order.total) }}
                            </strong>

                        </div>

                    </div>


                    <!-- CUSTOMER DATA -->

                    <div class="customer-data">

                        <div class="data-item">

                            <span>
                                ТЕЛЕФОН
                            </span>

                            <strong>
                                {{
                                    order.phone ||
                                    "Не указан"
                                }}
                            </strong>

                        </div>


                        <div class="data-item">

                            <span>
                                АДРЕС ДОСТАВКИ
                            </span>

                            <strong>
                                {{
                                    order.address ||
                                    "Не указан"
                                }}
                            </strong>

                        </div>


                        <div class="data-item">

                            <span>
                                ДАТА
                            </span>

                            <strong>
                                {{
                                    formatDate(
                                        order.order_date
                                    )
                                }}
                            </strong>

                        </div>

                    </div>


                    <!-- PRODUCTS -->

                    <div class="products-section">

                        <div class="products-header">

                            <span>
                                ТОВАРЫ
                            </span>

                            <span>
                                {{ order.items.length }}
                                позиции
                            </span>

                        </div>


                        <div
                            v-for="(
                                item,
                                index
                            ) in order.items"
                            :key="index"
                            class="product-row"
                        >

                            <div class="product-left">

                                <span class="product-index">
                                    {{
                                        String(
                                            index + 1
                                        ).padStart(2, "0")
                                    }}
                                </span>


                                <div class="product-name">

                                    <strong>
                                        {{ item.name }}
                                    </strong>

                                    <span>
                                        Размер:
                                        {{
                                            item.size ||
                                            "—"
                                        }}
                                    </span>

                                </div>

                            </div>


                            <div class="product-quantity">
                                {{ item.quantity }} шт.
                            </div>


                            <div class="product-price">
                                {{ price(item.price) }}
                            </div>

                        </div>

                    </div>


                    <!-- STATUS -->

                    <div class="status-area">

                        <div class="status-current">

                            <span>
                                ТЕКУЩИЙ СТАТУС
                            </span>


                            <strong
                                :class="
                                    statusClass(
                                        order.status
                                    )
                                "
                            >

                                <i></i>

                                {{ order.status }}

                            </strong>

                        </div>


                        <div class="status-control">

                            <label>
                                ИЗМЕНИТЬ СТАТУС
                            </label>


                            <select
                                :value="order.status"
                                :disabled="
                                    updatingId ===
                                    order.id
                                "
                                @change="
                                    changeStatus(
                                        order.id,
                                        $event.target.value
                                    )
                                "
                            >

                                <option
                                    value="Принят"
                                >
                                    Принят
                                </option>

                                <option
                                    value="Собирается"
                                >
                                    Собирается
                                </option>

                                <option
                                    value="В пути"
                                >
                                    В пути
                                </option>

                                <option
                                    value="Доставлен"
                                >
                                    Доставлен
                                </option>

                            </select>

                        </div>

                    </div>

                </article>

            </div>

        </section>

    </main>

</template>


<script setup>

import {
    computed,
    onMounted,
    onUnmounted,
    ref
} from "vue";


import {
    store
} from "../store";


/* =====================================================
   DATA
===================================================== */

const orders = ref([]);

const loading = ref(false);

const error = ref("");

const updatingId = ref(null);


/* =====================================================
   STATUSES
===================================================== */

const statuses = [
    "Принят",
    "Собирается",
    "В пути",
    "Доставлен"
];


/* =====================================================
   DATE
===================================================== */

const currentDate =
    new Date()
        .toLocaleDateString(
            "ru-RU",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


/* =====================================================
   STATISTICS
===================================================== */

const newOrders = computed(() => {

    return orders.value.filter(
        order =>
            order.status === "Принят"
    ).length;

});


const processingOrders = computed(() => {

    return orders.value.filter(
        order =>
            order.status === "Собирается" ||
            order.status === "В пути"
    ).length;

});


const deliveredOrders = computed(() => {

    return orders.value.filter(
        order =>
            order.status === "Доставлен"
    ).length;

});


/* =====================================================
   PRICE
===================================================== */

function price(value) {

    return Number(value)
        .toLocaleString("ru-RU") +
        " ₸";

}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(value) {

    if (!value) {
        return "—";
    }


    return new Date(value)
        .toLocaleDateString(
            "ru-RU",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


/* =====================================================
   STATUS CLASS
===================================================== */

function statusClass(status) {

    if (status === "Доставлен") {

        return "status-done";

    }


    if (status === "В пути") {

        return "status-way";

    }


    if (status === "Собирается") {

        return "status-working";

    }


    return "status-new";

}


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    loading.value = true;

    error.value = "";


    try {

        const response =
            await fetch(
                "http://localhost:3000/api/admin/orders",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${store.token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Не удалось загрузить заказы"
            );

        }


        orders.value =
            Array.isArray(data)
                ? data
                : [];

    } catch (err) {

        console.error(
            "ADMIN ORDERS ERROR:",
            err
        );


        error.value =
            err.message ||
            "Ошибка загрузки заказов";

    } finally {

        loading.value = false;

    }

}


/* =====================================================
   CHANGE STATUS
===================================================== */

async function changeStatus(
    orderId,
    newStatus
) {

    if (
        !statuses.includes(
            newStatus
        )
    ) {

        return;

    }


    updatingId.value =
        orderId;


    error.value = "";


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/admin/orders/${orderId}/status`,
                {
                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${store.token}`

                    },

                    body:
                        JSON.stringify({
                            status:
                                newStatus
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Не удалось изменить статус"
            );

        }


        const order =
            orders.value.find(
                item =>
                    Number(item.id) ===
                    Number(orderId)
            );


        if (order) {

            order.status =
                data.order.status;

        }

    } catch (err) {

        console.error(
            "STATUS ERROR:",
            err
        );


        error.value =
            err.message ||
            "Ошибка изменения статуса";


        await loadOrders();

    } finally {

        updatingId.value =
            null;

    }

}


/* =====================================================
   ADMIN MODE
===================================================== */

onMounted(() => {

    document.documentElement.classList.add(
        "admin-mode"
    );


    loadOrders();

});


onUnmounted(() => {

    document.documentElement.classList.remove(
        "admin-mode"
    );

});

</script>


<style scoped>

/* =====================================================
   MAIN
===================================================== */

.admin-page {

    min-height:
        calc(100vh - 70px);

    padding:
        55px 42px 100px;

    background:
        #071523;

    color:
        #edf5ff;

}


/* =====================================================
   HERO
===================================================== */

.admin-hero {

    max-width:
        1500px;

    margin:
        0 auto 42px;

    display:
        flex;

    align-items:
        flex-end;

    justify-content:
        space-between;

    gap:
        50px;

}


.hero-left {

    max-width:
        850px;

}


.hero-kicker {

    margin-bottom:
        18px;

    color:
        #7291ad;

    font-size:
        9px;

    letter-spacing:
        3px;

    text-transform:
        uppercase;

}


.hero-left h1 {

    margin:
        0;

    color:
        #f4f8ff;

    font-size:
        clamp(58px, 8vw, 118px);

    font-weight:
        300;

    line-height:
        .84;

    letter-spacing:
        -6px;

}


.hero-left p {

    max-width:
        450px;

    margin:
        28px 0 0;

    color:
        #87a0b9;

    font-size:
        13px;

    line-height:
        1.6;

}


.hero-right {

    min-width:
        200px;

    padding-bottom:
        5px;

}


.online-status {

    display:
        flex;

    align-items:
        center;

    gap:
        9px;

    margin-bottom:
        18px;

    color:
        #8fa8c1;

    font-size:
        8px;

    letter-spacing:
        2px;

}


.online-dot {

    width:
        7px;

    height:
        7px;

    border-radius:
        50%;

    background:
        #6dd0ff;

    box-shadow:
        0 0 12px rgba(109, 208, 255, .55);

}


.current-date {

    color:
        #4c647c;

    font-size:
        10px;

    text-transform:
        uppercase;

    letter-spacing:
        1.5px;

}


/* =====================================================
   STATS
===================================================== */

.stats {

    max-width:
        1500px;

    margin:
        0 auto 35px;

    display:
        grid;

    grid-template-columns:
        repeat(4, 1fr);

    border:
        1px solid #19334d;

    background:
        #0b1d30;

}


.stat {

    min-height:
        145px;

    padding:
        20px;

    border-right:
        1px solid #19334d;

}


.stat:last-child {

    border-right:
        0;

}


.stat-top {

    color:
        #58738c;

    font-size:
        8px;

    letter-spacing:
        1.8px;

}


.stat-number {

    margin-top:
        28px;

    color:
        #f2f7ff;

    font-size:
        48px;

    font-weight:
        300;

    line-height:
        1;

}


.stat-bottom {

    margin-top:
        13px;

    color:
        #3f5870;

    font-size:
        8px;

    letter-spacing:
        1.5px;

}


.stat-done {

    background:
        #102d47;

}


.stat-done .stat-number {

    color:
        #7bd4ff;

}


/* =====================================================
   ORDERS PANEL
===================================================== */

.orders-panel {

    max-width:
        1500px;

    margin:
        0 auto;

    border:
        1px solid #1c3852;

    background:
        #0b1b2c;

    box-shadow:
        0 18px 60px rgba(0, 0, 0, .18);

}


/* =====================================================
   PANEL HEADER
===================================================== */

.panel-header {

    display:
        flex;

    align-items:
        flex-end;

    justify-content:
        space-between;

    gap:
        30px;

    padding:
        30px;

    border-bottom:
        1px solid #19334d;

}


.panel-kicker {

    margin-bottom:
        8px;

    color:
        #5d7b95;

    font-size:
        8px;

    letter-spacing:
        2px;

}


.panel-header h2 {

    margin:
        0;

    color:
        #f5f9ff;

    font-size:
        34px;

    font-weight:
        400;

    letter-spacing:
        -1px;

}


.panel-header p {

    margin:
        9px 0 0;

    color:
        #6e879e;

    font-size:
        11px;

}


/* =====================================================
   REFRESH
===================================================== */

.refresh-button {

    min-height:
        43px;

    padding:
        0 18px;

    display:
        inline-flex;

    align-items:
        center;

    gap:
        8px;

    border:
        1px solid #34536f;

    background:
        #102a42;

    color:
        #dcecff;

    font-size:
        9px;

    letter-spacing:
        1.2px;

    text-transform:
        uppercase;

    cursor:
        pointer;

    transition:
        .2s;

}


.refresh-button:hover {

    background:
        #173a5a;

    border-color:
        #537895;

}


.refresh-button:disabled {

    opacity:
        .5;

    cursor:
        wait;

}


.refresh-icon {

    font-size:
        15px;

}


/* =====================================================
   ERROR
===================================================== */

.error-box {

    margin:
        20px 30px;

    padding:
        15px 18px;

    border:
        1px solid #6c3944;

    background:
        #2a1720;

    color:
        #ffb6c2;

    font-size:
        11px;

}


/* =====================================================
   EMPTY / LOADING
===================================================== */

.empty-state {

    min-height:
        230px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        12px;

    color:
        #607991;

    font-size:
        12px;

}


.loading-circle {

    width:
        16px;

    height:
        16px;

    border:
        1px solid #35526b;

    border-top-color:
        #8edcff;

    border-radius:
        50%;

    animation:
        admin-spin .7s linear infinite;

}


@keyframes admin-spin {

    to {
        transform:
            rotate(360deg);
    }

}


/* =====================================================
   ORDER
===================================================== */

.order {

    border-bottom:
        1px solid #19334d;

    background:
        #0a1929;

}


.order:last-child {

    border-bottom:
        0;

}


.order:hover {

    background:
        #0d2033;

}


/* =====================================================
   ORDER HEADER
===================================================== */

.order-header {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        30px;

    padding:
        25px 30px;

}


.order-client {

    display:
        flex;

    align-items:
        center;

    gap:
        17px;

}


.order-number {

    width:
        52px;

    height:
        52px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    border:
        1px solid #274761;

    background:
        #0d2135;

    color:
        #76a1bf;

    font-size:
        12px;

}


.order-client h3 {

    margin:
        0 0 5px;

    color:
        #f5f8fc;

    font-size:
        20px;

    font-weight:
        500;

}


.order-client a {

    color:
        #6f899f;

    font-size:
        11px;

}


.order-client a:hover {

    color:
        #a9dfff;

}


.order-total {

    display:
        flex;

    align-items:
        flex-end;

    flex-direction:
        column;

    gap:
        5px;

}


.order-total span {

    color:
        #4e687f;

    font-size:
        8px;

    letter-spacing:
        2px;

}


.order-total strong {

    color:
        #f4f8ff;

    font-size:
        21px;

    font-weight:
        500;

}


/* =====================================================
   CUSTOMER DATA
===================================================== */

.customer-data {

    display:
        grid;

    grid-template-columns:
        1fr 1.5fr 1fr;

    border-top:
        1px solid #182f45;

    border-bottom:
        1px solid #182f45;

}


.data-item {

    min-height:
        92px;

    padding:
        18px 20px;

    border-right:
        1px solid #182f45;

}


.data-item:last-child {

    border-right:
        0;

}


.data-item span {

    display:
        block;

    margin-bottom:
        12px;

    color:
        #4f687d;

    font-size:
        8px;

    letter-spacing:
        1.5px;

}


.data-item strong {

    color:
        #b9c9d7;

    font-size:
        11px;

    font-weight:
        400;

    line-height:
        1.5;

}


/* =====================================================
   PRODUCTS
===================================================== */

.products-section {

    padding:
        22px 30px 8px;

}


.products-header {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    margin-bottom:
        8px;

    color:
        #557086;

    font-size:
        8px;

    letter-spacing:
        2px;

}


.product-row {

    display:
        grid;

    grid-template-columns:
        1fr 100px 110px;

    align-items:
        center;

    min-height:
        62px;

    border-top:
        1px solid #132a3f;

}


.product-left {

    display:
        flex;

    align-items:
        center;

    gap:
        17px;

}


.product-index {

    color:
        #35516a;

    font-size:
        9px;

}


.product-name {

    display:
        flex;

    flex-direction:
        column;

    gap:
        5px;

}


.product-name strong {

    color:
        #dbe6f0;

    font-size:
        11px;

    font-weight:
        400;

}


.product-name span {

    color:
        #526c83;

    font-size:
        9px;

}


.product-quantity {

    color:
        #71879a;

    font-size:
        10px;

}


.product-price {

    color:
        #d9e6f2;

    font-size:
        11px;

    text-align:
        right;

}


/* =====================================================
   STATUS
===================================================== */

.status-area {

    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        30px;

    margin:
        22px 30px 30px;

    padding:
        18px;

    border:
        1px solid #1c3852;

    background:
        #081522;

}


.status-current {

    display:
        flex;

    flex-direction:
        column;

    gap:
        8px;

}


.status-current > span,
.status-control label {

    color:
        #4e687f;

    font-size:
        8px;

    letter-spacing:
        1.5px;

}


.status-current strong {

    display:
        flex;

    align-items:
        center;

    gap:
        8px;

    color:
        #eaf5ff;

    font-size:
        11px;

    font-weight:
        500;

}


.status-current strong i {

    width:
        8px;

    height:
        8px;

    border-radius:
        50%;

}


.status-new i {

    background:
        #67cfff;

    box-shadow:
        0 0 10px rgba(103, 207, 255, .35);

}


.status-working i {

    background:
        #8cb8ff;

}


.status-way i {

    background:
        #7f9dde;

}


.status-done i {

    background:
        #55e0ca;

    box-shadow:
        0 0 10px rgba(85, 224, 202, .25);

}


.status-control {

    display:
        flex;

    align-items:
        center;

    gap:
        13px;

}


.status-control select {

    width:
        205px;

    height:
        42px;

    padding:
        0 12px;

    border:
        1px solid #31516d;

    outline:
        none;

    background:
        #10283f;

    color:
        #edf6ff;

    font-family:
        inherit;

    font-size:
        10px;

    cursor:
        pointer;

}


.status-control select:focus {

    border-color:
        #6ab7e8;

}


.status-control select:disabled {

    opacity:
        .5;

    cursor:
        wait;

}


/* =====================================================
   GLOBAL ADMIN MODE
===================================================== */

:global(html.admin-mode),
:global(html.admin-mode body),
:global(html.admin-mode #app) {

    background:
        #071523 !important;

    color:
        #edf5ff !important;

}


:global(html.admin-mode body) {

    margin:
        0;

    overflow-x:
        hidden;

}


/* =====================================================
   ADMIN HEADER
===================================================== */

:global(html.admin-mode .admin-header) {

    background:
        #06111d !important;

    border-bottom:
        1px solid #19334d !important;

}


:global(html.admin-mode .admin-header .logo) {

    color:
        #f4f8ff !important;

}


:global(html.admin-mode .admin-header-center) {

    color:
        #7291ad !important;

}


:global(html.admin-mode .admin-user-label) {

    color:
        #4f6b84 !important;

}


:global(html.admin-mode .admin-user-block strong) {

    color:
        #e8f2fc !important;

}


:global(html.admin-mode .admin-logout) {

    border-color:
        #34516b !important;

    background:
        #102337 !important;

    color:
        #eaf5ff !important;

}


:global(html.admin-mode .admin-logout:hover) {

    background:
        #1a3a59 !important;

    border-color:
        #5b7994 !important;

}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {

    .admin-page {

        padding:
            40px 22px 80px;

    }


    .admin-hero {

        align-items:
            flex-start;

        flex-direction:
            column;

    }


    .hero-right {

        min-width:
            0;

    }


    .stats {

        grid-template-columns:
            repeat(2, 1fr);

    }


    .stat:nth-child(2) {

        border-right:
            0;

    }


    .stat:nth-child(-n + 2) {

        border-bottom:
            1px solid #19334d;

    }


    .customer-data {

        grid-template-columns:
            1fr 1fr;

    }


    .data-item:nth-child(2) {

        border-right:
            0;

    }


    .data-item:last-child {

        grid-column:
            span 2;

        border-top:
            1px solid #182f45;

        border-right:
            0;

    }

}


@media (max-width: 700px) {

    .admin-page {

        padding:
            30px 14px 60px;

    }


    .hero-left h1 {

        font-size:
            58px;

        letter-spacing:
            -4px;

    }


    .stats {

        grid-template-columns:
            1fr 1fr;

    }


    .stat {

        min-height:
            120px;

        padding:
            16px;

    }


    .stat-number {

        font-size:
            36px;

    }


    .panel-header {

        align-items:
            flex-start;

        flex-direction:
            column;

        padding:
            22px;

    }


    .refresh-button {

        width:
            100%;

    }


    .order-header {

        align-items:
            flex-start;

        flex-direction:
            column;

        padding:
            20px;

    }


    .order-total {

        align-items:
            flex-start;

    }


    .customer-data {

        grid-template-columns:
            1fr;

    }


    .data-item {

        border-right:
            0;

        border-bottom:
            1px solid #182f45;

    }


    .data-item:nth-child(2) {

        border-right:
            0;

    }


    .data-item:last-child {

        grid-column:
            auto;

        border-top:
            0;

        border-bottom:
            0;

    }


    .products-section {

        padding:
            20px;

    }


    .product-row {

        grid-template-columns:
            1fr auto;

        gap:
            10px;

        padding:
            12px 0;

    }


    .product-quantity {

        display:
            none;

    }


    .status-area {

        align-items:
            flex-start;

        flex-direction:
            column;

        margin:
            18px 20px 20px;

    }


    .status-control {

        width:
            100%;

        align-items:
            flex-start;

        flex-direction:
            column;

    }


    .status-control select {

        width:
            100%;

    }

}


@media (max-width: 480px) {

    .stats {

        grid-template-columns:
            1fr;

    }


    .stat {

        border-right:
            0 !important;

        border-bottom:
            1px solid #19334d !important;

    }


    .stat:last-child {

        border-bottom:
            0 !important;

    }


    .hero-left h1 {

        font-size:
            50px;

    }


    .order-client {

        align-items:
            flex-start;

    }


    .order-number {

        width:
            45px;

        height:
            45px;

    }

}

</style>