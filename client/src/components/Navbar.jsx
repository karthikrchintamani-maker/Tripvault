import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (token) {
            API.get("/auth/me")
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem("token");
                    setUser(null);
                });
        } else {
            setUser(null);
        }
    }, [token, location.pathname]);

    // Close the mobile menu whenever route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setMenuOpen(false);
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <Link to={token ? "/dashboard" : "/login"} className="navbar-brand" onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                TripVault
            </Link>

            <button 
                className="nav-toggle" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
                style={{
                    display: "none",
                    background: "none",
                    border: "none",
                    fontSize: "1.75rem",
                    color: "#005B60",
                    cursor: "pointer",
                    padding: "0.25rem 0.5rem"
                }}
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
                {token ? (
                    <>
                        {user && (
                            <div className="user-greeting">
                                Hello, <span className="user-name" style={{ marginRight: "0.5rem" }}>{user.name}</span>
                                <span className="greeting-divider" style={{ color: "#cbd5e1", marginRight: "0.5rem" }}>|</span>
                            </div>
                        )}
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/memories"
                            className={`nav-link ${isActive("/memories") ? "active" : ""}`}
                        >
                            Memories
                        </Link>
                        <Link
                            to="/trips"
                            className={`nav-link ${isActive("/trips") ? "active" : ""}`}
                        >
                            Trips
                        </Link>
                        <Link
                            to="/profile"
                            className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                        >
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.9rem" }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className={`nav-link ${isActive("/login") || isActive("/") ? "active" : ""}`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className={`nav-link ${isActive("/register") ? "active" : ""}`}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
