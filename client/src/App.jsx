import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Memories from "./pages/Memories";
import Profile from "./pages/Profile";
import Trips from "./pages/Trips";
import PublicProfile from "./pages/PublicProfile";

function AppContent() {
  const location = useLocation();
  // Hide global Navbar on login & register pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/";

  return (
    <div className="app-container">
      {!isAuthPage && <Navbar />}
      <main className="main-content" style={isAuthPage ? { padding: 0, maxWidth: "100%", margin: 0 } : {}}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<PublicProfile />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
