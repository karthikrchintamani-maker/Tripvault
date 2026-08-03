import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import earthMap from "../assets/earth_map.png";
import TravelTracker from "../components/TravelTracker";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get("/auth/me");
                setUser(userRes.data);

                const memoryRes = await API.get("/memory");
                setMemories(memoryRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    const uniqueLocations = [...new Set(memories.map((m) => m.location.toLowerCase().trim()))];
    const latestMemory = memories.length > 0 ? memories[0] : null;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem 0" }}>
            
            {/* Hero Card Banner */}
            <div className="glass-panel welcome-hero" style={{ 
                background: "#f1f5f9", 
                border: "1px solid #e2e8f0", 
                borderRadius: "16px",
                padding: "2.5rem 3rem",
                boxShadow: "none",
                marginBottom: "2rem"
            }}>
                <h1 style={{ fontSize: "2.2rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.75rem" }}>
                    Welcome Back, {user?.name}! 👋
                </h1>
                <p style={{ color: "#475569", fontSize: "1rem", lineHeight: "1.6", maxWidth: "650px", marginBottom: "1.5rem" }}>
                    Capture and cherish your travel experiences. Maintain your personal diary and relive your favorite memories from all around the world.
                </p>
                <Link to="/memories" className="btn btn-primary" style={{ 
                    backgroundColor: "#005B60", 
                    color: "white", 
                    borderRadius: "8px", 
                    padding: "0.65rem 1.25rem",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    boxShadow: "none"
                }}>
                    📁 Manage Journal
                </Link>
            </div>

            {/* Quick Metrics Grid */}
            <div className="stats-grid" style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(3, 1fr)", 
                gap: "1.5rem", 
                marginBottom: "2.5rem" 
            }}>
                
                {/* Stat 1: Total Memories */}
                <div className="glass-panel stat-card" style={{ 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "16px", 
                    padding: "1.25rem 1.5rem",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    boxShadow: "none"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ 
                            width: "42px", 
                            height: "42px", 
                            borderRadius: "10px", 
                            backgroundColor: "#f5f3ff", 
                            color: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value" style={{ color: "#7c3aed", fontSize: "1.8rem", fontWeight: "700" }}>{memories.length}</span>
                            <span className="stat-label" style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>Total Memories</span>
                        </div>
                    </div>
                    {/* Folders Stack Graphic Vector */}
                    <svg width="60" height="50" viewBox="0 0 60 50" fill="none" style={{ opacity: 0.25, color: "#64748b" }}>
                        <rect x="10" y="10" width="38" height="28" rx="3" fill="#cbd5e1" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="5" y="15" width="38" height="28" rx="3" fill="#94a3b8" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M15 15h18m-18 6h18m-18 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>

                {/* Stat 2: Unique Locations */}
                <div className="glass-panel stat-card" style={{ 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "16px", 
                    padding: "1.25rem 1.5rem",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    boxShadow: "none"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ 
                            width: "42px", 
                            height: "42px", 
                            borderRadius: "10px", 
                            backgroundColor: "#f5f3ff", 
                            color: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m.905-3.07a9 9 0 11-12.01 1.479" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value" style={{ color: "#7c3aed", fontSize: "1.8rem", fontWeight: "700" }}>{uniqueLocations.length}</span>
                            <span className="stat-label" style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>Unique Locations</span>
                        </div>
                    </div>
                    {/* Globe Graphic Vector */}
                    <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.25, color: "#64748b" }}>
                        <circle cx="50" cy="50" r="40" />
                        <path d="M10 50 Q 50 20 90 50 Q 50 80 10 50 Z" />
                        <path d="M50 10 Q 20 50 50 90 Q 80 50 50 10 Z" />
                        <line x1="50" y1="10" x2="50" y2="90" />
                        <line x1="10" y1="50" x2="90" y2="50" />
                    </svg>
                </div>

                {/* Stat 3: Latest Adventure */}
                <div className="glass-panel stat-card" style={{ 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "16px", 
                    padding: "1.25rem 1.5rem",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    boxShadow: "none"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ 
                            width: "42px", 
                            height: "42px", 
                            borderRadius: "10px", 
                            backgroundColor: "#f5f3ff", 
                            color: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value" style={{ color: "#7c3aed", fontSize: "1.4rem", fontWeight: "700" }}>
                                {latestMemory
                                    ? new Date(latestMemory.date).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric"
                                      })
                                    : "N/A"}
                            </span>
                            <span className="stat-label" style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>Latest Adventure</span>
                        </div>
                    </div>
                    {/* Map Route Pin Vector */}
                    <svg width="55" height="50" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.25, color: "#64748b" }}>
                        <path d="M10 20 L40 10 L70 20 L90 10 M10 80 L40 70 L70 80 L90 70 M40 10 L40 70 M70 20 L70 80 M10 20 L10 80 M90 10 L90 80" strokeDasharray="3 3"/>
                        <circle cx="30" cy="40" r="4" fill="currentColor"/>
                        <path d="M30 40 Q45 25 60 50" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="60" cy="50" r="4" fill="currentColor"/>
                    </svg>
                </div>

            </div>

            {/* Recent Highlight Section */}
            <div style={{ marginTop: "2rem", marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "1rem" }}>Recent Highlight</h2>
                
                {latestMemory ? (
                    <div
                        className="glass-panel"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            overflow: "hidden",
                            borderRadius: "16px",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "none"
                        }}
                    >
                        {latestMemory.image ? (
                            <img
                                src={`http://127.0.0.1:5000${latestMemory.image}`}
                                alt={latestMemory.title}
                                style={{
                                    width: "350px",
                                    height: "230px",
                                    objectFit: "cover"
                                }}
                            />
                        ) : (
                            <div style={{ width: "350px", height: "230px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                                <span style={{ fontSize: "2.5rem" }}>📸</span>
                            </div>
                        )}
                        <div style={{ padding: "2.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#005B60", fontWeight: "600", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                <span>📍 {latestMemory.location}</span>
                                <span>•</span>
                                <span>{new Date(latestMemory.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                            </div>
                            <h3 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.75rem" }}>{latestMemory.title}</h3>
                            <p style={{ color: "#475569", lineHeight: "1.6", fontSize: "0.95rem" }}>{latestMemory.description}</p>
                        </div>
                    </div>
                ) : (
                    /* World Map Empty State Card with Earth Background */
                    <div className="glass-panel empty-state" style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url(${earthMap})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid #334155",
                        borderRadius: "16px",
                        position: "relative",
                        padding: "6rem 2rem",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
                    }}>
                        {/* India Locator Anchor overlaid on Earth */}
                        <div style={{
                            position: "absolute",
                            top: "43.5%",
                            left: "71%",
                            transform: "translate(-50%, -50%)",
                            pointerEvents: "none",
                            zIndex: 1
                        }}>
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#2dd4bf",
                                margin: "auto"
                            }}/>
                            <div style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                border: "2px solid #2dd4bf",
                                animation: "pulse 2s infinite",
                                opacity: 0.8
                            }}/>
                        </div>

                        {/* Centered Camera/Photo Icon */}
                        <div style={{ 
                            zIndex: 2, 
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "center", 
                            justifyContent: "center",
                            textAlign: "center"
                        }}>
                            {/* Dark/Brown Camera Overlay SVG in yellowish bubble */}
                            <div style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "#fef3c7",
                                color: "#d97706",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "1rem",
                                border: "2px solid #fde68a"
                            }}>
                                <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2.5" />
                                </svg>
                            </div>

                            <h3 className="empty-state-title" style={{ color: "#7c3aed", fontSize: "1.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
                                No Travel Memories Yet
                            </h3>
                            <p className="empty-state-desc" style={{ color: "#4b5563", fontSize: "0.95rem", maxWidth: "390px", marginBottom: "1.8rem", fontWeight: "500" }}>
                                Your TripVault is empty. Create your first travel memory to see it featured here!
                            </p>
                            
                            <Link to="/memories" className="btn btn-primary" style={{
                                background: "linear-gradient(135deg, #0e5b60, #4f46e5)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "0.7rem 1.5rem",
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                boxShadow: "0 4px 10px rgba(79, 70, 229, 0.2)"
                            }}>
                                + Add First Memory
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Your World Exploration Section (Redesigned) */}
            <TravelTracker memories={memories} />

        </div>
    );
};

export default Dashboard;
