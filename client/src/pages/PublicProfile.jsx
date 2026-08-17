import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";

const PublicProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPublicProfile = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await API.get(`/users/${username}/profile`);
                setProfile(res.data);
            } catch (err) {
                console.error("Fetch public profile error:", err);
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchPublicProfile();
        }
    }, [username]);

    const formatTripDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <h2>Loading traveler profile...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", padding: "2rem" }} className="glass-panel">
                <span style={{ fontSize: "3rem" }}>😕</span>
                <h2 style={{ marginTop: "1rem", color: "#0f172a" }}>Profile Not Found</h2>
                <p style={{ color: "#64748b", margin: "1rem 0" }}>{error}</p>
                <Link to="/" className="btn btn-primary" style={{ backgroundColor: "#005B60", border: "none", color: "white", padding: "0.5rem 1.5rem", borderRadius: "8px", textDecoration: "none" }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 0" }}>
            {/* Profile Header */}
            <div className="glass-panel" style={{
                background: "linear-gradient(135deg, #005B60, #004b4f)",
                color: "white",
                borderRadius: "16px",
                padding: "2.5rem 3rem",
                marginBottom: "2rem",
                boxShadow: "none"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        color: "#005B60",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        fontWeight: "700"
                    }}>
                        {profile?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: 0 }}>{profile?.name}</h1>
                        <p style={{ margin: "0.25rem 0 0 0", color: "#cbd5e1", fontSize: "1rem" }}>@{profile?.username}</p>
                    </div>
                </div>
                {profile?.bio ? (
                    <p style={{ color: "#f1f5f9", fontSize: "1.05rem", lineHeight: "1.6", maxWidth: "700px", margin: 0 }}>
                        {profile.bio}
                    </p>
                ) : (
                    <p style={{ color: "#cbd5e1", fontStyle: "italic", margin: 0 }}>No bio provided.</p>
                )}
            </div>

            {/* Trips Grid */}
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "1.5rem" }}>
                🗺️ {profile?.name}'s Trip Plans ({profile?.trips?.length || 0})
            </h2>

            {profile?.trips && profile.trips.length > 0 ? (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {profile.trips.map((trip) => (
                        <div 
                            key={trip._id}
                            className="glass-panel"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: 0,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: "280px"
                            }}
                        >
                            {trip.coverImage ? (
                                <img 
                                    src={trip.coverImage.startsWith("http") ? trip.coverImage : `http://127.0.0.1:5000${trip.coverImage}`} 
                                    alt={trip.title} 
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "150px",
                                    backgroundColor: "#f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#94a3b8"
                                }}>
                                    <span style={{ fontSize: "2rem" }}>📸 No Image</span>
                                </div>
                            )}

                            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                                            {trip.title}
                                        </h3>
                                        <span style={{ fontSize: "0.9rem" }}>
                                            {"⭐".repeat(trip.rating || 5)}
                                        </span>
                                    </div>
                                    
                                    <div style={{ color: "#005B60", fontWeight: "600", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                                        📍 {trip.destination}
                                    </div>
                                </div>

                                <div style={{ 
                                    borderTop: "1px solid #f1f5f9",
                                    paddingTop: "0.75rem",
                                    fontSize: "0.85rem",
                                    color: "#94a3b8"
                                }}>
                                    🗓️ {formatTripDate(trip.startDate)} - {formatTripDate(trip.endDate)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel" style={{
                    padding: "4rem 2rem",
                    textAlign: "center",
                    background: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "16px"
                }}>
                    <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🗺️</span>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.5rem" }}>
                        No Trip Plans Posted
                    </h3>
                    <p style={{ color: "#64748b", maxWidth: "400px", margin: "0 auto", fontSize: "0.95rem" }}>
                        This traveler has not mapped out any trip plans yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PublicProfile;
