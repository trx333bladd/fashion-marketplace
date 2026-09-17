const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined
});

const JWT_SECRET = process.env.JWT_SECRET;

function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role || "user"
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

function authenticateAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Требуется авторизация"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Доступ только для администратора"
        });
    }

    next();
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Требуется авторизация"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Токен не найден"
        });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Недействительный или просроченный токен"
        });
    }
}

app.get("/", (req, res) => {
    res.json({
        message: "Blessed Shop API работает"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "PostgreSQL подключен",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Ошибка подключения к PostgreSQL",
            error: error.message
        });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id,
                p.name,
                p.price,
                p.description,
                p.material,
                p.color,
                p.season,
                p.style,
                p.is_available,
                p.is_new,

                b.name AS brand,
                s.name AS type,
                c.name AS category,

                COALESCE(
                    (
                        SELECT JSON_AGG(
                            pi.image_url
                            ORDER BY
                                CASE
                                    WHEN pi.image_url LIKE '%-2.%' THEN 2
                                    WHEN pi.image_url LIKE '%-3.%' THEN 3
                                    WHEN pi.image_url LIKE '%-4.%' THEN 4
                                    ELSE 1
                                END,
                                pi.image_url
                        )
                        FROM product_images pi
                        WHERE pi.product_id = p.id
                    ),
                    '[]'
                ) AS images,

                COALESCE(
                    (
                        SELECT JSON_AGG(
                            ps.size
                            ORDER BY
                                CASE ps.size
                                    WHEN 'XS' THEN 1
                                    WHEN 'S' THEN 2
                                    WHEN 'M' THEN 3
                                    WHEN 'L' THEN 4
                                    WHEN 'XL' THEN 5
                                    WHEN '36' THEN 36
                                    WHEN '37' THEN 37
                                    WHEN '38' THEN 38
                                    WHEN '39' THEN 39
                                    WHEN '40' THEN 40
                                    WHEN '41' THEN 41
                                    WHEN '42' THEN 42
                                    WHEN '43' THEN 43
                                    WHEN '44' THEN 44
                                    WHEN '45' THEN 45
                                    ELSE 100
                                END
                        )
                        FROM product_sizes ps
                        WHERE ps.product_id = p.id
                    ),
                    '[]'
                ) AS sizes

            FROM products p

            LEFT JOIN brands b
                ON p.brand_id = b.id

            LEFT JOIN subcategories s
                ON p.subcategory_id = s.id

            LEFT JOIN categories c
                ON s.category_id = c.id

            ORDER BY p.id;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Products error:", error);

        res.status(500).json({
            message: "Ошибка получения товаров"
        });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Заполните имя, email и пароль"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Пароль должен содержать минимум 6 символов"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Пользователь с таким email уже существует"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
                (name, email, phone, password_hash)
             VALUES
                ($1, $2, $3, $4)
             RETURNING id, name, email, phone, role`,
            [
                name.trim(),
                normalizedEmail,
                phone || null,
                passwordHash
            ]
        );

        const user = result.rows[0];
        const token = createToken(user);

        res.status(201).json({
            message: "Регистрация успешна",
            token,
            user
        });
    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Ошибка регистрации"
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Введите email и пароль"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                address,
                height,
                weight,
                shoe_size,
                notifications,
                role,
                password_hash
             FROM users
             WHERE email = $1`,
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Неверный email или пароль"
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Неверный email или пароль"
            });
        }

        delete user.password_hash;

        const token = createToken(user);

        res.json({
            message: "Вход выполнен",
            token,
            user
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Ошибка входа"
        });
    }
});

app.get("/api/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                address,
                height,
                weight,
                shoe_size,
                notifications,
                role
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }

        res.json({
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            message: "Ошибка получения профиля"
        });
    }
});

// =========================
// PROFILE
// =========================

