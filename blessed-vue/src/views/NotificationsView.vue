<template>
  <main class="notifications-page">

    <section class="notifications-header">

      <div>
        <p class="notifications-label">
          BLESSED / UPDATES
        </p>

        <h1>
          Уведомления
        </h1>

        <p class="notifications-subtitle">
          Здесь отображаются обновления по вашим заказам.
        </p>
      </div>

      <div
        v-if="unreadCount > 0"
        class="notifications-counter"
      >
        <span>НОВЫХ</span>

        <strong>
          {{ unreadCount }}
        </strong>
      </div>

    </section>


    <section
      v-if="notifications.length === 0"
      class="notifications-empty"
    >

      <div class="empty-icon">
        ♡
      </div>

      <h2>
        Пока нет уведомлений
      </h2>

      <p>
        Здесь появятся обновления, когда изменится статус вашего заказа.
      </p>

      <RouterLink
        to="/catalog"
        class="catalog-button"
      >
        Перейти в каталог
      </RouterLink>

    </section>


    <section
      v-else
      class="notifications-list"
    >

      <div class="notifications-top">

        <span>
          {{ notifications.length }}
          {{ notifications.length === 1 ? "уведомление" : "уведомлений" }}
        </span>

        <button
          type="button"
          class="read-button"
          @click="markAllAsRead"
        >
          Отметить всё прочитанным
        </button>

      </div>


      <article
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-card"
        :class="{
          unread: !notification.read
        }"
        @click="openOrder(notification.orderId)"
      >

        <div class="notification-icon">
          {{ notification.icon }}
        </div>


        <div class="notification-content">

          <div class="notification-top">

            <strong>
              {{ notification.title }}
            </strong>

            <span>
              {{ notification.date }}
            </span>

          </div>


          <p>
            {{ notification.text }}
          </p>


          <span class="notification-order">
            Заказ #{{ notification.orderId }}
          </span>

        </div>


        <div
          v-if="!notification.read"
          class="unread-dot"
        ></div>

      </article>

    </section>

  </main>
</template>


<script setup>

import {
  computed,
  onMounted,
  ref
} from "vue";

import {
  useRouter
} from "vue-router";

import {
  store
} from "../store";


const router = useRouter();


const readNotifications = ref(
  JSON.parse(
    localStorage.getItem(
      "blessedReadNotifications"
    ) || "[]"
  )
);


/* =====================================================
   STATUS TEXT
===================================================== */

function getNotificationData(order) {

  switch (order.status) {

    case "Принят":

      return {
        title: "Заказ принят",
        text: "Мы получили ваш заказ и начали его обработку.",
        icon: "✓"
      };


    case "Собирается":

      return {
        title: "Заказ собирается",
        text: "Ваш заказ сейчас собирается на складе.",
        icon: "□"
      };


    case "В пути":

      return {
        title: "Заказ в пути",
        text: "Ваш заказ уже передан в доставку.",
        icon: "→"
      };


    case "Доставлен":

      return {
        title: "Заказ доставлен",
        text: "Ваш заказ был доставлен.",
        icon: "✓"
      };


    default:

      return {
        title: "Обновление заказа",
        text: "Статус вашего заказа был обновлён.",
        icon: "!"
      };

  }

}


/* =====================================================
   DATE
===================================================== */

function formatDate(date) {

  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "ru-RU",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );

}


/* =====================================================
   NOTIFICATIONS
===================================================== */

const notifications = computed(() => {

  return store.orders.map(order => {

    const data =
      getNotificationData(order);

    const notificationId =
      `order-${order.id}-${order.status}`;

    return {

      id: notificationId,

      orderId:
        order.id,

      title:
        data.title,

      text:
        data.text,

      icon:
        data.icon,

      date:
        formatDate(order.order_date),

      read:
        readNotifications.value.includes(
          notificationId
        )

    };

  });

});


const unreadCount = computed(() => {

  return notifications.value.filter(
    notification =>
      !notification.read
  ).length;

});


/* =====================================================
   READ
===================================================== */

function markAllAsRead() {

  readNotifications.value =
    notifications.value.map(
      notification =>
        notification.id
    );


  localStorage.setItem(
    "blessedReadNotifications",
    JSON.stringify(
      readNotifications.value
    )
  );


  window.dispatchEvent(
    new Event(
      "notifications-updated"
    )
  );

}


function markAsRead(notification) {

  if (
    !readNotifications.value.includes(
      notification.id
    )
  ) {

    readNotifications.value.push(
      notification.id
    );

    localStorage.setItem(
      "blessedReadNotifications",
      JSON.stringify(
        readNotifications.value
      )
    );

  }

}


/* =====================================================
   OPEN ORDER
===================================================== */

