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

    return {

        id: card.dataset.id,

        name: card.dataset.name,

        category: card.dataset.category,

        price: Number(card.dataset.price),

        image: card.dataset.image

    };

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
            item => item.id === product.id
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
            item => item.id !== productId
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
            item => item.id === productId
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


        cartTotal.textContent = "0 ₸";

        return;

    }


    let total = 0;


    cart.forEach(function(item) {

        total +=
            item.price * item.quantity;


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
                        data-action="remove"
                        data-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;


        cartContent.appendChild(cartItem);

    });


    cartTotal.textContent =
        formatPrice(total);


    // Quantity buttons

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


                    if (action === "plus") {

                        changeQuantity(id, 1);

                    }


                    if (action === "minus") {

                        changeQuantity(id, -1);

                    }

                }
            );

        }
    );


    // Remove buttons

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
// UPDATE CART COUNTER
// =========================

function updateCounters() {

    let cartItems = 0;


    cart.forEach(function(item) {

        cartItems += item.quantity;

    });


    cartCounter.textContent =
        cartItems;


    favoritesCounter.textContent =
        favorites.length;

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
                favorites.includes(productId)
            ) {

                button.textContent = "♥";

                button.classList.add(
                    "active"
                );

            } else {

                button.textContent = "♡";

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
        favorites.indexOf(product.id);


    if (index === -1) {

        favorites.push(product.id);

    } else {

        favorites.splice(index, 1);

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

    favoritesContent.innerHTML = "";


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


    favorites.forEach(function(id) {

        const card =
            document.querySelector(
                `.product-card[data-id="${id}"]`
            );


        if (!card) {
            return;
        }


        const product =
            getProductData(card);


        const item =
            document.createElement("div");


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


        favoritesContent.appendChild(item);

    });


    // Add favorite item to cart

    const favoriteCartButtons =
        favoritesContent.querySelectorAll(
            ".favorite-cart-button"
        );


    favoriteCartButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const card =
                        document.querySelector(
                            `.product-card[data-id="${button.dataset.id}"]`
                        );


                    if (!card) {
                        return;
                    }


                    addToCart(
                        getProductData(card)
                    );

                }
            );

        }
    );


    // Remove favorite

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
// REMOVE FAVORITE BY ID
// =========================

function toggleFavoriteById(id) {

    const index =
        favorites.indexOf(id);


    if (index !== -1) {

        favorites.splice(index, 1);

    }


    saveData();

    updateFavoriteButtons();

    updateCounters();

    updateFavorites();

}


// =========================
// PRODUCT BUTTONS
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


        // Favorite

        favoriteButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                toggleFavorite(
                    getProductData(card)
                );

            }
        );


        // Cart

        addCartButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                addToCart(
                    getProductData(card)
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
);


// =========================
// SEARCH
// =========================

function searchProducts() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    let foundProducts = 0;


    productCards.forEach(
        function(card) {

            const productName =
                card.dataset.name
                    .toLowerCase();


            const productCategory =
                card.dataset.category
                    .toLowerCase();


            const productText =
                productName +
                " " +
                productCategory;


            if (
                searchText === "" ||
                productText.includes(searchText)
            ) {

                card.style.display = "";

                foundProducts++;

            } else {

                card.style.display =
                    "none";

            }

        }
    );


    // Hide empty sections

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


    // No results

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


searchInput.addEventListener(
    "input",
    searchProducts
);


searchButton.addEventListener(
    "click",
    searchProducts
);


searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    }
);


// =========================
// OPEN CART
// =========================

cartButton.addEventListener(
    "click",
    function() {

        updateCart();

        cartModal.classList.add(
            "active"
        );

    }
);


// =========================
// CLOSE CART
// =========================

closeCart.addEventListener(
    "click",
    function() {

        cartModal.classList.remove(
            "active"
        );

    }
);


// =========================
// OPEN FAVORITES
// =========================

favoritesButton.addEventListener(
    "click",
    function() {

        updateFavorites();

        favoritesModal.classList.add(
            "active"
        );

    }
);


// =========================
// CLOSE FAVORITES
// =========================

closeFavorites.addEventListener(
    "click",
    function() {

        favoritesModal.classList.remove(
            "active"
        );

    }
);


// =========================
// CLOSE MODAL BY BACKGROUND
// =========================

cartModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === cartModal
        ) {

            cartModal.classList.remove(
                "active"
            );

        }

    }
);


favoritesModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === favoritesModal
        ) {

            favoritesModal.classList.remove(
                "active"
            );

        }

    }
);


// =========================
// CLEAR CART
// =========================

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


// =========================
// CHECKOUT
// =========================

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


// =========================
// INITIALIZE
// =========================

updateCart();

updateFavorites();

updateCounters();

updateFavoriteButtons();