app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                email,
                phone,
                address,
                height,
                weight,
                shoe_size,
                notifications,
                role
            FROM users
            WHERE id = $1
        `, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Пользователь не найден"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка получения профиля"
        });
    }
});

app.patch("/api/profile", authenticateToken, async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
            height,
            weight,
            shoe_size,
            notifications
        } = req.body;

        const result = await pool.query(`
            UPDATE users
            SET
                name = $1,
                phone = $2,
                address = $3,
                height = $4,
                weight = $5,
                shoe_size = $6,
                notifications = $7
            WHERE id = $8

            RETURNING
                id,
                name,
                email,
                phone,
                address,
                height,
                weight,
                shoe_size,
                notifications
        `, [
            name,
            phone || null,
            address || null,
            height || null,
            weight || null,
            shoe_size || null,
            notifications ?? true,
            req.user.id
        ]);

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка сохранения профиля"
        });
    }
});

// =========================
// CART
// =========================

app.get("/api/cart", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                c.id,
                c.product_id,
                c.size,
                c.quantity,

                p.name,
                p.price,

                (
                    SELECT pi.image_url
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY pi.id
                    LIMIT 1
                ) AS image

            FROM cart_items c

            JOIN products p
                ON p.id = c.product_id

            WHERE c.user_id = $1

            ORDER BY c.id DESC
        `, [req.user.id]);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка получения корзины"
        });
    }
});

app.post("/api/cart", authenticateToken, async (req, res) => {
    try {
        const {
            product_id,
            size,
            quantity = 1
        } = req.body;

        if (!product_id) {
            return res.status(400).json({
                message: "Не указан товар"
            });
        }

        const product = await pool.query(
            "SELECT id FROM products WHERE id = $1",
            [product_id]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({
                message: "Товар не найден"
            });
        }

        await pool.query(`
            INSERT INTO cart_items
                (user_id, product_id, size, quantity)
            VALUES
                ($1, $2, $3, $4)

            ON CONFLICT (user_id, product_id, size)

            DO UPDATE SET
                quantity =
                    cart_items.quantity + EXCLUDED.quantity
        `, [
            req.user.id,
            product_id,
            size || null,
            quantity
        ]);

        res.json({
            message: "Товар добавлен"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка добавления в корзину"
        });
    }
});

app.patch("/api/cart", authenticateToken, async (req, res) => {
    try {
        const {
            product_id,
            size,
            quantity
        } = req.body;

        if (quantity <= 0) {

            await pool.query(`
                DELETE FROM cart_items
                WHERE user_id = $1
                  AND product_id = $2
                  AND size IS NOT DISTINCT FROM $3
            `, [
                req.user.id,
                product_id,
                size || null
            ]);

        } else {

            await pool.query(`
                UPDATE cart_items
                SET quantity = $1
                WHERE user_id = $2
                  AND product_id = $3
                  AND size IS NOT DISTINCT FROM $4
            `, [
                quantity,
                req.user.id,
                product_id,
                size || null
            ]);

        }

        res.json({
            message: "Корзина обновлена"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка изменения корзины"
        });
    }
});

app.delete("/api/cart", authenticateToken, async (req, res) => {
    try {
        const {
            product_id,
            size
        } = req.body;

        await pool.query(`
            DELETE FROM cart_items
            WHERE user_id = $1
              AND product_id = $2
              AND size IS NOT DISTINCT FROM $3
        `, [
            req.user.id,
            product_id,
            size || null
        ]);

        res.json({
            message: "Товар удалён"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка удаления товара"
        });
    }
});

// =========================
// FAVORITES
// =========================

