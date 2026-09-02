// ТОВАРЫ

const products = [

    {
        id: "men-tshirt",
        name: "Ed Hardy T-Shirt",
        category: "men",
        type: "Футболки",
        price: 12990,
        image: "images/products/men/tshirt.jpg",
        brand: "Ed Hardy",
        description: {
            ru: "Повседневная футболка с принтом тигра в стиле Ed Hardy.",
            en: "Graphic everyday T-shirt with a distinctive design."
        }
    },

    {
        id: "men-hoodie",
        name: "Ed Hardy Hoodie",
        category: "men",
        type: "Кофты",
        price: 24990,
        image: "images/products/men/hoodie.jpg",
        brand: "Ed Hardy",
        description: {
            ru: "Удобная кофта с принтом тигра в стиле Ed Hardy.",
            en: "Comfortable hoodie with a bold graphic design."
        }
    },

    {
        id: "men-jeans",
        name: "Ed Hardy Jeans",
        category: "men",
        type: "Джинсы",
        price: 19990,
        image: "images/products/men/jeans.jpg",
        brand: "Ed Hardy",
        description: {
            ru: "Классические джинсы в стиле streetwear.",
            en: "Classic jeans with a relaxed streetwear style."
        }
    },

    {
        id: "men-mm6",
        name: "MM6 Sneakers",
        category: "men",
        type: "Кроссовки",
        price: 39990,
        image: "images/products/men/mm6 sneakers.jpg",
        brand: "MM6",
        description: {
            ru: "Современные кроссовки с лаконичным дизайном.",
            en: "Modern sneakers with a simple designer silhouette."
        }
    },


    {
        id: "women-tshirt",
        name: "Women's T-Shirt",
        category: "women",
        type: "Футболки",
        price: 12990,
        image: "images/products/women/women-tshirt.jpg",
        brand: "Blessed",
        description: {
            ru: "Простая футболка удобного кроя на каждый день.",
            en: "Simple everyday T-shirt with a comfortable fit."
        }
    },

    {
        id: "women-hoodie",
        name: "Women's Hoodie",
        category: "women",
        type: "Кофты",
        price: 24990,
        image: "images/products/women/women-hoodie.jpg",
        brand: "Blessed",
        description: {
            ru: "Свободная кофта для повседневных образов.",
            en: "Relaxed hoodie for everyday outfits."
        }
    },

    {
        id: "women-jeans",
        name: "Women's Jeans",
        category: "women",
        type: "Джинсы",
        price: 21990,
        image: "images/products/women/women-jeans.jpg",
        brand: "Blessed",
        description: {
            ru: "Повседневные джинсы с современным силуэтом.",
            en: "Everyday jeans with a clean modern silhouette."
        }
    },



    {
        id: "air-force-1",
        name: "Air Force 1",
        category: "shoes",
        type: "Кроссовки",
        price: 44990,
        image: "images/products/shoes/air-force-1.jpg",
        brand: "Nike",
        description: {
            ru: "Классические кроссовки для повседневного образа.",
            en: "Classic everyday sneakers with a clean streetwear look."
        }
    },

    {
        id: "air-max-95",
        name: "Air Max 95",
        category: "shoes",
        type: "Кроссовки",
        price: 49990,
        image: "images/products/shoes/air-max-95.jpg",
        brand: "Nike",
        description: {
            ru: "Спортивные кроссовки с узнаваемым дизайном.",
            en: "Sport-inspired sneakers with a recognizable design."
        }
    },

    {
        id: "shoes-mm6",
        name: "MM6 Sneakers",
        category: "shoes",
        type: "Дизайнерские кроссовки",
        price: 39990,
        image: "images/products/men/mm6 sneakers.jpg",
        brand: "MM6",
        description: {
            ru: "Минималистичные дизайнерские кроссовки.",
            en: "Minimal designer sneakers for everyday wear."
        }
    },

    {
        id: "shoes-women",
        name: "Puma Speedcat",
        category: "shoes",
        type: "Женская обувь",
        price: 34990,
        image: "images/products/women/women-shoes.jpg",
        brand: "Puma",
        description: {
            ru: "Удобная обувь для повседневных образов.",
            en: "Comfortable shoes for casual outfits."
        }
    }

];


// =========================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =========================

function getProduct(id) {

    return products.find(
        product => product.id === id
    );

}


function price(number) {

    return number.toLocaleString("ru-RU") + " ₸";

}


