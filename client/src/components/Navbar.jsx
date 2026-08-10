import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <Link to={token ? "/dashboard" : "/login"} className="navbar-brand">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                TripVault
            </Link>
            <div className="navbar-links">
                {token ? (
                    <>
                        {user && (
                            <div className="user-greeting">
                                Hello, <span className="user-name" style={{ marginRight: "0.5rem" }}>{user.name}</span>
                                <span style={{ color: "#cbd5e1", marginRight: "0.5rem" }}>|</span>
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