app.get("/api/favorites", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id,
                p.name,
                p.price,
                p.description,
                p.material,
                p.color,
                p.season,
                p.style,
                p.is_new,

                b.name AS brand,
                s.name AS type,
                c.name AS category,

                (
                    SELECT pi.image_url
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY pi.id
                    LIMIT 1
                ) AS image

            FROM favorites f

            JOIN products p
                ON p.id = f.product_id

            LEFT JOIN brands b
                ON b.id = p.brand_id

            LEFT JOIN subcategories s
                ON s.id = p.subcategory_id

            LEFT JOIN categories c
                ON c.id = s.category_id

            WHERE f.user_id = $1

            ORDER BY f.id DESC
        `, [req.user.id]);

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка получения избранного"
        });
    }
});

app.post("/api/favorites/:productId", authenticateToken, async (req, res) => {
    try {
        await pool.query(`
            INSERT INTO favorites
                (user_id, product_id)
            VALUES
                ($1, $2)

            ON CONFLICT (user_id, product_id)
            DO NOTHING
        `, [
            req.user.id,
            req.params.productId
        ]);

        res.json({
            message: "Добавлено в избранное"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка добавления"
        });
    }
});

app.delete("/api/favorites/:productId", authenticateToken, async (req, res) => {
    try {
        await pool.query(`
            DELETE FROM favorites
            WHERE user_id = $1
              AND product_id = $2
        `, [
            req.user.id,
            req.params.productId
        ]);

        res.json({
            message: "Удалено из избранного"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Ошибка удаления"
        });
    }
});

// =========================
// ORDERS
// =========================

// =========================
// ORDERS
// =========================

app.get("/api/orders", authenticateToken, async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT
                o.id,
                o.order_date,
                o.total,
                o.status,
                o.address,
                o.is_received,

                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'product_id', oi.product_id,
                            'name', p.name,
                            'size', oi.size,
                            'quantity', oi.quantity,
                            'price', oi.price
                        )
                    ) FILTER (WHERE oi.id IS NOT NULL),
                    '[]'
                ) AS items

            FROM orders o

            LEFT JOIN order_items oi
                ON oi.order_id = o.id

            LEFT JOIN products p
                ON p.id = oi.product_id

            WHERE o.user_id = $1

            GROUP BY o.id

            ORDER BY o.order_date DESC
        `, [req.user.id]);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "Orders error:",
            error
        );

        res.status(500).json({
            message: "Ошибка получения заказов"
        });
    }
});


// =========================
// CONFIRM ORDER RECEIVED
// =========================

app.patch(
    "/api/orders/:id/receive",
    authenticateToken,
    async (req, res) => {

        try {

            const orderId =
                Number(req.params.id);

            if (!Number.isInteger(orderId)) {

                return res.status(400).json({
                    message: "Неверный ID заказа"
                });

            }

            const result = await pool.query(
                `
                UPDATE orders

                SET is_received = TRUE

                WHERE id = $1
                  AND user_id = $2
                  AND status = 'Доставлен'
                  AND is_received = FALSE

                RETURNING
                    id,
                    order_date,
                    total,
                    status,
                    address,
                    is_received
                `,
                [
                    orderId,
                    req.user.id
                ]
            );

            if (result.rows.length === 0) {

                return res.status(400).json({
                    message: "Этот заказ нельзя подтвердить"
                });

            }

            res.json({
                message: "Получение заказа подтверждено",
                order: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Receive order error:",
                error
            );

            res.status(500).json({
                message: "Ошибка подтверждения заказа"
            });

        }

    }
);

// =========================
// ADMIN
// =========================

// Получить все заказы
app.get(
    "/api/admin/orders",
    authenticateToken,
    authenticateAdmin,
    async (req, res) => {
        try {
            const result = await pool.query(`
                SELECT
                    o.id,
                    o.user_id,
                    u.name AS user_name,
                    u.email,
                    u.phone,
                    o.order_date,
                    o.total,
                    o.status,
                    o.address,

                    COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'product_id', oi.product_id,
                                'name', p.name,
                                'size', oi.size,
                                'quantity', oi.quantity,
                                'price', oi.price
                            )
                            ORDER BY oi.id
                        ) FILTER (WHERE oi.id IS NOT NULL),
                        '[]'
                    ) AS items

                FROM orders o

                JOIN users u
                    ON u.id = o.user_id

                LEFT JOIN order_items oi
                    ON oi.order_id = o.id

                LEFT JOIN products p
                    ON p.id = oi.product_id

                GROUP BY
                    o.id,
                    u.name,
                    u.email,
                    u.phone

                ORDER BY o.order_date DESC
            `);

            res.json(result.rows);

        } catch (error) {

            console.error(
                "Admin orders error:",
                error
            );

            res.status(500).json({
                message: "Ошибка получения заказов"
            });

        }
    }
);

// Изменить статус заказа
app.patch(
    "/api/admin/orders/:id/status",
    authenticateToken,
    authenticateAdmin,
    async (req, res) => {
        try {
            const orderId = Number(req.params.id);
            const { status } = req.body;

            const allowedStatuses = [
                "Принят",
                "Собирается",
                "В пути",
                "Доставлен"
            ];

            if (!Number.isInteger(orderId)) {
                return res.status(400).json({
                    message: "Неверный ID заказа"
                });
            }

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Недопустимый статус заказа"
                });
            }

            const result = await pool.query(
                `
                UPDATE orders
                SET status = $1
                WHERE id = $2
                RETURNING
                    id,
                    user_id,
                    order_date,
                    total,
                    status,
                    address
                `,
                [
                    status,
                    orderId
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Заказ не найден"
                });
            }

            res.json({
                message: "Статус заказа обновлён",
                order: result.rows[0]
            });

        } catch (error) {

            console.error(
                "Admin status update error:",
                error
            );

            res.status(500).json({
                message: "Ошибка изменения статуса"
            });

        }
    }
);