// =========================
// ИЗБРАННОЕ
// =========================

let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


function saveFavorites() {

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

}


function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites =
            favorites.filter(
                item => item !== id
            );

    } else {

        favorites.push(id);

    }


    saveFavorites();

    updateCounters();

}


// =========================
// КОРЗИНА
// =========================

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function addToCart(id) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (item) {

        item.quantity++;

    } else {

        cart.push({

            id: id,
            quantity: 1

        });

    }


    saveCart();

    updateCounters();

    showCart();

}


function updateCounters() {

    const cartCounter =
        document.getElementById(
            "cartCounter"
        );


    const favoritesCounter =
        document.getElementById(
            "favoritesCounter"
        );


    let count = 0;


    cart.forEach(
        item => {
            count += item.quantity;
        }
    );


    if (cartCounter) {

        cartCounter.textContent =
            count;

    }


    if (favoritesCounter) {

        favoritesCounter.textContent =
            favorites.length;

    }

}


// =========================
// DRAWER
// =========================

const drawer =
    document.getElementById(
        "sideDrawer"
    );


const drawerContent =
    document.getElementById(
        "drawerContent"
    );


const drawerFooter =
    document.getElementById(
        "drawerFooter"
    );


const drawerTitle =
    document.getElementById(
        "drawerTitle"
    );


function openDrawer(title) {

    if (!drawer) {
        return;
    }


    drawerTitle.textContent =
        title;


    drawer.classList.add(
        "active"
    );


    document
        .getElementById(
            "drawerBackdrop"
        )
        .classList.add(
            "active"
        );

}


function closeDrawer() {

    if (!drawer) {
        return;
    }


    drawer.classList.remove(
        "active"
    );


    document
        .getElementById(
            "drawerBackdrop"
        )
        .classList.remove(
            "active"
        );

}


const closeDrawerButton =
    document.getElementById(
        "drawerClose"
    );


if (closeDrawerButton) {

    closeDrawerButton.addEventListener(
        "click",
        closeDrawer
    );

}


const backdrop =
    document.getElementById(
        "drawerBackdrop"
    );


if (backdrop) {

    backdrop.addEventListener(
        "click",
        closeDrawer
    );

}


// =========================
// КОРЗИНА — ОТОБРАЖЕНИЕ
// =========================

function showCart() {

    if (!drawerContent) {
        return;
    }


    drawerContent.innerHTML = "";


    if (cart.length === 0) {

        drawerContent.innerHTML =
            "<p>Корзина пока пуста.</p>";

        drawerFooter.innerHTML = "";

        return;

    }


    let total = 0;


    cart.forEach(
        function (item) {

            const product =
                getProduct(item.id);


            total +=
                product.price *
                item.quantity;


            const block =
                document.createElement(
                    "div"
                );


            block.className =
                "cart-item";


            block.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${price(product.price)}
                    </p>

                    <div class="cart-actions">

                        <button
                            data-minus="${product.id}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            data-plus="${product.id}"
                        >
                            +
                        </button>

                        <button
                            data-delete="${product.id}"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;


            drawerContent.appendChild(
                block
            );

        }
    );


    drawerContent
        .querySelectorAll(
            "[data-minus]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        changeQuantity(
                            button.dataset.minus,
                            -1
                        );

                    }
                );

            }
        );


    drawerContent
        .querySelectorAll(
            "[data-plus]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        changeQuantity(
                            button.dataset.plus,
                            1
                        );

                    }
                );

            }
        );


    drawerContent
        .querySelectorAll(
            "[data-delete]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        cart =
                            cart.filter(
                                item =>
                                    item.id !==
                                    button.dataset.delete
                            );


                        saveCart();

                        updateCounters();

                        showCart();

                    }
                );

            }
        );


    drawerFooter.innerHTML = `

        <div class="drawer-total">

            <span>
                Итого
            </span>

            <strong>
                ${price(total)}
            </strong>

        </div>

        <button id="checkoutButton">
            Оформить заказ
        </button>

        <button
            id="clearCart"
            class="clear-button"
        >
            Очистить корзину
        </button>

    `;


    document
        .getElementById(
            "checkoutButton"
        )
        .addEventListener(
            "click",
            function () {

                alert(
                    "Оформление заказа скоро будет доступно."
                );

            }
        );


    document
        .getElementById(
            "clearCart"
        )
        .addEventListener(
            "click",
            function () {

                cart = [];

                saveCart();

                updateCounters();

                showCart();

            }
        );

}


