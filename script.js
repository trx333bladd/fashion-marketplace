// =========================
// BLESSED SHOP
// =========================


// =========================
// PRODUCT PAGE
// =========================

const productPageId =
    new URLSearchParams(window.location.search).get("id");


// =========================
// ELEMENTS
// =========================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const productCards =
    document.querySelectorAll(".product-card");

const productSections =
    document.querySelectorAll(".products");

const noResults =
    document.getElementById("noResults");


// =========================
// MODALS
// =========================

const cartModal =
    document.getElementById("cartModal");

const favoritesModal =
    document.getElementById("favoritesModal");

const cartButton =
    document.getElementById("cartButton");

const favoritesButton =
    document.getElementById("favoritesButton");

const closeCart =
    document.getElementById("closeCart");

const closeFavorites =
    document.getElementById("closeFavorites");


// =========================
// CART ELEMENTS
// =========================

const cartContent =
    document.getElementById("cartContent");

const cartTotal =
    document.getElementById("cartTotal");

const cartCounter =
    document.getElementById("cartCounter");

const clearCartButton =
    document.getElementById("clearCart");

const checkoutButton =
    document.getElementById("checkoutButton");


// =========================
// FAVORITES ELEMENTS
// =========================

const favoritesContent =
    document.getElementById("favoritesContent");

const favoritesCounter =
    document.getElementById("favoritesCounter");


// =========================
// LOCAL STORAGE
// =========================

let cart =
    JSON.parse(
        localStorage.getItem("blessedCart")
    ) || [];


let favorites =
    JSON.parse(
        localStorage.getItem("blessedFavorites")
    ) || [];


// =========================
// SAVE DATA
// =========================

function saveData() {

    localStorage.setItem(
        "blessedCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "blessedFavorites",
        JSON.stringify(favorites)
    );

}


// =========================
// GET PRODUCT DATA
// =========================

function getProductData(card) {

    let id =
        card.dataset.id;

    let name =
        card.dataset.name;

    let category =
        card.dataset.category;

    let price =
        Number(card.dataset.price);

    let image =
        card.dataset.image;


    if (!id) {

        id =
            name
                .toLowerCase()
                .replace(/[^a-z0-9а-яё]+/gi, "-")
                .replace(/^-|-$/g, "");

    }


    return {

        id: id,

        name: name,

        category: category,

        price: price,

        image: image,

        description:
            card.dataset.description ||
            "A stylish product from Blessed Shop."

    };

}


// =========================
// SAVE PRODUCTS
// =========================

function saveProductsFromPage() {

    const products = [];


    productCards.forEach(
        function(card) {

            const product =
                getProductData(card);


            const exists =
                products.some(
                    item =>
                        item.id === product.id
                );


            if (!exists) {

                products.push(product);

            }

        }
    );


    if (products.length > 0) {

        localStorage.setItem(
            "blessedProducts",
            JSON.stringify(products)
        );

    }

}


// =========================
// GET ALL PRODUCTS
// =========================

function getSavedProducts() {

    return JSON.parse(
        localStorage.getItem(
            "blessedProducts"
        )
    ) || [];

}


// =========================
// FORMAT PRICE
// =========================

function formatPrice(price) {

    return price
        .toLocaleString("ru-RU")
        + " ₸";

}


// =========================
// ADD TO CART
// =========================

function addToCart(product) {

    const existingProduct =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveData();

    updateCart();

    updateCounters();

}


// =========================
// REMOVE FROM CART
// =========================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveData();

    updateCart();

    updateCounters();

}


// =========================
// CHANGE QUANTITY
// =========================

