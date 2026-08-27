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
| **Week 4** | Production & Deployment | UI polish, responsive design, toast notifications, Render + Vercel deployment |

---

## 🚀 Week 4 — Production & Deployment Guide

Week 4 is the **final shipping phase** of TripVault. The goal is to polish the UI, make everything responsive, and deploy the full stack to production.

### Final Production Architecture

```
┌──────────────────────┐
│       Vercel         │
│   React + Vite       │
│     Frontend         │
└──────────┬───────────┘
           │
           │  HTTPS API
           ▼
┌──────────────────────┐
│       Render         │
│   Node + Express     │
│      Backend         │
└───────┬───────┬──────┘
        │       │
┌───────┘       └───────────┐
▼                           ▼
┌─────────────────┐  ┌─────────────────┐
│  MongoDB Atlas  │  │   Cloudinary    │
│ Users / Trips   │  │ Photos / Images │
└─────────────────┘  └─────────────────┘
```

---

### 📋 Recommended Step-by-Step Order

1. Backup Week 3 project → `git commit -m "Week 3 completed"` → `git push origin main`
2. Test complete application locally (all CRUD, auth, uploads)
3. UI Polish — consistent color scheme, Navbar, Footer
4. Add Loading Spinner component (`components/LoadingSpinner.jsx`)
5. Add loading states on all data-fetching pages
6. Add error messages (never blank pages)
7. Add toast notifications via `react-hot-toast`
8. Add empty states (new users with no trips)
9. Make Trip Cards responsive grid (3col → 2col → 1col)
10. Responsive design — test 375px, iPad, Desktop
11. Fix horizontal scrolling (`overflow-x: hidden`, `box-sizing: border-box`)
12. Prepare environment variables — never commit `.env` to GitHub
13. Configure backend for Render (`process.env.PORT`, `"start": "node index.js"`)
14. Push final code to GitHub
15. Deploy backend → Render
16. Add Render environment variables (MONGO_URI, JWT_SECRET, CLOUDINARY_*, NODE_ENV)
17. Configure MongoDB Atlas Network Access for Render IPs
18. Get Render public URL → test `/api/health` endpoint
19. Update frontend `VITE_API_URL` to Render URL
20. Deploy frontend → Vercel
21. Add `VITE_API_URL` in Vercel Environment Variables → Redeploy
22. Configure CORS on backend with `FRONTEND_URL=https://your-app.vercel.app`
23. Full end-to-end test on live Vercel URL
24. Add screenshots to `screenshots/` folder
25. Update README with live URL, screenshots, deployment info
26. Push final commit → Submit Google Form

---

### 🎨 UI Polish

#### Consistent Color Scheme
```css
:root {
  --primary:    #2563eb;
  --secondary:  #0f172a;
  --background: #f8fafc;
  --card:       #ffffff;
  --text:       #1e293b;
  --muted:      #64748b;
  --success:    #16a34a;
  --danger:     #dc2626;
  --border:     #e2e8f0;
}
```

#### Navbar (Responsive)
- **Desktop**: `Logo | Home | My Trips | Profile | Logout`
- **Mobile**: `Logo | ☰` → hamburger opens menu

```jsx
const [menuOpen, setMenuOpen] = useState(false);
// toggle button → {menuOpen && <div className="mobile-menu">...</div>}
```

#### Footer
```jsx
<footer>
  <h3>TripVault</h3>
  <p>Capture your journeys. Share your memories.</p>
  <p>© 2026 Karthik R</p>
  <a href="https://github.com/karthikrchintamani-maker/Tripvault" target="_blank" rel="noreferrer">GitHub</a>
</footer>
```

---

### ⏳ Loading Spinner

Create `client/src/components/LoadingSpinner.jsx`:

```jsx
const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);
export default LoadingSpinner;
```

```css
.spinner {
  width: 40px; height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

Usage:
```jsx
{loading ? <LoadingSpinner /> : <TripList trips={trips} />}
```

---

### 🔔 Toast Notifications

```bash
npm install react-hot-toast
```

```jsx
// main.jsx or App.jsx
import { Toaster } from "react-hot-toast";
<Toaster position="top-right" />

// Usage anywhere
toast.success("Trip created successfully!");
toast.success("Login successful!");
toast.success("Photo uploaded successfully!");
toast.error("Something went wrong!");
```

---

### 📭 Empty State

```jsx
{trips.length === 0 ? (
  <div className="empty-state">
    <h2>🌍 No trips yet</h2>
    <p>You haven't added any trips yet. Start your journey!</p>
    <Link to="/trips/create">+ Add New Trip</Link>
  </div>
) : (
  <TripGrid trips={trips} />
)}
```

---

### 📱 Responsive Design

```css
/* Container */
.container { width: min(1200px, 92%); margin: auto; }

/* Trip Grid — 3 col → 2 col → 1 col */
.trip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .trip-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .trip-grid { grid-template-columns: 1fr; } }

/* Photo Grid */
.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
@media (max-width: 600px) { .photo-grid { grid-template-columns: repeat(2, 1fr); } }