function changeQuantity(id, value) {

    const item =
        cart.find(
            product =>
                product.id === id
        );


    if (!item) {
        return;
    }


    item.quantity += value;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== id
            );

    }


    saveCart();

    updateCounters();

    showCart();

}


// =========================
// КНОПКА КОРЗИНЫ
// =========================

const cartButton =
    document.getElementById(
        "cartButton"
    );


if (cartButton) {

    cartButton.addEventListener(
        "click",
        function () {

            openDrawer("Корзина");

            showCart();

        }
    );

}


// =========================
// ИЗБРАННОЕ
// =========================

const favoritesButton =
    document.getElementById(
        "favoritesButton"
    );


if (favoritesButton) {

    favoritesButton.addEventListener(
        "click",
        function () {

            openDrawer("Избранное");

            showFavorites();

        }
    );

}


function showFavorites() {

    if (!drawerContent) {
        return;
    }


    drawerContent.innerHTML = "";


    if (favorites.length === 0) {

        drawerContent.innerHTML =
            "<p>В избранном пока ничего нет.</p>";

        drawerFooter.innerHTML = "";

        return;

    }


    favorites.forEach(
        function (id) {

            const product =
                getProduct(id);


            const block =
                document.createElement(
                    "div"
                );


            block.className =
                "cart-item";


            block.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${price(product.price)}
                    </p>

                    <div class="cart-actions">

                        <button
                            data-add="${product.id}"
                        >
                            В корзину
                        </button>

                        <button
                            data-remove="${product.id}"
                        >
                            ×
                        </button>

                    </div>

                </div>

            `;


            drawerContent.appendChild(
                block
            );

        }
    );


    drawerContent
        .querySelectorAll(
            "[data-add]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        addToCart(
                            button.dataset.add
                        );

                    }
                );

            }
        );


    drawerContent
        .querySelectorAll(
            "[data-remove]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        toggleFavorite(
                            button.dataset.remove
                        );

                        showFavorites();

                    }
                );

            }
        );


    drawerFooter.innerHTML = "";

}


// =========================
// ПОИСК
// =========================

const searchButton =
    document.getElementById(
        "searchButton"
    );


const searchWindow =
    document.getElementById(
        "searchWindow"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


if (
    searchButton &&
    searchWindow
) {

    searchButton.addEventListener(
        "click",
        function () {

            searchWindow.classList.add(
                "active"
            );

            searchInput.focus();

        }
    );

}


const closeSearch =
    document.getElementById(
        "closeSearch"
    );


if (closeSearch) {

    closeSearch.addEventListener(
        "click",
        function () {

            searchWindow.classList.remove(
                "active"
            );

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            searchResults.innerHTML =
                "";


            if (!value) {
                return;
            }


            const result =
                products.filter(
                    function (product) {

                        return (
                            product.name
                                .toLowerCase()
                                .includes(value)
                            ||
                            product.type
                                .toLowerCase()
                                .includes(value)
                            ||
                            product.brand
                                .toLowerCase()
                                .includes(value)
                        );

                    }
                );


            if (result.length === 0) {

                searchResults.innerHTML =
                    "<p>Ничего не найдено.</p>";

                return;

            }


            result.forEach(
                function (product) {

                    const link =
                        document.createElement(
                            "a"
                        );


                    link.href =
                        "product.html?id=" +
                        product.id;


                    link.className =
                        "search-result";


                    link.innerHTML = `

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                        <div>

                            <h3>
                                ${product.name}
                            </h3>

                            <span>
                                ${price(product.price)}
                            </span>

                        </div>

                    `;


                    searchResults.appendChild(
                        link
                    );

                }
            );

        }
    );

}


// =========================
// ГЛАВНАЯ
// =========================

const featured =
    document.getElementById(
        "featuredProducts"
    );


if (featured) {

    products.slice(0, 3)
        .forEach(
            function (product) {

                featured.innerHTML += `

                    <a
                        class="product-card"
                        href="product.html?id=${product.id}"
                    >

                        <div class="product-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </div>


                        <div class="product-info">

                            <p>
                                ${product.type}
                            </p>

                            <h3>
                                ${product.name}
                            </h3>

                            <strong>
                                ${price(product.price)}
                            </strong>

                        </div>

                    </a>

                `;

            }
        );

}


// =========================
// КАТАЛОГ
// =========================

const catalog =
    document.getElementById(
        "catalogProducts"
    );


if (catalog) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category") || "all";


    let list =
        products;


    if (category !== "all") {

        list =
            products.filter(
                product =>
                    product.category ===
                    category
            );

    }


    const title =
        document.getElementById(
            "catalogTitle"
        );


    const eyebrow =
        document.getElementById(
            "catalogEyebrow"
        );


    if (category === "men") {

        eyebrow.textContent =
            "МУЖСКАЯ КОЛЛЕКЦИЯ";

        title.textContent =
            "Мужское";

    }


    if (category === "women") {

        eyebrow.textContent =
            "ЖЕНСКАЯ КОЛЛЕКЦИЯ";

        title.textContent =
            "Женское";

    }


    if (category === "shoes") {

        eyebrow.textContent =
            "ОБУВЬ";

        title.textContent =
            "Кроссовки и обувь";

    }


    if (category === "all") {

        eyebrow.textContent =
            "КАТАЛОГ";

        title.textContent =
            "Все товары";

    }


    document.getElementById(
        "catalogCount"
    ).textContent =
        list.length +
        " товаров";


    list.forEach(
        function (product) {

            const card =
                document.createElement(
                    "a"
                );


            card.href =
                "product.html?id=" +
                product.id;


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <button
                        class="favorite-button"
                        data-id="${product.id}"
                        type="button"
                    >
                        ${
                            favorites.includes(
                                product.id
                            )
                                ? "♥"
                                : "♡"
                        }
                    </button>

                </div>


                <div class="product-info">

                    <p>
                        ${product.type}
                    </p>

                    <h3>
                        ${product.name}
                    </h3>

                    <strong>
                        ${price(product.price)}
                    </strong>

                </div>

            `;


            const favorite =
                card.querySelector(
                    ".favorite-button"
                );


            favorite.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    toggleFavorite(
                        product.id
                    );


                    favorite.textContent =
                        favorites.includes(
                            product.id
                        )
                            ? "♥"
                            : "♡";

                }
            );


            catalog.appendChild(
                card
            );

        }
    );

}


