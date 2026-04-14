## ⚠️ Deployment Note

- The backend is deployed on Render (free tier). It may go idle after **15 minutes of inactivity**.
- When you access it after being idle, **please wait 2–3 minutes** for the server to spin up again.
- Since the project is on a free tier, **cookie operations (like login/logout)** may take a little extra time—especially while removing cookies.

### 🔗 Live Links

- **Frontend:** https://rbac-primet-trade.vercel.app/login
- **Swagger API Docs:** https://primetrade-api-qkpr.onrender.com/api-docs/

---

# RBAC — PrimeTrade

A scalable REST API with JWT-based authentication, role-based access control, and Redis caching, built as part of the PrimeTrade Backend Developer Intern assignment.

## Table of Contents

- Overview
- Tech Stack
- Project Structure
- Environment Variables
- Getting Started
- API Documentation
- Frontend
- Redis Caching
- Scalability Note
- Database Schema

## Overview

This project implements a full-stack web application with the following capabilities:

- User registration and login with bcrypt password hashing and JWT authentication.
- Secure token delivery via HTTP-Only cookies to mitigate XSS attacks.
- Role-based access control with two strict roles: `user` and `admin`.
- CRUD operations on a secondary entity (Tasks) with strict ownership validation.
- API versioning under `/api/v1`.
- Redis-based caching layer for optimized database querying and performance.
- A React frontend utilizing Vite that consumes the API and dynamically renders based on user roles.

## Tech Stack

| Layer         | Technology                                     |
| :------------ | :--------------------------------------------- |
| **Runtime**   | Node.js                                        |
| **Framework** | Express.js                                     |
| **Database**  | MongoDB                                        |
| **ORM**       | Mongoose                                       |
| **Auth**      | JSON Web Tokens (HTTP-Only Cookies) + bcryptjs |
| **Cache**     | Redis                                          |
| **Frontend**  | React.js (Vite), React Router, Axios           |
| **API Docs**  | Swagger UI (swagger-jsdoc)                     |

## Project Structure

```text
RBAC-PrimeTrade/
│
├── backend/
│   ├── config/
│   │   ├── redis.js               # Redis client connection
│   │   └── swagger.js             # Swagger UI configuration
│   ├── controllers/
│   │   ├── authController.js      # Registration, login, logout logic
│   │   └── taskController.js      # Task CRUD operations
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification and RBAC guards
│   ├── models/
│   │   ├── Task.js                # Task Mongoose schema
│   │   └── User.js                # User Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with credentials enabled
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx      # Protected dashboard and CRUD UI
│   │   ├── App.jsx                # Router configuration
│   │   └── main.jsx
│   ├── .env                       # Environment variables (Optional for Vite)
│   └── package.json
│
└── README.md
```

## Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/primetrade

# Security
JWT_SECRET=your_highly_secure_jwt_secret

# Frontend Integration
FRONTEND_URL=http://localhost:5173

# Redis Integration
REDIS_URL = your redis url
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- Redis (Local instance running on default port 6379)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the environment variables structure provided above.
4. Start the development server:

   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

## API Documentation

The API is documented using Swagger UI and is automatically generated from JSDoc comments within the route files.

**Swagger UI URL:** `http://localhost:5000/api-docs`

The interactive documentation covers authentication endpoints, task management CRUD operations, expected request/response schemas, and necessary authorization headers (cookies).

## Frontend

The React frontend is built with Vite for optimal performance and uses Axios to communicate with the backend.

**Local Development URL:** `http://localhost:5173`

- **Authentication Handling:** Unlike standard applications that store JWTs in `localStorage` (which is vulnerable to XSS), this application relies on the browser to automatically manage HTTP-Only cookies. The Axios instance is configured with `withCredentials: true` to ensure secure cross-origin requests.
- **Role Management:** The user's role is captured upon login to conditionally render administrative UI elements (e.g., the "Delete All Tasks" button), while the actual authorization strictly occurs on the backend.

## API Reference

**Base URL:** `http://localhost:5000/api/v1`

### Auth Endpoints

| Method | Endpoint         | Description                                | Access |
| :----- | :--------------- | :----------------------------------------- | :----- |
| POST   | `/auth/register` | Register a new user                        | Public |
| POST   | `/auth/login`    | Authenticate user and set HTTP-Only cookie | Public |
| POST   | `/auth/logout`   | Clear the authentication cookie            | Public |

### Task Endpoints

| Method | Endpoint           | Description                                      | Access              |
| :----- | :----------------- | :----------------------------------------------- | :------------------ |
| GET    | `/tasks`           | List tasks (Users see their own, Admins see all) | Authenticated       |
| POST   | `/tasks`           | Create a new task                                | Authenticated       |
| PUT    | `/tasks/:id`       | Update a specific task                           | Task Owner or Admin |
| DELETE | `/tasks/:id`       | Delete a specific task                           | Task Owner or Admin |
| DELETE | `/tasks/admin/all` | Delete all tasks globally                        | Admin Only          |

## Redis Caching

Redis is integrated to optimize data retrieval and minimize database load, particularly for read-heavy operations.

- **Read-Through Cache:** When a `GET /tasks` request is made, the application first checks the Redis instance. If the data exists, it is served directly from memory, significantly reducing response times.
- **Cache Invalidation:** To prevent stale data delivery, any mutation to the Task entity (`POST`, `PUT`, `DELETE`) triggers an immediate cache invalidation for the affected user's namespace.
- **Architecture:** The cache keys are dynamically generated based on the user's ID and role, ensuring strict data isolation between users.

## Scalability Note

This application is built as a modular monolith, designed specifically to scale cleanly into a distributed architecture as traffic demands increase.

- **Microservices Readiness:** The project enforces strict domain boundaries. The Authentication module and the Task module are isolated. This structure allows the monolith to be easily fractured into independent microservices (e.g., an `Auth Service` and a `Task Service`) communicating via an API gateway without rewriting core business logic.
- **Stateless Authentication & Load Balancing:** The Express server holds no state. By leveraging JWTs stored in HTTP-Only cookies, the application does not rely on server-side sessions. This allows the backend to be horizontally scaled and replicated behind a load balancer (such as AWS ALB or NGINX) without the need for complex sticky-session configurations.
- **Database Scaling:** As data volume grows, MongoDB's native replica sets can be utilized. Read-heavy endpoints can be directed to secondary replicas, while write operations remain on the primary node. This, combined with the Redis caching layer, ensures the database can handle high throughput reliably.

## Database Schema

The database schemas are defined using Mongoose. Below is the structural representation:

**User Schema**

```javascript
{
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    timestamps: true
}
```

**Task Schema**

```javascript
{
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    user: { type: ObjectId, ref: 'User', required: true },
    timestamps: true
}
```
