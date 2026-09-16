<template>

    <main class="profile-page">

        <div
            v-if="!store.user"
            class="empty-products"
        >
            Вы не авторизованы.
        </div>


        <template v-else>

            <!-- HEADER -->

            <section class="profile-heading">

                <div>

                    <p class="section-label">
                        BLESSED ACCOUNT
                    </p>

                    <h1>
                        Личный кабинет
                    </h1>

                </div>

                <span>
                    {{ store.user.email }}
                </span>

            </section>


            <div class="profile-layout">


                <!-- PROFILE -->

                <section class="profile-card">

                    <h2>
                        Данные
                    </h2>


                    <label>

                        Имя

                        <input
                            v-model="form.name"
                            type="text"
                        >

                    </label>


                    <label>

                        Телефон

                        <input
                            v-model="form.phone"
                            type="text"
                        >

                    </label>


                    <label>

                        Адрес доставки

                        <textarea
                            v-model="form.address"
                            placeholder="Укажите адрес доставки"
                        ></textarea>

                    </label>


                    <button
                        class="main-button profile-save"
                        @click="save"
                        :disabled="saving"
                    >

                        {{
                            saving
                                ? "Сохранение..."
                                : "Сохранить"
                        }}

                    </button>


                    <button
                        class="second-button profile-save"
                        @click="logoutUser"
                    >
                        Выйти из аккаунта
                    </button>


                    <p
                        v-if="message"
                        class="profile-note"
                    >
                        {{ message }}
                    </p>

                </section>


                <!-- PARAMETERS -->

                <section class="profile-card">

                    <h2>
                        Параметры
                    </h2>


                    <label>

                        Рост

                        <input
                            v-model="form.height"
                            type="number"
                            placeholder="178"
                        >

                    </label>


                    <label>

                        Вес

                        <input
                            v-model="form.weight"
                            type="number"
                            placeholder="72"
                        >

                    </label>


                    <label>

                        Размер обуви

                        <select
                            v-model="form.shoe_size"
                        >

                            <option value="">
                                Не указан
                            </option>

                            <option
                                v-for="size in shoeSizes"
                                :key="size"
                                :value="size"
                            >
                                {{ size }}
                            </option>

                        </select>

                    </label>


                    <label class="setting-row">

                        Получать уведомления

                        <input
                            v-model="form.notifications"
                            type="checkbox"
                        >

                    </label>

                </section>


                <!-- =========================
                     CURRENT DELIVERIES
                ========================= -->

                <section class="profile-card orders-card">

                    <div class="orders-heading">

                        <div>

                            <p class="section-label">
                                DELIVERY
                            </p>

                            <h2>
                                Текущая доставка
                            </h2>

                        </div>

                        <span>
                            {{ currentOrders.length }}
                            заказов
                        </span>

                    </div>


                    <div
                        v-if="currentOrders.length === 0"
                        class="empty-orders"
                    >
                        Сейчас нет активных доставок.
                    </div>


                    <article
                        v-for="order in currentOrders"
                        :key="order.id"
                        class="order"
                    >

                        <div class="order-left">

                            <strong>
                                Заказ #{{ order.id }}
                            </strong>

                            <p>
                                {{ formatDate(order.order_date) }}
                            </p>

                            <p>
                                {{ order.address }}
                            </p>

                        </div>


                        <div class="order-right">

                            <strong>
                                {{ formatPrice(order.total) }}
                            </strong>

                            <span
                                class="order-status"
                            >
                                {{ order.status }}
                            </span>

                        </div>


                        <!-- DELIVERY -->

                        <div class="delivery">

                            <div class="delivery-line">

                                <span
                                    class="delivery-progress"
                                    :style="{
                                        width:
                                            getProgress(
                                                order.status
                                            )
                                    }"
                                ></span>

                            </div>


                            <div class="delivery-steps">

                                <div
                                    v-for="
                                        (step, index)
                                        in deliverySteps
                                    "
                                    :key="step.status"
                                    class="delivery-step"
                                    :class="{
                                        active:
                                            isStepActive(
                                                order.status,
                                                index
                                            ),

                                        current:
                                            isCurrentStep(
                                                order.status,
                                                index
                                            )
                                    }"
                                >

                                    <div class="step-dot">
                                        {{ index + 1 }}
                                    </div>

                                    <span>
                                        {{ step.title }}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <!-- EXPAND -->

                        <button
                            class="order-expand-button"
                            @click="toggleOrder(order.id)"
                        >

                            {{
                                expandedOrders.includes(
                                    order.id
                                )
                                    ? "Свернуть"
                                    : "Развернуть"
                            }}

                            <span>
                                {{
                                    expandedOrders.includes(
                                        order.id
                                    )
                                        ? "↑"
                                        : "↓"
                                }}
                            </span>

                        </button>


                        <!-- DETAILS -->

                        <div
                            v-if="
                                expandedOrders.includes(
                                    order.id
                                )
                            "
                            class="order-details"
                        >

                            <div class="order-details-title">
                                ТОВАРЫ
                            </div>


                            <div
                                v-for="
                                    (item, index)
                                    in order.items
                                "
                                :key="index"
                                class="order-product"
                            >

                                <div>

                                    <strong>
                                        {{ item.name }}
                                    </strong>

                                    <span>
                                        Размер:
                                        {{ item.size || "—" }}
                                    </span>

                                </div>


                                <span>
                                    {{ item.quantity }} шт.
                                </span>


                                <strong>
                                    {{ formatPrice(item.price) }}
                                </strong>

                            </div>


                            <!-- RECEIVE -->

                            <div
                                v-if="
                                    order.status ===
                                    'Доставлен' &&
                                    !order.is_received
                                "
                                class="receive-box"
                            >

                                <div>

                                    <strong>
                                        Заказ доставлен
                                    </strong>

                                    <span>
                                        Если вы получили заказ,
                                        подтвердите получение.
                                    </span>

                                </div>


                                <button
                                    class="receive-button"
                                    :disabled="
                                        receivingId ===
                                        order.id
                                    "
                                    @click="
                                        receiveOrder(
                                            order.id
                                        )
                                    "
                                >

                                    {{
                                        receivingId ===
                                        order.id
                                            ? "Подтверждение..."
                                            : "Я получил заказ"
                                    }}

                                </button>

                            </div>

                        </div>

                    </article>

                </section>


                <!-- =========================
                     ORDER HISTORY
                ========================= -->

                <section class="profile-card orders-card">

                    <div class="orders-heading">

                        <div>

                            <p class="section-label">
                                HISTORY
                            </p>

                            <h2>
                                История заказов
                            </h2>

                        </div>

                        <span>
                            {{ historyOrders.length }}
                            заказов
                        </span>

                    </div>


                    <div
                        v-if="historyOrders.length === 0"
                        class="empty-orders"
                    >
                        История заказов пока пуста.
                    </div>


                    <article
                        v-for="order in historyOrders"
                        :key="order.id"
                        class="order history-order"
                    >

                        <div class="order-left">

                            <strong>
                                Заказ #{{ order.id }}
                            </strong>

                            <p>
                                {{ formatDate(order.order_date) }}
                            </p>

                            <p>
                                {{ order.address }}
                            </p>

                        </div>


                        <div class="order-right">

                            <strong>
                                {{ formatPrice(order.total) }}
                            </strong>

                            <span class="order-status">
                                Получен
                            </span>

                        </div>


                        <button
                            class="order-expand-button"
                            @click="toggleOrder(order.id)"
                        >

                            {{
                                expandedOrders.includes(
                                    order.id
                                )
                                    ? "Свернуть"
                                    : "Развернуть"
                            }}

                            <span>
                                {{
                                    expandedOrders.includes(
                                        order.id
                                    )
                                        ? "↑"
                                        : "↓"
                                }}
                            </span>

                        </button>


                        <div
                            v-if="
                                expandedOrders.includes(
                                    order.id
                                )
                            "
                            class="order-details"
                        >

                            <div class="order-details-title">
                                ТОВАРЫ
                            </div>


                            <div
                                v-for="
                                    (item, index)
                                    in order.items
                                "
                                :key="index"
                                class="order-product"
                            >

                                <div>

                                    <strong>
                                        {{ item.name }}
                                    </strong>

                                    <span>
                                        Размер:
                                        {{ item.size || "—" }}
                                    </span>

                                </div>


                                <span>
                                    {{ item.quantity }} шт.
                                </span>


                                <strong>
                                    {{ formatPrice(item.price) }}
                                </strong>

                            </div>

                        </div>

                    </article>

                </section>

            </div>

        </template>

    </main>

