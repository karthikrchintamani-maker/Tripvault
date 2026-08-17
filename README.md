# TripVault ✈️ — Travel Memory Journal & Trip Planner Platform

TripVault is a production-ready, full-stack MERN web application that functions as a Travel Memory Journal and Trip Planner. Users can create accounts, log travel stories with photos, plan future trips, upload profile avatars, and explore public traveler profiles — all backed by Cloudinary cloud media storage.

---

## 🌟 Features

### 🔐 Authentication
- **Secure JWT Authentication** — Sign up / login flow using bcrypt password hashing and JSON Web Tokens.
- **Username Support** — Every user gets a unique username at registration, used for public profile URLs.

### 👤 Profile & Avatar
- **Redesigned Profile Page** — Beautiful banner with AI-generated illustrated mountain scenery, cloud, dotted flight trail, and paper-plane SVG.
- **Avatar Upload** — Click the camera badge on the profile avatar to upload a profile photo directly to Cloudinary.
- **Edit Profile Modal** — Click the "Explorer" button to open a modal and update your **username** and **bio** in real time.
- **Public Traveler Profiles** — Unauthenticated route `/profile/:username` to view any traveler's bio and trip plans.

### 🗂️ Journal & Stats
- **Travel Memories** — Log travel stories with title, location, date, emotion, and optional photo uploads.
- **Trip Planner** — Plan upcoming trips with title, destination, dates, rating, and cover image uploads.
- **Smart Stats** — Profile page shows:
  - 📅 **Member Since** date
  - 📖 **Journal Entries** — Combined count of memories + trips with breakdown subtitle (e.g. `2 Memories · 3 Trips`)
  - 📍 **Places Visited** — Unique locations from both memories and trips

### 🖼️ Cloud Media Storage (Cloudinary)
- Trip cover images and gallery photos uploaded directly to Cloudinary.
- Profile avatars uploaded to Cloudinary via `PUT /api/users/profile/avatar`.
- `multer-storage-cloudinary` used as Multer storage adapter — no local file storage required.

### 🗺️ Interactive World Map
- **Leaflet Map** — Responsive offline-friendly world map with memory pins (teal) and trip pins (violet).
- **Custom Inline SVG Pins** — Rendered without any external image dependencies.
- **Fuzzy Geocoding** — Automatically corrects misspelled city/country names using Levenshtein-distance before querying the Nominatim OSM API.

### 📊 Dashboard
- **4 Split Metrics** — Total Memories, Total Trips, Unique Locations, Latest Adventure Date.
- **Recent Highlights** — Most recent Memory and most recent Trip displayed side-by-side with cover images.
- **Edit Profile** — Update bio and username directly from the dashboard.

### 📖 API Documentation
- **Interactive Swagger Sandbox** at `/api-docs` to test auth, memories, trips, and user profile endpoints.

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| **React.js** (Vite) | Component-based UI |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP requests with JWT auto-attach |
| **Leaflet & React Leaflet** | Interactive world map |
| **Vanilla CSS** | Clean, responsive design |

### Backend
| Tool | Purpose |
|---|---|
| **Node.js & Express.js** | REST API server |
| **MongoDB & Mongoose** | Database & ODM |
| **Cloudinary** | Cloud media storage |
| **multer-storage-cloudinary** | Multer adapter for Cloudinary |
| **Multer** | Multipart file upload middleware |
| **JWT (jsonwebtoken)** | Auth token generation & validation |
| **Bcryptjs** | Password hashing |
| **Swagger UI Express** | Interactive API sandbox |

---

## 📂 Project Structure

