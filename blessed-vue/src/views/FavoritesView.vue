<template>
  <main class="favorites-page">
    <section class="favorites-header">
      <div>
        <p class="favorites-label">BLESSED / SAVED</p>

        <h1>Избранное</h1>

        <p class="favorites-subtitle">
          Сохранённые товары, которые вам понравились.
        </p>
      </div>

      <div class="favorites-counter">
        <span>ТОВАРОВ</span>
        <strong>{{ store.favorites.length }}</strong>
      </div>
    </section>

    <section
      v-if="store.favorites.length === 0"
      class="favorites-empty"
    >
      <div class="empty-heart">
        ♡
      </div>

      <h2>Избранное пусто</h2>

      <p>
        Добавьте товары в избранное, чтобы вернуться к ним позже.
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
      class="favorites-products"
    >
      <div class="favorites-top">
        <span>
          {{ store.favorites.length }}
          {{ store.favorites.length === 1 ? "товар" : "товаров" }}
        </span>

        <button
          type="button"
          class="clear-button"
          @click="clearFavorites"
        >
          Очистить избранное
        </button>
      </div>

      <div class="favorites-grid">
        <article
          v-for="product in store.favorites"
          :key="product.id"
          class="favorite-card"
        >
          <RouterLink
            :to="`/product/${product.id}`"
            class="favorite-image-link"
          >
            <div class="favorite-image">
              <img
                v-if="product.image"
                :src="getImageUrl(product.image)"
                :alt="product.name"
              />

              <div
                v-else
                class="no-image"
              >
                NO IMAGE
              </div>
            </div>
          </RouterLink>

          <div class="favorite-info">
            <div class="favorite-name-row">
              <RouterLink
                :to="`/product/${product.id}`"
                class="favorite-name"
              >
                {{ product.name }}
              </RouterLink>

              <button
                type="button"
                class="remove-button"
                title="Удалить из избранного"
                @click="removeFavorite(product.id)"
              >
                ♥
              </button>
            </div>

            <p
              v-if="product.brand"
              class="favorite-brand"
            >
              {{ product.brand }}
            </p>

            <p
              v-if="product.type"
              class="favorite-type"
            >
              {{ product.type }}
            </p>

            <strong class="favorite-price">
              {{ formatPrice(product.price) }} ₸
            </strong>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { store, toggleFavorite } from "../store";

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/images/${image.replace(/^images\//, "")}`;
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("ru-RU");
}

async function removeFavorite(productId) {
  try {
    await toggleFavorite(productId);
  } catch (error) {
    alert(
      error.message ||
      "Не удалось удалить товар из избранного."
    );
  }
}

async function clearFavorites() {
  if (!store.favorites.length) {
    return;
  }

  const confirmed = window.confirm(
    "Удалить все товары из избранного?"
  );

  if (!confirmed) {
    return;
  }

  const favorites = [...store.favorites];

  try {
    for (const product of favorites) {
      await toggleFavorite(product.id);
    }
  } catch (error) {
    alert(
      error.message ||
      "Не удалось очистить избранное."
    );
  }
}
</script>

<style scoped>
.favorites-page {
  min-height: calc(100vh - 91px);
  padding: 55px 44px 80px;
  background: #f4f3ef;
  color: #111;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 55px;
  border-bottom: 1px solid #111;
  padding-bottom: 30px;
}

.favorites-label {
  margin: 0 0 12px;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.favorites-header h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -2px;
}

.favorites-subtitle {
  margin: 18px 0 0;
  font-size: 14px;
  color: #555;
}

.favorites-counter {
  min-width: 100px;
  text-align: right;
}

.favorites-counter span {
  display: block;
  font-size: 10px;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
}

.favorites-counter strong {
  font-size: 34px;
  font-weight: 500;
}

.favorites-products {
  width: 100%;
}

.favorites-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 13px;
}

.clear-button {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
}

.clear-button:hover {
  opacity: 0.55;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px 18px;
}

.favorite-card {
  min-width: 0;
}

.favorite-image-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.favorite-image {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: #e9e8e4;
  overflow: hidden;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.favorite-image-link:hover .favorite-image img {
  transform: scale(1.03);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  letter-spacing: 1px;
  color: #777;
}

.favorite-info {
  padding-top: 13px;
}

.favorite-name-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.favorite-name {
  color: #111;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.3;
}

.favorite-name:hover {
  text-decoration: underline;
}

.remove-button {
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
}

.remove-button:hover {
  opacity: 0.5;
}

.favorite-brand,
.favorite-type {
  margin: 5px 0 0;
  font-size: 11px;
  color: #777;
}

.favorite-price {
  display: block;
  margin-top: 9px;
  font-size: 14px;
  font-weight: 500;
}

.favorites-empty {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-heart {
  font-size: 70px;
  line-height: 1;
  margin-bottom: 25px;
}

.favorites-empty h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 500;
}

.favorites-empty p {
  max-width: 420px;
  margin: 12px 0 25px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.catalog-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 24px;
  background: #111;
  color: #fff;
  text-decoration: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.catalog-button:hover {
  opacity: 0.8;
}

@media (max-width: 1100px) {
  .favorites-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .favorites-page {
    padding: 35px 20px 60px;
  }

  .favorites-header {
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 35px;
  }

  .favorites-header h1 {
    font-size: 40px;
  }

  .favorites-counter {
    text-align: left;
  }

  .favorites-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px 12px;
  }
}

@media (max-width: 500px) {
  .favorites-grid {
    grid-template-columns: 1fr 1fr;
  }

  .favorite-name {
    font-size: 12px;
  }

  .favorite-price {
    font-size: 12px;
  }
}
</style>