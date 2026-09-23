const API_URL = `${import.meta.env.VITE_API_URL}/api`;


async function request(url, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${url}`,
        {
            ...options,
            headers
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Ошибка сервера"
        );
    }

    return data;
}


// =========================
// AUTH
// =========================

export async function registerUser(data) {

    return request(
        "/register",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );

}


export async function loginUser(data) {

    return request(
        "/login",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );

}


// =========================
// PRODUCTS
// =========================

export async function getProducts() {

    return request("/products");

}


// =========================
// PROFILE
// =========================

export async function getProfile() {

    return request("/profile");

}


export async function updateProfile(data) {

    return request(
        "/profile",
        {
            method: "PATCH",
            body: JSON.stringify(data)
        }
    );

}


// =========================
// CART
// =========================

export async function getCart() {

    return request("/cart");

}


export async function addCartItem(
    product_id,
    size,
    quantity = 1
) {

    return request(
        "/cart",
        {
            method: "POST",
            body: JSON.stringify({
                product_id,
                size,
                quantity
            })
        }
    );

}


export async function updateCartItem(
    product_id,
    size,
    quantity
) {

    return request(
        "/cart",
        {
            method: "PATCH",
            body: JSON.stringify({
                product_id,
                size,
                quantity
            })
        }
    );

}


export async function deleteCartItem(
    product_id,
    size
) {

    return request(
        "/cart",
        {
            method: "DELETE",
            body: JSON.stringify({
                product_id,
                size
            })
        }
    );

}


// =========================
// FAVORITES
// =========================

export async function getFavorites() {

    return request("/favorites");

}


export async function addFavorite(productId) {

    return request(
        `/favorites/${productId}`,
        {
            method: "POST"
        }
    );

}


export async function removeFavorite(productId) {

    return request(
        `/favorites/${productId}`,
        {
            method: "DELETE"
        }
    );

}


// =========================
// ORDERS
// =========================

export async function getOrders() {

    return request("/orders");

}


export async function createOrder() {

    return request(
        "/orders",
        {
            method: "POST"
        }
    );

}


// =========================
// REVIEWS
// =========================

export async function getProductReviews(productId) {

    return request(`/products/${productId}/reviews`);

}


export async function addProductReview(productId, rating, text) {

    return request(
        `/products/${productId}/reviews`,
        {
            method: "POST",
            body: JSON.stringify({
                rating,
                text
            })
        }
    );

}


export async function getSiteReviews() {

    return request("/site-reviews");

}


export async function addSiteReview(rating, text) {

    return request(
        "/site-reviews",
        {
            method: "POST",
            body: JSON.stringify({
                rating,
                text
            })
        }
    );

}


// =========================
// AI PHOTO SEARCH
// =========================

export async function searchProductsByPhoto(image) {

    return request(
        "/ai-search",
        {
            method: "POST",
            body: JSON.stringify({
                image
            })
        }
    );

}