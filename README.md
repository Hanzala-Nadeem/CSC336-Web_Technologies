# 🏪 Adidas E-Commerce Store

> **Course:** CSC336 — Web Technologies  
> **Student:** Hanzala Nadeem  
> **Date:** May 19, 2026  
> **Stack:** Express.js · EJS · Mongoose · jQuery · Bootstrap 5

---

## Project Overview

A full-featured Adidas e-commerce web application built with **Express.js**, **EJS** templating, and **MongoDB (Mongoose)**. The application includes product browsing, session-based authentication with RBAC, an admin panel with CRUD operations, a shopping cart, checkout flow, and a **real-time Sales Dashboard** with jQuery polling.

---

## Features Implemented

### Storefront
- **Homepage** — Hero banner, trending products slider, sports cards, discover section
- **Product Catalog** — Paginated product grid with search, category filtering, price range, and sorting
- **Quick View Modal** — Click any product to see details, ratings, stock status
- **Search Autocomplete** — Live suggestions as you type

### Shopping Cart (Session-Based)
- **Add to Bag** — AJAX-powered add-to-cart from quick view modal with toast notifications
- **Cart Page** (`/cart`) — View items, update quantities, remove items
- **Cart Badge** — Dynamic item count badge on the bag icon in the header
- **Session Storage** — Cart persists across pages using `req.session.cart`

### Checkout & Orders
- **Checkout Page** (`/checkout`) — Shows cart items, shipping form, payment fields, order summary
- **Order Creation** — `POST /checkout` creates a real `Order` document in MongoDB
- **Stock Management** — Product stock is automatically reduced after order placement
- **Order Confirmation** — Displays order ID, items, shipping info, and total

### Sales Dashboard (Final Exam Deliverable)
- **Dashboard Page** (`GET /sales`) — Server-rendered with `express-ejs-layouts`
- **JSON API** (`GET /api/sales-data`) — Returns live statistics as JSON
- **jQuery Polling** — Auto-updates every **10 seconds** without page reload
- **Mongoose Aggregation** — Computes revenue, order counts, top-selling product
- **Metrics Displayed:**
  - 💰 Total Revenue
  - 📦 Total Orders
  - 📊 Average Order Value
  - ⏳ Pending / Shipped / Delivered /  Cancelled orders
  - 🏆 Top-Selling Product (name, units sold, revenue)
  - 📋 Recent Transactions table

### Authentication & Authorization
- **Registration** (`/auth/register`) — Name, email, password with bcrypt hashing
- **Login** (`/auth/login`) — Session-based authentication with `express-session`
- **Logout** (`/auth/logout`) — Destroys session
- **Role-Based Access Control** — `isLoggedIn` and `isAdmin` middleware
- **Dynamic Navbar** — Shows user name, admin panel link, login/register based on auth state

###  Admin Panel
- **Dashboard** (`/admin`) — Product count, category count, user count, recent products
- **Product Management** (`/admin/products`) — Full CRUD with image upload (Multer)
- **Category Management** (`/admin/categories`) — Full CRUD with slugs
- **Sales Dashboard Link** — Quick access from admin sidebar

###  REST API (JWT-Based)
- `POST /api/v1/auth/login` — JWT token generation
- `GET /api/v1/products` — Product listing
- `POST /api/v1/orders` — Create order (protected)
- `GET /api/v1/orders` — User's orders (protected)
- `GET /api/v1/user/profile` — User profile (protected)

---

##  Project Structure

```
Final term exam/
├── config/
│   └── db.js                    # MongoDB connection
├── middlewares/
│   ├── auth.js                  # isLoggedIn, isAdmin
│   ├── global.js                # Flash messages, user, cartCount, categories
│   ├── upload.js                # Multer file upload config
│   └── verifyToken.js           # JWT verification
├── models/
│   ├── Category.js              # Category schema with auto-slug
│   ├── Order.js                 # Order schema (user, items, total, status)
│   ├── Product.js               # Product schema with auto-slug
│   └── User.js                  # User schema with bcrypt
├── Public/
│   ├── css/
│   │   ├── styles.css           # Main storefront styles
│   │   ├── products.css         # Product catalog styles
│   │   ├── admin.css            # Admin panel styles
│   │   └── auth.css             # Login/register styles
│   ├── images/                  # Product and banner images
│   ├── js/
│   │   └── script.js            # Client-side JS (cart, modals, search)
│   └── uploads/                 # Uploaded product images
├── routes/
│   ├── admin/
│   │   ├── index.js             # Admin dashboard route
│   │   ├── products.js          # Admin product CRUD
│   │   └── categories.js        # Admin category CRUD
│   ├── api/v1/
│   │   ├── authRoutes.js        # JWT auth endpoints
│   │   ├── productRoutes.js     # Product API
│   │   ├── orderRoutes.js       # Order API
│   │   └── userRoutes.js        # User API
│   ├── auth.js                  # Login/register/logout
│   ├── cart.js                  # Session-based cart
│   ├── checkout.js              # Checkout & order creation
│   ├── sales.js                 # Sales dashboard + JSON API
│   └── shop.js                  # Product browsing
├── Views/
│   ├── admin/
│   │   ├── layout.ejs           # Admin sidebar layout
│   │   ├── dashboard.ejs        # Admin dashboard
│   │   ├── products/            # Product CRUD views
│   │   └── categories/          # Category CRUD views
│   ├── auth/
│   │   ├── login.ejs            # Login form
│   │   └── register.ejs         # Registration form
│   ├── layouts/
│   │   └── main.ejs             # Master layout (express-ejs-layouts)
│   ├── partials/
│   │   ├── header.ejs           # Header with nav + cart badge
│   │   ├── footer.ejs           # Footer
│   │   └── flash.ejs            # Flash messages
│   ├── index.ejs                # Homepage
│   ├── products.ejs             # Product catalog
│   ├── cart.ejs                 # Shopping cart
│   ├── checkout.ejs             # Checkout page
│   ├── order-confirmation.ejs   # Order confirmation
│   └── sales.ejs                # Sales dashboard + jQuery polling
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── seed.js                      # Database seeder
└── server.js                    # App entry point
```

