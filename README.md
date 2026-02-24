# 🎫 Support Ticket Management API

A RESTful backend system for managing company helpdesk tickets.

Built with **Bun + Express + TypeScript + Prisma + PostgreSQL (Neon)**.

---

## 🚀 Features

- JWT Authentication
- Secure password hashing using bcrypt
- Role-Based Access Control (MANAGER, SUPPORT, USER)
- Ticket lifecycle enforcement:
  OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Ticket status change logging
- Input validation using Zod
- Prisma ORM with PostgreSQL
- Proper HTTP status codes (401, 403, 404, 400, 201, 204)

---

## 🛠 Tech Stack

- Bun
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT (jsonwebtoken)
- bcrypt
- Zod

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd support-ticket-api
2️⃣ Install Dependencies
bun install
3️⃣ Setup Environment Variables
```

## Create a .env file in the root:

PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
DATABASE_URL=your_neon_database_url

⚠️ Never commit your .env file.

## 4️⃣ Run Prisma Migrations

bunx prisma migrate dev

## 5️⃣ Seed Roles and Default MANAGER

bunx prisma db seed

## Default MANAGER credentials:

Email: manager@company.com
Password: Manager@123

## 6️⃣ Start the Server

bun dev

Server runs at:

http://localhost:5000
🔐 Authentication
Login
POST /auth/login

Body:

{
"email": "manager@company.com",
"password": "Manager@123"
}

Returns:

JWT token

User details

## Include token in protected routes:

Authorization: Bearer <your_token>
👥 Roles & Access Control
Role Description
MANAGER Full system access
SUPPORT Manage assigned tickets
USER Create and view own tickets

## 🎫 Ticket Lifecycle Rules

Allowed transitions only:

OPEN → IN_PROGRESS → RESOLVED → CLOSED

Invalid transitions return 400 Bad Request.

## 📚 API Endpoints

Auth

POST /auth/login

Users (MANAGER only)

POST /users

GET /users

Tickets

POST /tickets

GET /tickets

PATCH /tickets/{id}/assign

PATCH /tickets/{id}/status

DELETE /tickets/{id}

Comments

POST /tickets/{id}/comments

GET /tickets/{id}/comments

PATCH /comments/{id}

DELETE /comments/{id}

## 🧪 Testing Guidelines

Create MANAGER (seeded)

Create SUPPORT and USER via MANAGER

Test role restrictions

Test invalid status transitions

Verify 401 without token

Verify 403 for unauthorized roles

## 🗃 Database Schema

Tables:

roles

users

tickets

ticket_comments

ticket_status_logs

All relationships are enforced via Prisma.

## 👨‍💻 Author

harpalsinh sindhav - https://github.com/harpalll

## 📜 License

This project is for academic purposes.