/* Images — never break cards */
.trip-image { width: 100%; height: 220px; object-fit: cover; display: block; }
@media (max-width: 600px) { .trip-image { height: 200px; } }

/* Forms */
.form { width: 100%; max-width: 600px; margin: auto; }
input, textarea, select { width: 100%; box-sizing: border-box; }

/* No horizontal scroll */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; overflow-x: hidden; }
```

**Test breakpoints**: 375px (iPhone SE), 768px (iPad), 1280px+ (Desktop)  
Use Chrome DevTools → F12 → Toggle Device Toolbar.

---

### 🌐 Environment Variables

#### Backend `.env` (never commit to GitHub)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
FRONTEND_URL=https://tripvault-six.vercel.app
```

#### Frontend `.env` (never put secrets here)
```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ `VITE_*` variables are bundled into the client JS — **never** put secrets like API keys or JWT secrets in them.

---

### 🖥️ Deploy Backend → Render

1. Go to [render.com](https://render.com) → **New → Web Service → Connect GitHub**
2. Select the TripVault repository
3. Settings:

   | Setting | Value |
   |---|---|
   | Root Directory | `server` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

4. Add all environment variables under **Environment → Environment Variables**
5. Render auto-deploys on every `git push origin main`

Make sure `server/index.js` binds to `0.0.0.0`:
```js
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server on port ${PORT}`));
```

Add a health check endpoint:
```js
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "TripVault API is running" });
});
```

Test: `https://tripvault-backend.onrender.com/api/health`

---

### ▲ Deploy Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project → Import GitHub Repo**
2. Settings:

   | Setting | Value |
   |---|---|
   | Root Directory | `client` |
   | Framework | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

3. **Environment Variables** → Add `VITE_API_URL` = `https://tripvault-backend.onrender.com/api`
4. Deploy → after adding env vars, **Redeploy** to apply them

---

### 🔗 CORS Configuration (Backend)

```js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

Set `FRONTEND_URL` on Render to your exact Vercel domain (e.g. `https://tripvault-abc.vercel.app`).

---

### 🔗 Production-Ready Axios Setup

```js
// client/src/api/axios.js
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
```

Then use `API.get("/trips")` instead of hardcoded `http://localhost:5000/api/trips` everywhere.

---

### ✅ Week 4 Final Checklist

#### UI
- [ ] Consistent color scheme (`--primary`, `--background`, etc.) applied everywhere
- [ ] Navbar complete (desktop links + mobile hamburger)
- [ ] Footer added
- [ ] Buttons, cards, and forms consistently styled

#### Functionality
- [ ] Register / Login / Logout working
- [ ] Trip CRUD (Create, Read, Update, Delete) working
- [ ] Photo upload → Cloudinary working
- [ ] Public profile page working

#### UX
- [ ] `LoadingSpinner` on all data-fetching pages
- [ ] Error messages displayed (no blank pages on failure)
- [ ] Toast notifications for success and error events
- [ ] Empty state for users with no trips
- [ ] Delete confirmation dialog

#### Responsive
- [ ] 375px (iPhone SE) — no horizontal scroll
- [ ] iPad — 2-column trip grid
- [ ] Desktop — 3-column trip grid
- [ ] Navbar hamburger on mobile
- [ ] Forms full-width on mobile images

#### Deployment
- [ ] Backend deployed on **Render**
- [ ] Frontend deployed on **Vercel**
- [ ] MongoDB Atlas Network Access configured
- [ ] All Cloudinary env vars set on Render
- [ ] `VITE_API_URL` set on Vercel → redeployed
- [ ] CORS configured with exact Vercel domain
- [ ] `/api/health` returns `{ "success": true }`
- [ ] Full end-to-end test on live Vercel URL passed

#### GitHub
- [x] `.env` is NOT committed (confirmed in `.gitignore`)
- [x] README updated with live URL and screenshots
- [x] `screenshots/` folder with app screenshots added
- [x] Live Vercel URL added to GitHub repo **About** section

#### Submission
- [x] Live App URL: `https://tripvault-six.vercel.app`
- [x] GitHub URL: `https://github.com/karthikrchintamani-maker/Tripvault`

---

### 📸 Screenshots Folder

```text
tripvault/
├── screenshots/
│   ├── home.png
│   ├── login.png
│   ├── dashboard.png
│   ├── trip.png
│   ├── profile.png
│   └── mobile.png
└── README.md
```

Add to README:
```markdown
## 📸 Screenshots
### Home
![Home](screenshots/home.png)
### Dashboard
![Dashboard](screenshots/dashboard.png)
### Trip Details
![Trip](screenshots/trip.png)
### Public Profile
![Profile](screenshots/profile.png)
```

---

### 📌 Live Links (update after deployment)

| | URL |
|---|---|
| **Live App** | `https://tripvault-six.vercel.app` |
| **API** | `https://tripvault-server.onrender.com/api` |
| **Health Check** | `https://tripvault-server.onrender.com/api/health` |
| **GitHub** | `https://github.com/karthikrchintamani-maker/Tripvault` |
