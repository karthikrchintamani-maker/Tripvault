import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const { name, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/auth/register", { name, email, password });
            setSuccess(res.data.message || "Registration successful! Redirecting to login...");
            setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed, please check inputs.");
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
                    <svg className="auth-vector-icons" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="50" cy="45" r="18" strokeDasharray="3 3"/>
                        <path d="M50 27v-5M50 63v-5M32 45h-5M68 45h-5"/>
                        <rect x="45" y="40" width="10" height="10" rx="2" />
                        <path d="M47 40v-4a3 3 0 0 1 6 0v4"/>
                        <path d="M25 25 L35 30 L45 25" strokeWidth="1"/>
                        <path d="M75 30 L80 20 L85 28" strokeWidth="1"/>
                        <path d="M78 22 l2 2 -4 4 1 1 3-1 2 2 -1 1 -2-2 -3 1 1 1 -1 3 2 2" fill="currentColor"/>
                        <rect x="20" y="55" width="12" height="8" rx="1" strokeWidth="1"/>
                        <line x1="18" y1="63" x2="34" y2="63" strokeWidth="1.5"/>
                    </svg>

                    <svg className="auth-vector-compass" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="50" cy="50" r="40" />
                        <circle cx="50" cy="50" r="36" strokeDasharray="2 2" />
                        <path d="M50 10 L50 90 M10 50 L90 50" strokeWidth="0.75" />
                        <polygon points="50,18 54,50 50,54 46,50" fill="currentColor" />
                        <polygon points="50,82 54,50 50,46 46,50" fill="none" />
                        <polygon points="18,50 50,54 54,50 50,46" fill="none" />
                        <polygon points="82,50 50,54 46,50 50,46" fill="none" />
                    </svg>

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
                        <h1 className="auth-left-title">Create Account</h1>
                        <p className="auth-left-subtitle">Join TripVault to start capturing your adventures</p>
                    </div>
                </div>

                {/* Right Panel: Form Card and Top Navigation */}
                <div className="auth-right-panel" style={{ padding: "1.5rem 3rem" }}>
                    
                    {/* Top right Navigation Buttons */}
                    <div className="auth-right-nav">
                        <Link to="/login" className="auth-nav-link auth-nav-link-underline">Login</Link>
                        <button className="auth-nav-btn auth-nav-btn-active">Register</button>
                    </div>

                    {/* Form Card */}
                    <div className="auth-form-card" style={{ maxWidth: "380px", padding: "1.8rem" }}>
                        {error && <div className="alert alert-danger" style={{ fontSize: "0.85rem", padding: "0.5rem", borderRadius: "8px" }}>{error}</div>}
                        {success && <div className="alert alert-success" style={{ fontSize: "0.85rem", padding: "0.5rem", borderRadius: "8px" }}>{success}</div>}

                        <form onSubmit={onSubmit}>
                            
                            {/* Full Name */}
                            <label className="auth-label" htmlFor="name">Full Name</label>
                            <div className="auth-input-wrapper" style={{ marginBottom: "1rem" }}>
                                <span className="auth-input-icon">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    className="auth-input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            {/* Email Address */}
                            <label className="auth-label" htmlFor="email">Email Address</label>
                            <div className="auth-input-wrapper" style={{ marginBottom: "1rem" }}>
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
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <label className="auth-label" htmlFor="password">Password</label>
                            <div className="auth-input-wrapper" style={{ marginBottom: "1rem" }}>
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

                            {/* Confirm Password */}
                            <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="auth-input-wrapper" style={{ marginBottom: "1.2rem" }}>
                                <span className="auth-input-icon">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                </span>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
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
                                style={{ margin: "0.2rem 0 1rem 0" }}
                            >
                                {loading ? "Creating account..." : "Register"}
                            </button>
                        </form>

                        <div className="auth-footer-link">
                            Already have an account? <Link to="/login">Sign in here</Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