// =========================
// КАРТОЧКА ТОВАРА
// =========================

const productPage =
    document.getElementById(
        "productPage"
    );


if (productPage) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    const product =
        getProduct(id);


    if (!product) {

        productPage.innerHTML = `
            <h1>
                Товар не найден
            </h1>
        `;

    } else {

        productPage.innerHTML = `

            <a
                href="javascript:history.back()"
                class="back-link"
            >
                ← Назад
            </a>


            <div class="product-layout">


                <div class="product-photo">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-detail-info">

                    <p class="eyebrow">
                        ${product.type}
                    </p>


                    <h1>
                        ${product.name}
                    </h1>


                    <p class="product-price-big">
                        ${price(product.price)}
                    </p>


                    <div class="product-description">

                        <p class="eyebrow">
                            О ТОВАРЕ
                        </p>

                        <p>
                            ${product.description.ru}
                        </p>

                    </div>


                    <div class="product-details">

                        <div>
                            <span>
                                БРЕНД
                            </span>

                            <strong>
                                ${product.brand}
                            </strong>
                        </div>


                        <div>
                            <span>
                                КАТЕГОРИЯ
                            </span>

                            <strong>
                                ${product.type}
                            </strong>
                        </div>


                        <div>
                            <span>
                                СТАТУС
                            </span>

                            <strong>
                                В НАЛИЧИИ
                            </strong>
                        </div>

                    </div>


                    <div class="product-actions">

                        <button
                            id="productCart"
                        >
                            В КОРЗИНУ
                        </button>


                        <button
                            id="productFavorite"
                        >
                            ${
                                favorites.includes(
                                    product.id
                                )
                                    ? "♥ Сохранено"
                                    : "♡ В избранное"
                            }
                        </button>

                    </div>


                </div>

            </div>

        `;


        document
            .getElementById(
                "productCart"
            )
            .addEventListener(
                "click",
                function () {

                    addToCart(
                        product.id
                    );

                    this.textContent =
                        "Добавлено ✓";

                }
            );


        document
            .getElementById(
                "productFavorite"
            )
            .addEventListener(
                "click",
                function () {

                    toggleFavorite(
                        product.id
                    );


                    this.textContent =
                        favorites.includes(
                            product.id
                        )
                            ? "♥ Сохранено"
                            : "♡ В избранное";

                }
            );

    }

}


// =========================
// ЗАПУСК
// =========================

updateCounters();