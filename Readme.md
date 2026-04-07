# 🍔 Pesto - Food Ordering Web App (React + Node.js)

A modern full-stack food ordering web application built with **React**, **Node.js + Express**, and **MySQL**.

![Pesto Banner](https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200)

---

## 🌟 Features

## 👤 Customer Side
- 🔐 User registration & login with JWT authentication
- 🛒 Add items to cart (works without login too)
- 💳 Checkout with auto-filled delivery details
- 📦 Order history tracking
- 👤 Profile setup (name, phone, delivery address)
- 🎁 Special offers & deals section
- ⭐ Customer testimonials section
- 📱 Fully responsive design

### 🍽️ Restaurant Admin Side
- 📊 Dashboard with live stats (orders, revenue, users)
- 🧾 View all incoming orders with customer details
- 🔄 Update order status (Pending → Accepted → Preparing → Delivered)
- 👥 View all registered users and their order history
- 🔐 Secure admin login with secret key
- 🔍 Search and filter functionality

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, React Router, Axios        |
| Backend    | Node.js, Express.js               |
| Database   | MySQL                             |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| Styling    | Inline styles (CSS-in-JS)         |

---

## 📁 Project Structure
```
pesto/
│
├── Backend/
│   ├── Routes/
│   │   ├── auth.js        # Register, login, get user
│   │   ├── cart.js        # Cart management
│   │   ├── profile.js     # Profile setup & retrieval
│   │   └── admin.js       # Admin routes
│   ├── Middleware/
│   │   └── auth.js        # JWT verification middleware
│   ├── db.js              # MySQL connection pool
│   ├── server.js          # Express app entry point
│   ├── .env               # Environment variables
│   └── package.json
│
└── frontend/
    └── pesto/
        ├── src/
        │   ├── pages/
        │   │   ├── home.jsx           # Home with menu, offers, testimonials
        │   │   ├── Login.jsx          # Customer login
        │   │   ├── Register.jsx       # Customer register
        │   │   ├── setup.jsx          # Profile setup
        │   │   ├── Checkout.jsx       # Checkout with payment
        │   │   ├── OrderSuccess.jsx   # Order success page
        │   │   ├── Profile.jsx        # Customer profile
        │   │   ├── AdminDashboard.jsx # Admin dashboard
        │   │   ├── AdminOrders.jsx    # Order management
        │   │   └── AdminUsers.jsx     # User management
        │   ├── components/
        │   │   ├── Navbar.jsx         # Top navigation bar
        │   │   ├── CartPanel.jsx      # Slide-out cart panel
        │   │   └── AdminNavbar.jsx    # Admin sidebar
        │   ├── context/
        │   │   └── CartContext.jsx    # Global cart state
        │   ├── App.js                 # Routes configuration
        │   └── index.js              # React entry point
        └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/hasitha1510/Devops-project.git
cd pesto-react
```

### 2. Set up the Backend
```bash
cd Backend

# Install dependencies
npm install



### 3. Set up MySQL Database
```sql
CREATE DATABASE pesto_db;
USE pesto_db;
```

The tables will be created automatically when the backend starts.

### 4. Start the Backend
```bash
node server.js
```
Backend runs at: `http://localhost:3001`

### 5. Set up the Frontend
```bash
cd ../frontend/pesto

# Install dependencies
npm install
```

### 6. Start the Frontend
```bash
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🔑 Admin Access

To access the restaurant admin panel:

1. Login at `http://localhost:3000/login`
2. Click **🍽️ Restaurant Login** at the bottom
3. Enter your email, password and admin secret key
4. You will be redirected to the admin dashboard at `/admin`

> **Default admin secret key:** `pesto@admin2025`
> Change this in your `.env` file before deploying!

---

## 📡 API Endpoints

### Auth (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| GET | `/auth/me` | Get current user |

### Profile (`/profile`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profile/setup` | Save profile details |
| GET | `/profile` | Get full profile |

### Cart (`/cart`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cart/add` | Add item to cart |
| GET | `/cart` | Get user's cart |

### Admin (`/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/orders` | All orders with customer details |
| PUT | `/admin/orders/:id/status` | Update order status |
| GET | `/admin/users` | All registered users |

---

## 🗄️ Database Schema
```sql
-- Users table
CREATE TABLE users (
  id       INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  email    VARCHAR(100) UNIQUE,
  password VARCHAR(200),
  role     VARCHAR(20) DEFAULT 'user'
);

-- User profiles table
CREATE TABLE user_profiles (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  user_id   INT REFERENCES users(id),
  full_name VARCHAR(100),
  phone     VARCHAR(20),
  address   VARCHAR(300)
);

-- Cart items / Orders table
CREATE TABLE cart_items (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT REFERENCES users(id),
  name       VARCHAR(100),
  price      INT,
  image      VARCHAR(255),
  quantity   INT,
  status     VARCHAR(30) DEFAULT 'Pending',
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs**
- Authentication via **JWT tokens** (24hr expiry)
- Admin routes protected with **role-based middleware**
- Admin panel requires a **secret key**
- CORS configured for frontend-backend communication
- Environment variables for all sensitive data

---

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Menu, offers, testimonials |
| Login | `/login` | Customer login with smart redirect |
| Register | `/register` | New customer registration |
| Setup | `/setup` | Profile setup after register |
| Checkout | `/checkout` | Order checkout with auto-fill |
| Order Success | `/order-success` | Order confirmation |
| Profile | `/profile` | Customer profile & order history |
| Admin Dashboard | `/admin` | Stats overview |
| Admin Orders | `/admin/orders` | Order management |
| Admin Users | `/admin/users` | User management |

---

## 👨‍💻 Author

**Hasitha**
- GitHub: [@hasitha1510](https://github.com/hasitha1510)

---

## 📄 License

This project is for educational purposes.

---

> Made with ❤️ and 🍔 — Pesto, fresh food delivered fast!