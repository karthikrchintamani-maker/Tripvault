import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials, please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card-wrapper">
                
                {/* Left Panel: Gradient and Travel Watermarks */}
                <div className="auth-left-panel">
                    
                    {/* Brand Logo */}
                    <div className="auth-brand-logo">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                        TripVault
                    </div>

                    {/* TV Watermark */}
                    <div className="auth-watermark-tv">TV</div>

                    {/* Vectors */}
                    {/* Top-Right travel icons path watermark */}
                    <svg className="auth-vector-icons" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="50" cy="45" r="18" strokeDasharray="3 3"/>
                        <path d="M50 27v-5M50 63v-5M32 45h-5M68 45h-5"/>
                        <rect x="45" y="40" width="10" height="10" rx="2" />
                        <path d="M47 40v-4a3 3 0 0 1 6 0v4"/>
                        <path d="M25 25 L35 30 L45 25" strokeWidth="1"/>
                        <path d="M75 30 L80 20 L85 28" strokeWidth="1"/>
                        {/* Airplane mini shape */}
                        <path d="M78 22 l2 2 -4 4 1 1 3-1 2 2 -1 1 -2-2 -3 1 1 1 -1 3 2 2" fill="currentColor"/>
                        {/* Laptop mini shape */}
                        <rect x="20" y="55" width="12" height="8" rx="1" strokeWidth="1"/>
                        <line x1="18" y1="63" x2="34" y2="63" strokeWidth="1.5"/>
                    </svg>

                    {/* Bottom-Left Compass watermark */}
                    <svg className="auth-vector-compass" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="50" cy="50" r="40" />
                        <circle cx="50" cy="50" r="36" strokeDasharray="2 2" />
                        <path d="M50 10 L50 90 M10 50 L90 50" strokeWidth="0.75" />
                        <polygon points="50,18 54,50 50,54 46,50" fill="currentColor" />
                        <polygon points="50,82 54,50 50,46 46,50" fill="none" />
                        <polygon points="18,50 50,54 54,50 50,46" fill="none" />
                        <polygon points="82,50 50,54 46,50 50,46" fill="none" />
                    </svg>

                    {/* Bottom-Right Globe watermark */}
                    <svg className="auth-vector-globe" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="50" cy="50" r="40" />
                        <path d="M10 50 Q 50 20 90 50 Q 50 80 10 50 Z" />
                        <path d="M10 50 Q 50 35 90 50 Q 50 65 10 50 Z" />
                        <path d="M50 10 Q 20 50 50 90 Q 80 50 50 10 Z" />
                        <path d="M50 10 Q 35 50 50 90 Q 65 50 50 10 Z" />
                        <line x1="50" y1="10" x2="50" y2="90" />
                        <line x1="10" y1="50" x2="90" y2="50" />
                    </svg>

                    {/* Welcome Copy */}
                    <div className="auth-left-content">
                        <h1 className="auth-left-title">Welcome Back</h1>
                        <p className="auth-left-subtitle">Log in to unlock your personal TripVault</p>
                    </div>
                </div>

                {/* Right Panel: Login Form and Top Navigation */}
                <div className="auth-right-panel">
                    
                    {/* Top right Navigation Buttons */}
                    <div className="auth-right-nav">
                        <button className="auth-nav-btn auth-nav-btn-active">Login</button>
                        <Link to="/register" className="auth-nav-link auth-nav-link-underline">Register</Link>
                    </div>

                    {/* Form Card */}
                    <div className="auth-form-card">
                        {error && <div className="alert alert-danger" style={{ fontSize: "0.85rem", padding: "0.6rem", borderRadius: "8px" }}>{error}</div>}

                        <form onSubmit={onSubmit}>
                            
                            {/* Email Input */}
                            <label className="auth-label" htmlFor="email">Email Address</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    className="auth-input"
                                    placeholder="karthik@example.com"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <label className="auth-label" htmlFor="password">Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    className="auth-input"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Login"}
                            </button>
                        </form>

                        <div className="auth-footer-link">
                            Don't have an account? <Link to="/register">Register here</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