function changeQuantity(
    productId,
    change
) {

    const product =
        cart.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    product.quantity += change;


    if (product.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveData();

    updateCart();

    updateCounters();

}


// =========================
// UPDATE CART
// =========================

function updateCart() {

    if (!cartContent) {

        return;

    }


    cartContent.innerHTML = "";


    if (cart.length === 0) {

        cartContent.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you like.
                </p>

            </div>

        `;


        if (cartTotal) {

            cartTotal.textContent =
                "0 ₸";

        }


        return;

    }


    let total = 0;


    cart.forEach(
        function(item) {

            total +=
                item.price *
                item.quantity;


            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="cart-item-price">
                        ${formatPrice(item.price)}
                    </p>

                    <div class="cart-item-actions">

                        <button
                            class="quantity-button"
                            data-action="minus"
                            data-id="${item.id}"
                        >
                            −
                        </button>

                        <span class="quantity">
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button"
                            data-action="plus"
                            data-id="${item.id}"
                        >
                            +
                        </button>

                        <button
                            class="remove-button"
                            data-id="${item.id}"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;


            cartContent.appendChild(
                cartItem
            );

        }
    );


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(total);

    }


    const quantityButtons =
        cartContent.querySelectorAll(
            ".quantity-button"
        );


    quantityButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        button.dataset.id;

                    const action =
                        button.dataset.action;


                    if (
                        action === "plus"
                    ) {

                        changeQuantity(
                            id,
                            1
                        );

                    }


                    if (
                        action === "minus"
                    ) {

                        changeQuantity(
                            id,
                            -1
                        );

                    }

                }
            );

        }
    );


    const removeButtons =
        cartContent.querySelectorAll(
            ".remove-button"
        );


    removeButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    removeFromCart(
                        button.dataset.id
                    );

                }
            );

        }
    );

}


// =========================
// UPDATE COUNTERS
// =========================

function updateCounters() {

    let cartItems = 0;


    cart.forEach(
        function(item) {

            cartItems +=
                item.quantity;

        }
    );


    if (cartCounter) {

        cartCounter.textContent =
            cartItems;

    }


    if (favoritesCounter) {

        favoritesCounter.textContent =
            favorites.length;

    }

}


// =========================
// UPDATE FAVORITE BUTTONS
// =========================

function updateFavoriteButtons() {

    productCards.forEach(
        function(card) {

            const button =
                card.querySelector(
                    ".favorite-button"
                );


            if (!button) {

                return;

            }


            const productId =
                card.dataset.id;


            if (
                favorites.includes(
                    productId
                )
            ) {

                button.textContent =
                    "♥";

                button.classList.add(
                    "active"
                );

            } else {

                button.textContent =
                    "♡";

                button.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =========================
// TOGGLE FAVORITE
// =========================

function toggleFavorite(product) {

    const index =
        favorites.indexOf(
            product.id
        );


    if (index === -1) {

        favorites.push(
            product.id
        );

    } else {

        favorites.splice(
            index,
            1
        );

    }


    saveData();

    updateFavoriteButtons();

    updateCounters();

    updateFavorites();

}


// =========================
// UPDATE FAVORITES
// =========================

function updateFavorites() {

    if (!favoritesContent) {

        return;

    }


    favoritesContent.innerHTML =
        "";


    if (favorites.length === 0) {

        favoritesContent.innerHTML = `

            <div class="empty-favorites">

                <h3>
                    No favorites yet
                </h3>

                <p>
                    Click ♡ on a product to save it.
                </p>

            </div>

        `;


        return;

    }


    const products =
        getSavedProducts();


    favorites.forEach(
        function(id) {

            const product =
                products.find(
                    item =>
                        item.id === id
                );


            if (!product) {

                return;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "favorite-item";


            item.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="favorite-item-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${formatPrice(product.price)}
                    </p>

                    <div class="favorite-actions">

                        <button
                            class="favorite-cart-button"
                            data-id="${product.id}"
                        >
                            Add to cart
                        </button>

                        <button
                            class="favorite-remove-button"
                            data-id="${product.id}"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;


            favoritesContent.appendChild(
                item
            );

        }
    );


    const favoriteCartButtons =
        favoritesContent.querySelectorAll(
            ".favorite-cart-button"
        );


    favoriteCartButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const products =
                        getSavedProducts();


                    const product =
                        products.find(
                            item =>
                                item.id ===
                                button.dataset.id
                        );


                    if (product) {

                        addToCart(
                            product
                        );

                    }

                }
            );

        }
    );


    const favoriteRemoveButtons =
        favoritesContent.querySelectorAll(
            ".favorite-remove-button"
        );


    favoriteRemoveButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    toggleFavoriteById(
                        button.dataset.id
                    );

                }
            );

        }
    );

}


// =========================
// REMOVE FAVORITE
// =========================

function toggleFavoriteById(id) {

    const index =
        favorites.indexOf(id);


    if (index !== -1) {

        favorites.splice(
            index,
            1
        );

    }


    saveData();

    updateFavoriteButtons();

    updateCounters();

    updateFavorites();

}


// =========================
// PRODUCT CARDS
// =========================

productCards.forEach(
    function(card) {

        const favoriteButton =
            card.querySelector(
                ".favorite-button"
            );


        const addCartButton =
            card.querySelector(
                ".add-cart-button"
            );


        // Save product

        const product =
            getProductData(card);


        // Favorite

        if (favoriteButton) {

            favoriteButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    toggleFavorite(
                        product
                    );

                }
            );

        }


        // Add to cart

        if (addCartButton) {

            addCartButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    addToCart(
                        product
                    );


                    addCartButton.textContent =
                        "Added ✓";


                    setTimeout(
                        function() {

                            addCartButton.textContent =
                                "Add to cart";

                        },
                        1200
                    );

                }
            );

        }


        // Open product

        card.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.closest(
                        ".favorite-button"
                    ) ||
                    event.target.closest(
                        ".add-cart-button"
                    )
                ) {

                    return;

                }


                saveProductsFromPage();


                window.location.href =
                    "product.html?id=" +
                    encodeURIComponent(
                        product.id
                    );

            }
        );

    }
);


// =========================
// SEARCH
// =========================

function searchProducts() {

    if (!searchInput) {

        return;

    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    let foundProducts = 0;


    productCards.forEach(
        function(card) {

            const productName =
                (
                    card.dataset.name ||
                    ""
                ).toLowerCase();


            const productCategory =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            const productText =
                productName +
                " " +
                productCategory;


            if (
                searchText === "" ||
                productText.includes(
                    searchText
                )
            ) {

                card.style.display =
                    "";

                foundProducts++;

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    productSections.forEach(
        function(section) {

            const visibleProducts =
                Array.from(
                    section.querySelectorAll(
                        ".product-card"
                    )
                ).filter(
                    card =>
                        card.style.display !==
                        "none"
                );


            if (
                searchText !== "" &&
                visibleProducts.length === 0
            ) {

                section.style.display =
                    "none";

            } else {

                section.style.display =
                    "";

            }

        }
    );


    if (!noResults) {

        return;

    }


    if (
        searchText !== "" &&
        foundProducts === 0
    ) {

        noResults.style.display =
            "block";

    } else {

        noResults.style.display =
            "none";

    }

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );


    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                searchProducts();

            }

        }
    );

}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchProducts
    );

}


// =========================
// OPEN CART
// =========================

if (cartButton) {

    cartButton.addEventListener(
        "click",
        function() {

            updateCart();

            cartModal.classList.add(
                "active"
            );

        }
    );

}


// =========================
// CLOSE CART
// =========================

if (closeCart) {

    closeCart.addEventListener(
        "click",
        function() {

            cartModal.classList.remove(
                "active"
            );

        }
    );

}


// =========================
// OPEN FAVORITES
// =========================

if (favoritesButton) {

    favoritesButton.addEventListener(
        "click",
        function() {

            updateFavorites();

            favoritesModal.classList.add(
                "active"
            );

        }
    );

}


// =========================
// CLOSE FAVORITES
// =========================

if (closeFavorites) {

    closeFavorites.addEventListener(
        "click",
        function() {

            favoritesModal.classList.remove(
                "active"
            );

        }
    );

}


// =========================
// MODAL BACKGROUND
// =========================

if (cartModal) {

    cartModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                cartModal
            ) {

                cartModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


if (favoritesModal) {

    favoritesModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                favoritesModal
            ) {

                favoritesModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =========================
// CLEAR CART
// =========================

if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                return;

            }


            cart = [];


            saveData();

            updateCart();

            updateCounters();

        }
    );

}


// =========================
// CHECKOUT
// =========================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function() {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            alert(
                "Checkout will be available soon!"
            );

        }
    );

}


// ======================================================
// PRODUCT DETAIL PAGE
// ======================================================

function openProductPage() {

    if (!productPageId) {

        return;

    }


    const products =
        getSavedProducts();


    const product =
        products.find(
            item =>
                item.id ===
                productPageId
        );


    if (!product) {

        document.body.innerHTML = `

            <div style="
                padding: 60px;
                font-family: Arial, sans-serif;
            ">

                <a
                    href="javascript:history.back()"
                    style="
                        color: #333;
                        text-decoration: none;
                        font-size: 18px;
                    "
                >
                    ← Back
                </a>

                <h1 style="
                    margin-top: 60px;
                    font-size: 48px;
                ">
                    Product not found
                </h1>

                <p style="
                    font-size: 18px;
                    color: #777;
                ">
                    This product is no longer available.
                </p>

            </div>

        `;

        return;

    }


    document.body.innerHTML = `

        <div class="product-page">

            <a
                href="javascript:history.back()"
                class="product-back"
            >
                ← Back
            </a>


            <div class="product-breadcrumbs">

                Home
                /
                ${product.category}

                /
                ${product.name}

            </div>


            <h1 class="product-page-title">
                ${product.name}
            </h1>


            <div class="product-detail">

                <div class="product-detail-image">

                    <button
                        class="detail-favorite"
                        id="detailFavorite"
                    >
                        ${favorites.includes(product.id)
                            ? "♥"
                            : "♡"}
                    </button>


                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-detail-info">

                    <div class="detail-category">
                        ${product.category}
                    </div>


                    <h2>
                        ${product.name}
                    </h2>


                    <div class="detail-price">
                        ${formatPrice(product.price)}
                    </div>


                    <div class="detail-description">

                        <h3>
                            Description
                        </h3>

                        <p>
                            ${product.description}
                        </p>

                    </div>


                    <button
                        class="detail-cart"
                        id="detailCart"
                    >
                        Add to cart
                    </button>


                    <div class="detail-info-row">

                        <span>
                            Category
                        </span>

                        <strong>
                            ${product.category}
                        </strong>

                    </div>


                    <div class="detail-info-row">

                        <span>
                            Availability
                        </span>

                        <strong>
                            In stock
                        </strong>

                    </div>

                </div>

            </div>

        </div>

    `;


    addProductPageStyles();


    const detailCart =
        document.getElementById(
            "detailCart"
        );


    const detailFavorite =
        document.getElementById(
            "detailFavorite"
        );


    detailCart.addEventListener(
        "click",
        function() {

            addToCart(product);


            detailCart.textContent =
                "Added ✓";


            setTimeout(
                function() {

                    detailCart.textContent =
                        "Add to cart";

                },
                1200
            );

        }
    );


    detailFavorite.addEventListener(
        "click",
        function() {

            toggleFavorite(
                product
            );


            if (
                favorites.includes(
                    product.id
                )
            ) {

                detailFavorite.textContent =
                    "♥";

            } else {

                detailFavorite.textContent =
                    "♡";

            }

        }
    );

}


// =========================
// PRODUCT PAGE STYLES
// =========================

function addProductPageStyles() {

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        * {
            box-sizing: border-box;
        }


        body {
            margin: 0;
            background: #ffffff;
            color: #111111;
            font-family: Arial, sans-serif;
        }


        .product-page {
            max-width: 1400px;
            margin: 0 auto;
            padding: 55px 60px 100px;
        }


        .product-back {
            display: inline-block;
            color: #333;
            text-decoration: none;
            font-size: 18px;
            margin-bottom: 45px;
        }


        .product-back:hover {
            text-decoration: underline;
        }


        .product-breadcrumbs {
            color: #777;
            font-size: 15px;
            margin-bottom: 25px;
        }


        .product-page-title {
            font-size: 38px;
            margin: 0 0 45px;
            font-weight: 600;
        }


        .product-detail {
            display: grid;
            grid-template-columns: 52% 48%;
            gap: 70px;
            align-items: start;
        }


        .product-detail-image {
            position: relative;
            background: #f4f4f4;
            height: 620px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }


        .product-detail-image img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }


        .detail-favorite {
            position: absolute;
            z-index: 2;
            top: 22px;
            right: 22px;
            width: 52px;
            height: 52px;
            border: none;
            border-radius: 50%;
            background: white;
            font-size: 27px;
            cursor: pointer;
        }


        .product-detail-info {
            padding-top: 5px;
        }


        .detail-category {
            color: #777;
            font-size: 14px;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 15px;
        }


        .product-detail-info h2 {
            font-size: 34px;
            font-weight: 500;
            margin: 0 0 22px;
        }


        .detail-price {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 40px;
        }


        .detail-description {
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 25px 0;
            margin-bottom: 30px;
        }


        .detail-description h3 {
            font-size: 18px;
            margin: 0 0 12px;
        }


        .detail-description p {
            color: #666;
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
        }


        .detail-cart {
            width: 100%;
            height: 55px;
            border: none;
            background: #111;
            color: white;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 25px;
        }


        .detail-cart:hover {
            background: #333;
        }


        .detail-info-row {
            display: flex;
            justify-content: space-between;
            padding: 18px 0;
            border-bottom: 1px solid #ddd;
            font-size: 15px;
        }


        .detail-info-row span {
            color: #777;
        }


        @media (max-width: 800px) {

            .product-page {
                padding: 30px 20px;
            }


            .product-detail {
                grid-template-columns: 1fr;
                gap: 35px;
            }


            .product-detail-image {
                height: 450px;
            }


            .product-page-title {
                font-size: 30px;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// =========================
// INITIALIZE
// =========================

if (!productPageId) {

    saveProductsFromPage();

    updateCart();

    updateFavorites();

    updateCounters();

    updateFavoriteButtons();

} else {

    openProductPage();

}