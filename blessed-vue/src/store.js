import { reactive } from "vue";

export const store = reactive({
    cart: JSON.parse(localStorage.getItem("cart") || "[]"),
    favorites: JSON.parse(localStorage.getItem("favorites") || "[]")
});


function save() {
    localStorage.setItem(
        "cart",
        JSON.stringify(store.cart)
    );

    localStorage.setItem(
        "favorites",
        JSON.stringify(store.favorites)
    );
}


export function addToCart(id, size = "") {

    const item = store.cart.find(item =>
        item.id === id && item.size === size
    );

    if (item) {
        item.quantity++;
    } else {
        store.cart.push({
            id,
            size,
            quantity: 1
        });
    }

    save();
}


export function changeQuantity(id, size, amount) {

    const item = store.cart.find(item =>
        item.id === id && item.size === size
    );

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        store.cart = store.cart.filter(item =>
            !(item.id === id && item.size === size)
        );
    }

    save();
}


export function removeFromCart(id, size) {

    store.cart = store.cart.filter(item =>
        !(item.id === id && item.size === size)
    );

    save();
}


export function clearCart() {

    store.cart = [];

    save();
}


export function toggleFavorite(id) {

    if (store.favorites.includes(id)) {

        store.favorites = store.favorites.filter(
            item => item !== id
        );

    } else {

        store.favorites.push(id);

    }

    save();
}