---

##  Installation & Setup

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017`)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Seed the database (products, categories, users, sample orders)
node seed.js

# 3. Start the server
npm start
```

The app will be running at **http://localhost:3000**

---

## 🔑 Test Accounts


 **Admin** admin@adidas.com  admin123 
 **Customer** user@adidas.com  user123 

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| ejs | ^5.0.1 | Template engine |
| express-ejs-layouts | latest | Master layout system |
| mongoose | ^9.6.2 | MongoDB ODM |
| express-session | ^1.18.1 | Session management |
| connect-mongo | ^5.1.0 | MongoDB session store |
| connect-flash | ^0.1.1 | Flash messages |
| bcryptjs | ^3.0.2 | Password hashing |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| multer | ^1.4.5 | File uploads |
| cookie-parser | ^1.4.7 | Cookie parsing |
| cors | ^2.8.6 | Cross-origin requests |
| dotenv | ^17.4.2 | Environment variables |
| slugify | ^1.6.6 | URL slug generation |
| **jQuery** | 3.7.1 (CDN) | DOM manipulation & AJAX polling |
| **Bootstrap** | 5.3.3 (CDN) | UI framework |

---

## 🗺️ Key Routes

### Public Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Homepage |
| GET | `/products` | Product catalog with filters |
| GET | `/cart` | Shopping cart |
| GET | `/auth/login` | Login page |
| GET | `/auth/register` | Registration page |

### Protected Routes (Login Required)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/checkout` | Checkout page |
| POST | `/checkout` | Place order |
| POST | `/cart/add` | Add item to cart (AJAX) |

### Sales Dashboard
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/sales` | Server-rendered dashboard (EJS) |
| GET | `/api/sales-data` | JSON API for jQuery polling |

### Admin Routes (Admin Only)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/admin` | Admin dashboard |
| GET | `/admin/products` | Manage products |
| GET | `/admin/categories` | Manage categories |

---

## Sales Dashboard — Technical Implementation

### Mongoose Aggregation Queries

```javascript
// Total Revenue
Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$total" } } }])

// Orders by Status
Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])

// Top-Selling Product
Order.aggregate([
    { $unwind: "$items" },
    { $group: {
        _id: "$items.product",
        unitsSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }},
    { $sort: { unitsSold: -1 } },
    { $limit: 1 }
])
```

### jQuery Real-Time Polling (Every 10 Seconds)

```javascript
$(document).ready(function () {
    function fetchSalesData() {
        $.getJSON('/api/sales-data', function (data) {
            $('#totalRevenue').text('$' + data.totalRevenue.toFixed(2));
            $('#totalOrders').text(data.totalOrders);
            $('#pendingOrders').text(data.pendingOrders);
            // ... updates all dashboard DOM elements
        });
    }
    setInterval(fetchSalesData, 10000);
});
```

### express-ejs-layouts Integration

```javascript
// server.js
const expressLayouts = require("express-ejs-layouts");
app.set("layout", false);       // Default: no layout
app.use(expressLayouts);

// sales route
res.render("sales", { layout: "layouts/main" }); // Uses master layout
```

---

##  Database Schemas

### Product
```javascript
{ name, slug, price, category (ObjectId → Category), rating, stock, image, description, collection }
```

### Order
```javascript
{ user (ObjectId → User), items: [{ product, quantity, price }], total, shippingInfo: { address, city, zip }, status: "pending|shipped|delivered|cancelled" }
```

### User
```javascript
{ name, email, password (bcrypt hashed), role: "customer|admin" }
```

### Category
```javascript
{ name, slug, description }

