# 🏪 StoreRate — Store Rating Platform

<p align="center">
  A full-stack web application where users can discover stores, submit ratings, and manage their store reviews.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## ✨ About the Project

**StoreRate** is a full-stack store rating platform built to make store reviews and rating management simple and organized.

The application supports different user roles and provides authentication, store management, and rating functionality through a user-friendly interface.

## 🚀 Features

- 🔐 **Authentication** — Secure signup and login using password hashing and JWT.
- 👑 **Admin Dashboard** — Manage users and stores.
- 👤 **User Management** — Create, view, and manage user accounts.
- 🏪 **Store Management** — Add and view store information.
- ⭐ **Rating System** — Allow users to rate stores from 1 to 5.
- 🔄 **Role-Based Access** — Different permissions for administrators and regular users.
- 🗄️ **Database Integration** — Store application data in PostgreSQL.
- 📱 **Responsive UI** — Designed for a clear and accessible user experience.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| 🎨 Frontend | React, Vite, JavaScript, CSS |
| ⚙️ Backend | Node.js, Express.js |
| 🗄️ Database | PostgreSQL, Supabase |
| 🔑 Authentication | JWT, bcrypt |
| 🔌 API | REST API |
| 🧰 Tools | Git, GitHub, VS Code |

## 📁 Project Structure

```text
StoreRate/
│
├── 📂 client/                    # Frontend application
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/        # Reusable UI components
│   │   ├── 📂 pages/             # Application pages
│   │   ├── 📂 assets/            # Images and static assets
│   │   ├── 📄 App.jsx
│   │   └── 📄 main.jsx
│   ├── 📄 package.json
│   └── 📄 .env.example
│
├── 📂 server/                    # Backend application
│   ├── 📂 config/                # Database configuration
│   │   └── 📄 db.js
│   ├── 📂 controllers/           # Request handlers
│   │   ├── 📄 authController.js
│   │   └── 📄 adminController.js
│   ├── 📂 middleware/            # Authentication middleware
│   │   └── 📄 authMiddleware.js
│   ├── 📂 routes/                # API routes
│   │   ├── 📄 authRoutes.js
│   │   └── 📄 adminRoutes.js
│   ├── 📂 db/                    # Database schema
│   │   └── 📄 schema.sql
│   ├── 📂 scripts/               # Utility scripts, if present
│   ├── 📄 server.js
│   ├── 📄 package.json
│   └── 📄 .env.example
│
├── 📄 .gitignore
└── 📄 README.md
```

> 📝 **Note:** This is a reference structure. Keep the filenames and folders consistent with the actual project in your repository.

## ⚙️ Getting Started

Follow these steps to run StoreRate locally.

### 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- A PostgreSQL database or Supabase PostgreSQL project
- Git

### 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd StoreRate
```

### 2️⃣ Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_long_random_secret
```

🔒 Replace the example values with your own database connection details. Never commit your actual `.env` file.

### 3️⃣ Set Up the Database

1. Open your Supabase project.
2. Navigate to **SQL Editor**.
3. Run the SQL statements from `server/db/schema.sql`.
4. Verify that the required tables have been created.

### 4️⃣ Start the Backend

From the `server/` directory, run:

```bash
node server.js
```

The backend should start on:

```text
http://localhost:5000
```

### 5️⃣ Configure and Start the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

If your frontend uses a `VITE_API_URL` environment variable, configure it in `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Open the local URL displayed by Vite in your terminal.

## 🔐 Security

- 🔑 Passwords are hashed before being stored.
- 🛡️ Protected routes use authentication and role-based authorization.
- 🔒 Database credentials and JWT secrets belong in environment variables.
- 🚫 Never upload `.env` files or private credentials to GitHub.

## 🎯 Project Goals

- Practice full-stack web development.
- Understand REST API development and database integration.
- Implement authentication and role-based access control.
- Build a maintainable frontend and backend structure.

## 👩‍💻 Author

**Priyanka Verma**

💻 Aspiring Software Developer | MERN Stack Developer

🔗 [GitHub — PriyankaVerma2307](https://github.com/PriyankaVerma2307)

---

<p align="center">
  ⭐ If you find this project interesting, feel free to explore the repository!
</p>