function openOrder(orderId) {

  const notification =
    notifications.value.find(
      item =>
        item.orderId === orderId
    );


  if (notification) {

    markAsRead(
      notification
    );

  }


  window.dispatchEvent(
    new Event(
      "notifications-updated"
    )
  );


  router.push("/profile");

}


onMounted(() => {

  window.dispatchEvent(
    new Event(
      "notifications-updated"
    )
  );

});

</script>


<style scoped>

.notifications-page {
  min-height: calc(100vh - 70px);

  padding:
    55px
    44px
    80px;

  background:
    #f4f3ef;

  color:
    #111;
}


/* HEADER */

.notifications-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    flex-end;

  gap:
    30px;

  margin-bottom:
    55px;

  padding-bottom:
    30px;

  border-bottom:
    1px solid #111;

}


.notifications-label {

  margin:
    0 0 12px;

  font-size:
    11px;

  letter-spacing:
    2px;

  text-transform:
    uppercase;

}


.notifications-header h1 {

  margin:
    0;

  font-size:
    52px;

  line-height:
    1;

  font-weight:
    600;

  letter-spacing:
    -2px;

}


.notifications-subtitle {

  margin:
    18px 0 0;

  font-size:
    14px;

  color:
    #555;

}


.notifications-counter {

  min-width:
    80px;

  text-align:
    right;

}


.notifications-counter span {

  display:
    block;

  font-size:
    10px;

  letter-spacing:
    1.5px;

  margin-bottom:
    5px;

}


.notifications-counter strong {

  font-size:
    34px;

  font-weight:
    500;

}


/* TOP */

.notifications-top {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    20px;

  font-size:
    13px;

}


.read-button {

  border:
    none;

  background:
    transparent;

  padding:
    0;

  font-size:
    12px;

  text-decoration:
    underline;

  cursor:
    pointer;

}


.read-button:hover {

  opacity:
    .55;

}


/* LIST */

.notifications-list {

  max-width:
    900px;

}


.notification-card {

  position:
    relative;

  display:
    flex;

  align-items:
    flex-start;

  gap:
    18px;

  padding:
    22px 24px;

  margin-bottom:
    10px;

  border:
    1px solid #d6d4cf;

  background:
    #eeece7;

  cursor:
    pointer;

  transition:
    .2s ease;

}


.notification-card:hover {

  background:
    #e7e5df;

}


.notification-card.unread {

  border-color:
    #111;

}


.notification-icon {

  width:
    38px;

  height:
    38px;

  flex-shrink:
    0;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border:
    1px solid #111;

  font-size:
    16px;

}


.notification-content {

  flex:
    1;

}


.notification-top {

  display:
    flex;

  justify-content:
    space-between;

  gap:
    20px;

}


.notification-top strong {

  font-size:
    15px;

  font-weight:
    600;

}


.notification-top span {

  font-size:
    11px;

  color:
    #777;

  white-space:
    nowrap;

}


.notification-content p {

  margin:
    8px 0;

  font-size:
    13px;

  line-height:
    1.5;

  color:
    #555;

}


.notification-order {

  font-size:
    11px;

  color:
    #777;

}


.unread-dot {

  width:
    7px;

  height:
    7px;

  border-radius:
    50%;

  background:
    #111;

  position:
    absolute;

  top:
    15px;

  right:
    15px;

}


/* EMPTY */

.notifications-empty {

  min-height:
    420px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  text-align:
    center;

}


.empty-icon {

  font-size:
    70px;

  line-height:
    1;

  margin-bottom:
    25px;

}


.notifications-empty h2 {

  margin:
    0;

  font-size:
    28px;

  font-weight:
    500;

}


.notifications-empty p {

  max-width:
    430px;

  margin:
    12px 0 25px;

  color:
    #666;

  font-size:
    14px;

  line-height:
    1.5;

}


.catalog-button {

  display:
    inline-flex;

  align-items:
    center;

  justify-content:
    center;

  min-height:
    44px;

  padding:
    0 24px;

  background:
    #111;

  color:
    #fff;

  text-decoration:
    none;

  font-size:
    12px;

  text-transform:
    uppercase;

  letter-spacing:
    1px;

}


.catalog-button:hover {

  opacity:
    .8;

}


/* MOBILE */

@media (max-width: 700px) {

  .notifications-page {

    padding:
      35px
      20px
      60px;

  }


  .notifications-header {

    align-items:
      flex-start;

    flex-direction:
      column;

    margin-bottom:
      35px;

  }


  .notifications-header h1 {

    font-size:
      40px;

  }


  .notifications-counter {

    text-align:
      left;

  }


  .notification-card {

    padding:
      18px;

  }


  .notification-top {

    flex-direction:
      column;

    gap:
      5px;

  }

}

</style>