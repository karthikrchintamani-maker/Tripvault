# TripVault ✈️ - Travel Memory Journal Platform

TripVault is a production-ready, beautiful, and secure MERN stack web application that functions as a Travel Memory Journal. It enables users to create accounts, log in securely, and document their travel stories with photos, descriptions, dates, and locations.

---

## 🌟 Features

- **Secure JWT Authentication**: Sign up and login flow using bcrypt password hashing and JSON Web Tokens.
- **Interactive Travel Diary**: Capture details, dates, and locations of your favorite trips.
- **Image Upload Support**: Upload real photos of your travels, saved locally on the server.
- **Clean glassmorphic Dark UI**: Premium styling built using CSS and React.
- **Responsive Layout**: Works flawlessly on Mobile, Tablet, and Desktop screens.
- **Automatic Session Persistence**: Keeps users logged in securely using localStorage.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite-powered boilerplate)
- **React Router DOM** (Single-page app routing)
- **Axios** (API requests with automatic token attachment)
- **Vanilla CSS** (Vibrant dark glassmorphic design)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose ODM** (Local database storage)
- **Multer** (Multipart file upload middleware)
- **JWT (jsonwebtoken)** (Security & Protected routes)
- **Bcryptjs** (Password encryption)

---

## 📂 Project Structure

```text
tripvault/
├── client/                 (React Vite Frontend)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js    (Axios client configuration)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── MemoryCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Memories.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css       (Glassmorphic Dark CSS Theme)
│   └── package.json
│
├── server/                 (Node Express Backend)
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Memory.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── memory.js
│   ├── uploads/            (Images folder - created dynamically)
│   ├── .env                (Environment Configuration)
│   ├── index.js            (Server Entry point)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally.

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install the server dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file inside `server/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/tripvault
   JWT_SECRET=mysecretkey
   ```
4. Start the Express backend:
   ```bash
   npm run dev
   ```
   *The server runs at `http://localhost:5000`*

### Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install the client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The web client runs at `http://localhost:5173`*

---

## 📡 API Documentation

### Auth APIs
- **Register User**: `POST /api/auth/register`
  - Request Body: `{ "name": "John Doe", "email": "john@gmail.com", "password": "password123" }`
  - Response: `{ "message": "User registered successfully" }`
- **Login User**: `POST /api/auth/login`
  - Request Body: `{ "email": "john@gmail.com", "password": "password123" }`
  - Response: `{ "token": "JWT_TOKEN" }`
- **Get Logged User details**: `GET /api/auth/me` (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: User details (excluding password)

### Memory CRUD APIs
- **Create Travel Memory**: `POST /api/memory` (Protected, supports `multipart/form-data`)
  - Form Fields: `title`, `description`, `location`, `date`, `image` (file upload)
  - Response: Created memory document
- **Get Logged User's Memories**: `GET /api/memory` (Protected)
  - Response: Array of memory objects sorted by date
- **Update Memory**: `PUT /api/memory/:id` (Protected, supports `multipart/form-data`)
  - Form Fields: `title`, `description`, `location`, `date`, `image` (optional file upload)
  - Response: Updated memory document
- **Delete Memory**: `DELETE /api/memory/:id` (Protected)
  - Response: `{ "message": "Memory removed successfully" }`

---

## 🔒 Security Implementation Details

- **Password Hashing**: Implemented pre-save mongoose hooks to automatically hash passwords with Bcrypt before saving.
- **Route Guarding**: JWT authorization headers are validated via custom middleware before letting requests access memory APIs.
- **Ownership Verification**: Database entries check if the `user` reference matches the logged-in user before letting them modify or delete items.
- **Dynamic File Validations**: Images are strictly checked on mimetype and extensions (`jpg|jpeg|png|webp|gif`) with a 5MB size limit using `multer` configurations.