// =========================
// AI PHOTO SEARCH
// =========================

app.post("/api/ai-search", async (req, res) => {
    try {

        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                message: "Фотография не передана"
            });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                message: "OPENAI_API_KEY не найден в .env"
            });
        }

        const productsResult = await pool.query(`
            SELECT
                p.id,
                p.name,
                p.price,
                p.description,
                p.material,
                p.color,
                p.season,
                p.style,
                b.name AS brand,
                s.name AS type,
                c.name AS category
            FROM products p

            LEFT JOIN brands b
                ON b.id = p.brand_id

            LEFT JOIN subcategories s
                ON s.id = p.subcategory_id

            LEFT JOIN categories c
                ON c.id = s.category_id

            WHERE p.is_available = TRUE

            ORDER BY p.id
        `);

        const products = productsResult.rows;

        const catalog = products.map(product => ({
            id: Number(product.id),
            name: product.name,
            brand: product.brand || "",
            category: product.category || "",
            type: product.type || "",
            color: product.color || "",
            material: product.material || "",
            season: product.season || "",
            style: product.style || ""
        }));

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({

                    model:
                        process.env.OPENAI_MODEL ||
                        "gpt-5.6-luna",

                    input: [
                        {
                            role: "user",

                            content: [
                                {
                                    type: "input_text",

                                    text: `
Проанализируй фотографию одежды или обуви.

Определи:
- что это за вещь;
- тип;
- основной цвет;
- стиль;
- бренд, если его видно.

После этого найди до 5 наиболее похожих товаров
ТОЛЬКО среди товаров из каталога ниже.

Не придумывай товары и ID.

Ответь ТОЛЬКО в JSON:

{
    "description": "краткое описание фотографии",
    "ids": [1, 2, 3]
}

КАТАЛОГ:

${JSON.stringify(catalog)}
`
                                },

                                {
                                    type: "input_image",
                                    image_url: image
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const aiData = await response.json();

        if (!response.ok) {

            console.error(
                "OpenAI error:",
                aiData
            );

            return res.status(500).json({
                message: "Ошибка OpenAI API"
            });
        }

        const text =
            aiData.output_text || "";

        const match =
            text.match(/\{[\s\S]*\}/);

        if (!match) {

            return res.status(500).json({
                message:
                    "AI не вернул корректный результат"
            });
        }

        const result =
            JSON.parse(match[0]);

        const ids =
            Array.isArray(result.ids)
                ? result.ids
                    .map(Number)
                    .filter(Number.isInteger)
                    .slice(0, 5)
                : [];

        const matchedProducts =
            products.filter(product =>
                ids.includes(
                    Number(product.id)
                )
            );

        res.json({
            description:
                result.description || "",

            products:
                matchedProducts
        });

    } catch (error) {

        console.error(
            "AI PHOTO SEARCH ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Не удалось выполнить поиск по фотографии"
        });
    }
});
