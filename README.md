# TripVault ✈️ - Travel Memory Journal & Trip Planner Platform

TripVault is a production-ready, beautiful, and secure MERN stack web application that functions as a Travel Memory Journal and Trip Planner. It enables users to create accounts, log in securely, document their travel stories with photos, and organize future trips with a built-in interactive world exploration tracker.

---

## 🌟 Features

- **Secure JWT Authentication**: Sign up and login flow using bcrypt password hashing, username requirements, and JSON Web Tokens.
- **Cloud Media Storage (Cloudinary)**: Fully integrated file uploading utilizing Cloudinary to save cover images and trip photos securely.
- **Public Travel Profiles**: Unauthenticated profile route `/profile/:username` to view a traveler's bio and all trip plans.
- **Interactive Travel Tracker Map**: A responsive, offline-friendly Leaflet world map showing visited countries and travel pins.
  - **Custom Inline SVG Pins**: Memory pins (teal) and Trip pins (violet) rendered locally without external image dependencies.
  - **Horizontal Tile Wrap Fix**: disabled tile repeating and bounded coordinates to stay inside the world view.
- **Spelling-Correcting Geocoding**: Automatically geocodes location coordinates using Nominatim API with a Levenshtein-distance fuzzy spelling corrector.
- **Recent Highlights (Side-by-Side)**: Displays your most recent Memory and your most recent Trip Plan side-by-side on the Dashboard, with support for cloud cover images.
- **Trip Planner UI**: Plan upcoming trips with fields for title, destination, dates, rating, and cover image uploads.
- **Advanced Dashboard Metrics**: Splits analytics into 4 separate metrics: *Total Memories*, *Total Trips*, *Unique Locations*, and *Latest Adventure Date*.
- **Interactive Swagger Sandbox**: Live interactive API sandbox mounted at `/api-docs` to test security, auth, memories, trips, and user profiles.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite-powered boilerplate)
- **React Router DOM** (Single-page app routing)
- **Axios** (API requests with automatic token attachment)
- **Leaflet & React Leaflet** (Interactive geographic mappings)
- **Vanilla CSS** (Vibrant dark glassmorphic design)

### Backend
- **Node.js** & **Express.js** (REST API)
- **MongoDB** & **Mongoose ODM** (Local database storage)
- **Swagger UI Express** (Interactive API testing suite)
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
│   │   │   ├── MemoryCard.jsx
│   │   │   └── TravelTracker.jsx (Leaflet World Map UI)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx (Analytics, Maps, and Recent Highlights)
│   │   │   ├── Profile.jsx
│   │   │   ├── Memories.jsx (Travel Diary)
│   │   │   └── Trips.jsx    (Trip Planner UI)
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
│   │   ├── Memory.js
│   │   └── Trip.js         (Trip model with geocode and image fields)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── memory.js
│   │   └── trips.js        (Trips CRUD endpoints with fuzzy geocoder)
│   ├── uploads/            (Images folder - created dynamically)
│   ├── .env                (Environment Configuration)
│   ├── index.js            (Server Entry point with Swagger docs)
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
   *The Swagger API documentation runs at `http://localhost:5000/api-docs`*

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
- **Login User**: `POST /api/auth/login`
- **Get Logged User details**: `GET /api/auth/me` (Protected)

### Memory CRUD APIs
- **Create Travel Memory**: `POST /api/memory` (Protected, supports image upload)
- **Get Logged User's Memories**: `GET /api/memory` (Protected)
- **Update Memory**: `PUT /api/memory/:id` (Protected, supports image upload)
- **Delete Memory**: `DELETE /api/memory/:id` (Protected)

### Trip CRUD APIs
- **Create Trip Plan**: `POST /api/trips` (Protected, supports image upload & auto-geocoding)
- **Get Logged User's Trips**: `GET /api/trips` (Protected)
- **Get Single Trip**: `GET /api/trips/:id` (Protected)
- **Update Trip Plan**: `PUT /api/trips/:id` (Protected, supports image upload & re-geocoding)
- **Delete Trip Plan**: `DELETE /api/trips/:id` (Protected)

---

## 🔒 Security & Optimization Implementation

- **Spelling-Correcting Geocoder**: Uses Levenshtein-distance fuzzy checking to resolve misspelled city/country inputs before querying OSM.
- **Double Highlight Panels**: Keeps Memory journal entry flow and Trip Planner flow cleanly separated on the frontend dashboard.
- **Local Inline SVG Render**: Resolves Leaflet marker broken image issues in restricted network environments by injecting custom pins directly as raw inline SVG string elements.
- **Auto Image Cleanup**: Detects updates/deletions on memories and trips and automatically deletes matching media files from `server/uploads` to save storage.