```text
tripvault/
├── client/                         (React Vite Frontend)
│   ├── public/
│   │   ├── profile_banner_mountains.jpg  (AI-generated banner background)
│   │   └── bio_card_mountains.jpg        (AI-generated bio card illustration)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            (Axios client with auth interceptor)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── MemoryCard.jsx
│   │   │   └── TravelTracker.jsx   (Leaflet World Map)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx        (+ username field)
│   │   │   ├── Dashboard.jsx       (Metrics, Map, Edit Profile)
│   │   │   ├── Profile.jsx         (Redesigned: avatar upload, edit modal, stats)
│   │   │   ├── PublicProfile.jsx   (Public traveler profile view)
│   │   │   ├── Memories.jsx        (Travel Diary)
│   │   │   └── Trips.jsx           (Trip Planner with Cloudinary images)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                         (Node Express Backend)
│   ├── middleware/
│   │   ├── authMiddleware.js       (JWT protect middleware)
│   │   └── upload.js               (Cloudinary + Multer storage config)
│   ├── models/
│   │   ├── User.js                 (+ username, bio, avatar fields)
│   │   ├── Memory.js
│   │   └── Trip.js                 (+ coverImage, photos fields)
│   ├── routes/
│   │   ├── auth.js                 (Register/Login + username handling)
│   │   ├── memory.js
│   │   ├── trips.js                (CRUD + Cloudinary image upload)
│   │   └── users.js                (Profile update + avatar upload)
│   ├── .env                        (Environment config)
│   ├── index.js                    (Server entry + Swagger docs)
│   └── package.json
│
├── push.ps1                        (PowerShell quick-push script)
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally
- [Cloudinary account](https://cloudinary.com/) (free tier works fine)

### Backend Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside `server/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/tripvault
   JWT_SECRET=your_jwt_secret_key

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```
   - API server → `http://localhost:5000`
   - Swagger docs → `http://localhost:5000/api-docs`

### Frontend Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```
   - Web client → `http://localhost:5173`

---

## 📡 API Endpoints

### 🔐 Authentication  `POST /api/auth/...`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user (with username) |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get logged-in user profile *(Protected)* |

### 📝 Memories  `GET/POST/PUT/DELETE /api/memory/...`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/memory` | Create travel memory *(Protected, image upload)* |
| `GET` | `/api/memory` | Get all user memories *(Protected)* |
| `PUT` | `/api/memory/:id` | Update memory *(Protected, image upload)* |
| `DELETE` | `/api/memory/:id` | Delete memory *(Protected)* |

### 🗺️ Trips  `GET/POST/PUT/DELETE /api/trips/...`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/trips` | Create trip plan *(Protected, Cloudinary image)* |
| `GET` | `/api/trips` | Get all user trips *(Protected)* |
| `GET` | `/api/trips/:id` | Get single trip *(Protected)* |
| `PUT` | `/api/trips/:id` | Update trip *(Protected, Cloudinary image)* |
| `DELETE` | `/api/trips/:id` | Delete trip *(Protected)* |
| `POST` | `/api/trips/:id/upload` | Upload cover image to Cloudinary *(Protected)* |

### 👤 Users  `GET/PUT /api/users/...`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/:username/profile` | Get public traveler profile *(Public)* |
| `PUT` | `/api/users/profile` | Update bio & username *(Protected)* |
| `PUT` | `/api/users/profile/avatar` | Upload profile avatar to Cloudinary *(Protected)* |

---

## 🔒 Security & Implementation Details

- **Cloudinary Integration** — `multer-storage-cloudinary` streams uploads directly from the request to Cloudinary, so no temporary files are stored on the server.
- **Avatar Upload** — Clicking the camera badge on the profile page triggers a hidden `<input type="file">`. The selected image is previewed instantly using `URL.createObjectURL()` while it uploads in the background.
- **Fuzzy Geocoder** — Levenshtein-distance algorithm corrects misspelled city/country names before querying Nominatim OSM API for lat/lng coordinates.
- **JWT Protected Routes** — All mutating routes are gated by the `protect` middleware that validates the Bearer token.
- **Username Uniqueness** — Enforced at the MongoDB schema level (`unique: true`) and double-checked in the route handler before saving.

---

## 🚀 Quick Push to GitHub

A `push.ps1` PowerShell script is included for fast commits:

```powershell
# Auto commit with timestamp:
.\push.ps1

# Custom commit message:
.\push.ps1 "feat: add new feature"
```

The script stages all files, commits, and pushes. If the remote has newer commits, it automatically does a pull-rebase before pushing.

---

## 📅 Development Timeline

| Week | Focus | Key Deliverables |
|---|---|---|
| **Week 1** | Core Foundation | Auth (JWT + bcrypt), Memory CRUD, basic UI |
| **Week 2** | Trip Planner & Maps | Trip CRUD, Leaflet map, fuzzy geocoding, Swagger |
| **Week 3** | Cloud Media & Profiles | Cloudinary uploads, profile redesign, avatar upload, public profiles, edit modal |