</template>


<script setup>

import {
    computed,
    reactive,
    ref
} from "vue";

import {
    useRouter
} from "vue-router";

import {
    store,
    saveProfile,
    logout
} from "../store";


const router =
    useRouter();


const saving =
    ref(false);


const message =
    ref("");


const receivingId =
    ref(null);


const expandedOrders =
    ref([]);


const form =
    reactive({

        name:
            store.user?.name || "",

        phone:
            store.user?.phone || "",

        address:
            store.user?.address || "",

        height:
            store.user?.height || "",

        weight:
            store.user?.weight || "",

        shoe_size:
            store.user?.shoe_size || "",

        notifications:
            store.user?.notifications ?? true

    });


const shoeSizes = [
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


/* =========================
   DELIVERY
========================= */

const deliverySteps = [

    {
        status: "Принят",
        title: "Заказ принят"
    },

    {
        status: "Собирается",
        title: "Собирается"
    },

    {
        status: "В пути",
        title: "В пути"
    },

    {
        status: "Доставлен",
        title: "Доставлен"
    }

];


const currentOrders =
    computed(() => {

        return store.orders.filter(
            order =>
                !order.is_received
        );

    });


const historyOrders =
    computed(() => {

        return store.orders.filter(
            order =>
                order.is_received === true
        );

    });


function getStatusIndex(status) {

    const index =
        deliverySteps.findIndex(
            step =>
                step.status === status
        );

    return index === -1
        ? 0
        : index;

}


function isStepActive(
    status,
    index
) {

    return index <=
        getStatusIndex(status);

}


function isCurrentStep(
    status,
    index
) {

    return index ===
        getStatusIndex(status);

}


function getProgress(status) {

    const index =
        getStatusIndex(status);


    if (index === 0) {
        return "0%";
    }


    if (index === 1) {
        return "33%";
    }


    if (index === 2) {
        return "66%";
    }


    return "100%";

}


/* =========================
   EXPAND
========================= */

function toggleOrder(orderId) {

    const index =
        expandedOrders.value.indexOf(
            orderId
        );


    if (index === -1) {

        expandedOrders.value.push(
            orderId
        );

    } else {

        expandedOrders.value.splice(
            index,
            1
        );

    }

}


/* =========================
   RECEIVE ORDER
========================= */

async function receiveOrder(orderId) {

    receivingId.value =
        orderId;


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/orders/${orderId}/receive`,
                {
                    method: "PATCH",

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
                "Не удалось подтвердить получение"
            );

        }


        const order =
            store.orders.find(
                item =>
                    Number(item.id) ===
                    Number(orderId)
            );


        if (order) {

            order.is_received = true;

        }


        expandedOrders.value =
            expandedOrders.value.filter(
                id =>
                    Number(id) !==
                    Number(orderId)
            );

    } catch (error) {

        alert(
            error.message
        );

    } finally {

        receivingId.value =
            null;

    }

}


/* =========================
   SAVE
========================= */

async function save() {

    saving.value = true;

    message.value = "";


    try {

        await saveProfile({

            name:
                form.name,

            phone:
                form.phone,

            address:
                form.address,

            height:
                form.height || null,

            weight:
                form.weight || null,

            shoe_size:
                form.shoe_size || null,

            notifications:
                form.notifications

        });


        message.value =
            "Данные сохранены.";

    } catch (error) {

        message.value =
            error.message;

    } finally {

        saving.value =
            false;

    }

}


/* =========================
   LOGOUT
========================= */

function logoutUser() {

    logout();

    router.push("/");

}


/* =========================
   HELPERS
========================= */

function formatPrice(value) {

    return Number(value)
        .toLocaleString("ru-RU")
        + " ₸";

}


function formatDate(value) {

    if (!value) {
        return "";
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

</script>


<style scoped>

.order-expand-button {

    width: 100%;

    margin-top: 18px;

    padding: 13px 16px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    border: 1px solid #d7d4cb;

    background: transparent;

    color: inherit;

    font-size: 11px;

    cursor: pointer;

    transition: .2s;

}

.order-expand-button:hover {

    background: rgba(0, 0, 0, .04);

}


.order-details {

    margin-top: 18px;

    padding-top: 18px;

    border-top: 1px solid #ddd9d0;

}


.order-details-title {

    margin-bottom: 12px;

    font-size: 9px;

    letter-spacing: 2px;

    opacity: .55;

}


.order-product {

    display: grid;

    grid-template-columns:
        1fr
        auto
        auto;

    gap: 20px;

    padding: 14px 0;

    border-top: 1px solid #e1ded6;

    font-size: 11px;

}


.order-product div {

    display: flex;

    flex-direction: column;

    gap: 5px;

}


.order-product div span {

    opacity: .55;

    font-size: 9px;

}


.receive-box {

    margin-top: 18px;

    padding: 18px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 20px;

    border: 1px solid #b9c9d7;

    background: #eef4f8;

}


.receive-box div {

    display: flex;

    flex-direction: column;

    gap: 6px;

}


.receive-box div span {

    font-size: 10px;

    opacity: .65;

}


.receive-button {

    padding: 13px 20px;

    border: 0;

    background: #0b1d30;

    color: white;

    font-size: 10px;

    cursor: pointer;

    white-space: nowrap;

    transition: .2s;

}


.receive-button:hover {

    background: #163653;

}


.receive-button:disabled {

    opacity: .5;

    cursor: wait;

}


.history-order {

    opacity: .9;

}


@media (max-width: 700px) {

    .order-product {

        grid-template-columns: 1fr auto;

    }

    .order-product > strong {

        grid-column: 2;

    }

    .receive-box {

        align-items: stretch;

        flex-direction: column;

    }

    .receive-button {

        width: 100%;

    }

}

</style>