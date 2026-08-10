import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import earthMap from "../assets/earth_map.png";
import TravelTracker from "../components/TravelTracker";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [memories, setMemories] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get("/auth/me");
                setUser(userRes.data);

                const memoryRes = await API.get("/memory");
                setMemories(memoryRes.data);

                const tripsRes = await API.get("/trips");
                setTrips(tripsRes.data);
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

    const uniqueLocations = [
        ...new Set([
            ...memories.map((m) => m.location.toLowerCase().trim()).filter(Boolean),
            ...trips.map((t) => t.destination.toLowerCase().trim()).filter(Boolean)
        ])
    ];

    const getLatestAdventureDate = () => {
        let latest = null;
        
        memories.forEach((m) => {
            if (!m.date) return;
            const d = new Date(m.date);
            if (!isNaN(d.getTime())) {
                if (!latest || d > latest) latest = d;
            }
        });

        trips.forEach((t) => {
            const dateStr = t.startDate || t.createdAt;
            if (!dateStr) return;
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                if (!latest || d > latest) latest = d;
            }
        });

        return latest;
    };

    const latestAdventureDate = getLatestAdventureDate();
    const latestMemory = memories.length > 0 ? memories[0] : null;

    const allAdventures = [
        ...memories.map(m => ({
            type: "Memory",
            title: m.title,
            location: m.location || (m.city && m.country ? `${m.city}, ${m.country}` : m.city || m.country || "Unknown"),
            date: new Date(m.date),
            description: m.description,
            image: m.image
        })),
        ...trips.map(t => ({
            type: "Trip Plan",
            title: t.title,
            location: t.destination,
            date: t.startDate ? new Date(t.startDate) : new Date(t.createdAt),
            description: t.description,
            image: t.image
        }))
    ].filter(a => a.date && !isNaN(a.date.getTime()));

    allAdventures.sort((a, b) => b.date - a.date);
    const latestHighlight = allAdventures.length > 0 ? allAdventures[0] : null;

    const latestTrip = trips.length > 0 ? [...trips].sort((a, b) => {
        const da = a.startDate ? new Date(a.startDate) : new Date(a.createdAt);
        const db = b.startDate ? new Date(b.startDate) : new Date(b.createdAt);
        return db - da;
    })[0] : null;

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
                gridTemplateColumns: "repeat(4, 1fr)", 
                gap: "1.25rem", 
                marginBottom: "2.5rem" 
            }}>
                
                {/* Stat 1: Total Memories */}
                <div className="glass-panel stat-card" style={{ 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "16px", 
                    padding: "1.25rem 1.25rem",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    boxShadow: "none"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "10px", 
                            backgroundColor: "#f5f3ff", 
                            color: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value" style={{ color: "#7c3aed", fontSize: "1.6rem", fontWeight: "700" }}>{memories.length}</span>
                            <span className="stat-label" style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: "500" }}>Total Memories</span>
                        </div>
                    </div>
                </div>

                {/* Stat 2: Total Trips */}
                <div className="glass-panel stat-card" style={{ 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "16px", 
                    padding: "1.25rem 1.25rem",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    boxShadow: "none"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "10px", 
                            backgroundColor: "#f5f3ff", 
                            color: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value" style={{ color: "#7c3aed", fontSize: "1.6rem", fontWeight: "700" }}>{trips.length}</span>
                            <span className="stat-label" style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: "500" }}>Total Trips</span>
                        </div>
                    </div>
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
                                {latestAdventureDate
                                    ? latestAdventureDate.toLocaleDateString("en-US", {
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
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "1rem" }}>Recent Highlights</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    {/* Left Column: Recent Memory */}
                    {latestMemory ? (
                        <div
                            className="glass-panel"
                            style={{
                                display: "flex",
                                flexDirection: "column",
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
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "200px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                                    <span style={{ fontSize: "2rem" }}>📸</span>
                                </div>
                            )}
                            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <span style={{ 
                                        fontSize: "0.7rem", 
                                        fontWeight: "700", 
                                        textTransform: "uppercase", 
                                        padding: "0.2rem 0.5rem", 
                                        borderRadius: "4px",
                                        backgroundColor: "#e6fffa",
                                        color: "#0d9488"
                                    }}>
                                        Memory
                                    </span>
                                    <span style={{ color: "#64748b" }}>•</span>
                                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                        {new Date(latestMemory.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.4rem" }}>{latestMemory.title}</h3>
                                <p style={{ color: "#005B60", fontWeight: "600", fontSize: "0.85rem", marginBottom: "0.6rem" }}>📍 {latestMemory.location}</p>
                                <p style={{ color: "#475569", lineHeight: "1.5", fontSize: "0.9rem" }}>{latestMemory.description}</p>
                            </div>
                        </div>
                    ) : (
                        /* India Map Banner Placeholder if no memories exist */
                        <div className="glass-panel empty-state" style={{
                            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url(${earthMap})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            border: "1px solid #334155",
                            borderRadius: "16px",
                            padding: "4rem 1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center"
                        }}>
                            <h3 style={{ color: "#2dd4bf", fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>No Memories Logged</h3>
                            <p style={{ color: "#cbd5e1", fontSize: "0.85rem", maxWidth: "250px", marginBottom: "1.2rem" }}>Create your first memory to see it highlighted here!</p>
                            <Link to="/memories" className="btn btn-primary" style={{ background: "linear-gradient(135deg, #0e5b60, #4f46e5)", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.85rem", fontWeight: "600" }}>+ Add Memory</Link>
                        </div>
                    )}

                    {/* Right Column: Recent Trip Plan */}
                    {latestTrip ? (
                        <div
                            className="glass-panel"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                borderRadius: "16px",
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                boxShadow: "none"
                            }}
                        >
                            {latestTrip.image ? (
                                <img
                                    src={`http://127.0.0.1:5000${latestTrip.image}`}
                                    alt={latestTrip.title}
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "200px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                                    <span style={{ fontSize: "2rem" }}>✈️</span>
                                </div>
                            )}
                            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <span style={{ 
                                        fontSize: "0.7rem", 
                                        fontWeight: "700", 
                                        textTransform: "uppercase", 
                                        padding: "0.2rem 0.5rem", 
                                        borderRadius: "4px",
                                        backgroundColor: "#f5f3ff",
                                        color: "#7c3aed"
                                    }}>
                                        Trip Plan
                                    </span>
                                    <span style={{ color: "#64748b" }}>•</span>
                                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                        {latestTrip.startDate ? new Date(latestTrip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Upcoming"}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.4rem" }}>{latestTrip.title}</h3>
                                <p style={{ color: "#4f46e5", fontWeight: "600", fontSize: "0.85rem", marginBottom: "0.6rem" }}>📍 {latestTrip.destination}</p>
                                <p style={{ color: "#475569", lineHeight: "1.5", fontSize: "0.9rem" }}>{latestTrip.description}</p>
                            </div>
                        </div>
                    ) : (
                        /* Earth map placeholder card if no trips exist */
                        <div className="glass-panel empty-state" style={{
                            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url(${earthMap})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            border: "1px solid #334155",
                            borderRadius: "16px",
                            padding: "4rem 1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center"
                        }}>
                            <h3 style={{ color: "#a78bfa", fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>No Trip Planned</h3>
                            <p style={{ color: "#cbd5e1", fontSize: "0.85rem", maxWidth: "250px", marginBottom: "1.2rem" }}>Plan your next trip to see it highlighted here!</p>
                            <Link to="/trips" className="btn btn-primary" style={{ background: "linear-gradient(135deg, #4f46e5, #005B60)", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.85rem", fontWeight: "600" }}>+ Plan a Trip</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Your World Exploration Section (Redesigned) */}
            <TravelTracker memories={memories} trips={trips} />

        </div>
    );
};

export default Dashboard;
