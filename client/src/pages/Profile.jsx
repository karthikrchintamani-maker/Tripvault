import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [memories, setMemories] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit profile modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBio, setEditBio] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState("");

    // Avatar upload state
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await API.get("/auth/me");
                setUser(userRes.data);
                setEditBio(userRes.data.bio || "");
                setEditUsername(userRes.data.username || "");
                if (userRes.data.avatar) setAvatarUrl(userRes.data.avatar);
                const memoryRes = await API.get("/memory");
                setMemories(memoryRes.data);
                const tripsRes = await API.get("/trips");
                setTrips(tripsRes.data);
            } catch (err) {
                console.error("Error fetching profile details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // ── Avatar upload handler ──────────────────────────────────────────
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const localUrl = URL.createObjectURL(file);
        setAvatarUrl(localUrl);
        setAvatarUploading(true);

        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await API.put("/users/profile/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAvatarUrl(res.data.avatar);
            setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
        } catch (err) {
            console.error("Avatar upload failed:", err);
            // revert to initial on failure
            setAvatarUrl(user?.avatar || null);
        } finally {
            setAvatarUploading(false);
            e.target.value = "";
        }
    };

    // ── Edit Profile save handler ──────────────────────────────────────
    const handleEditSave = async () => {
        setEditSaving(true);
        setEditError("");
        try {
            const res = await API.put("/users/profile", {
                bio: editBio,
                username: editUsername,
            });
            setUser((prev) => ({ ...prev, bio: res.data.bio, username: res.data.username }));
            setShowEditModal(false);
        } catch (err) {
            setEditError(err.response?.data?.message || "Could not save changes.");
        } finally {
            setEditSaving(false);
        }
    };

    const openEdit = () => {
        setEditBio(user?.bio || "");
        setEditUsername(user?.username || "");
        setEditError("");
        setShowEditModal(true);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <h2 style={{ color: "#64748b", fontWeight: 500 }}>Loading Profile...</h2>
            </div>
        );
    }

    const uniqueLocations = [
        ...new Set([
            ...memories.map((m) => (m.location || m.city || m.country || "").toLowerCase().trim()).filter(Boolean),
            ...trips.map((t) => (t.destination || t.city || t.country || "").toLowerCase().trim()).filter(Boolean)
        ])
    ];

    const memberSinceDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : "N/A";

    return (
        <div style={{ maxWidth: "780px", margin: "2.5rem auto", padding: "0 1rem", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

            {/* ── Hidden file input for avatar ── */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
            />

            <div style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 2px 20px rgba(148,163,184,0.15)",
                border: "1px solid #e8edf5"
            }}>

                {/* ═══ BANNER ═══ */}
                <div style={{
                    position: "relative",
                    backgroundImage: "url('/profile_banner_mountains.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    padding: "2rem 2rem 2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minHeight: "320px",
                    overflow: "hidden"
                }}>

                    {/* Cloud */}
                    <svg style={{ position: "absolute", top: "16px", left: "20px", opacity: 0.9 }}
                        width="72" height="38" viewBox="0 0 72 38">
                        <ellipse cx="28" cy="28" rx="22" ry="12" fill="white" />
                        <ellipse cx="42" cy="26" rx="18" ry="11" fill="white" />
                        <ellipse cx="20" cy="30" rx="14" ry="10" fill="white" />
                        <ellipse cx="35" cy="20" rx="14" ry="10" fill="white" />
                    </svg>

                    {/* Dotted trail + paper plane */}
                    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "55%", pointerEvents: "none" }}
                        viewBox="0 0 780 140" fill="none" preserveAspectRatio="none">
                        <path d="M 110,85 Q 160,40 210,75 Q 255,105 230,125 Q 205,145 175,115 Q 148,88 195,70 Q 310,30 430,70 Q 550,108 650,55"
                            stroke="#8db4e8" strokeWidth="1.6" strokeDasharray="6 5" fill="none" />
                        <g transform="translate(648,55) rotate(-20)">
                            <polygon points="0,0 -18,-6 -15,9" fill="#2563eb" />
                            <polygon points="0,0 -15,9 -18,-6" fill="#1e40af" opacity="0.6" />
                            <polygon points="-15,9 -20,13 -12,7" fill="#3b82f6" opacity="0.5" />
                        </g>
                    </svg>

                    {/* ── Avatar (clickable to upload) ── */}
                    <div
                        onClick={handleAvatarClick}
                        title="Change profile photo"
                        style={{
                            position: "relative",
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            background: avatarUrl ? "transparent" : "#1a6fb5",
                            border: "4px solid #ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "3rem",
                            fontWeight: "800",
                            color: "#ffffff",
                            boxShadow: "0 6px 20px rgba(26,111,181,0.35)",
                            zIndex: 10,
                            marginTop: "0.5rem",
                            marginBottom: "0.2rem",
                            flexShrink: 0,
                            cursor: "pointer",
                            overflow: "hidden",
                            transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.querySelector(".cam-overlay").style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.querySelector(".cam-overlay").style.opacity = "0";
                        }}
                    >
                        {/* Avatar image or initial */}
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}

                        {/* Hover overlay */}
                        <div className="cam-overlay" style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0,0,0,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                            borderRadius: "50%"
                        }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>
                        </div>

                        {/* Camera badge (bottom-right) */}
                        <div style={{
                            position: "absolute",
                            bottom: "2px",
                            right: "2px",
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: avatarUploading ? "#dbeafe" : "#ffffff",
                            border: "2px solid #e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                            zIndex: 11
                        }}>
                            {avatarUploading ? (
                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #2563eb", borderTopColor: "transparent", animation: "spin 0.6s linear infinite" }} />
                            ) : (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "#0f172a", margin: "0.6rem 0 0.3rem", letterSpacing: "-0.5px", zIndex: 10, position: "relative" }}>
                        {user?.name?.toLowerCase()}
                    </h2>

                    {/* Email */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#475569", fontSize: "0.9rem", marginBottom: "1rem", zIndex: 10, position: "relative" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M22 7l-10 7L2 7" />
                        </svg>
                        {user?.email}
                    </div>

                    {/* ── Explorer button (clickable → opens edit modal) ── */}
                    <button
                        onClick={openEdit}
                        title="Edit your profile"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            background: "rgba(255,255,255,0.82)",
                            backdropFilter: "blur(8px)",
                            color: "#2563eb",
                            border: "1.5px solid #bfdbfe",
                            borderRadius: "999px",
                            padding: "0.42rem 1.1rem",
                            fontSize: "0.88rem",
                            fontWeight: "700",
                            cursor: "pointer",
                            zIndex: 10,
                            position: "relative",
                            transition: "all 0.18s ease"
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.18)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.82)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
                        </svg>
                        Explorer
                    </button>
                </div>

                {/* ═══ WHITE INFO SECTION ═══ */}
                <div style={{ background: "#ffffff", padding: "2rem 2.5rem 2rem" }}>

                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginBottom: "1.75rem" }}>

                        {/* Member Since */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.5rem 1rem 0.5rem 0" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", flexShrink: 0 }}>
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Member Since</div>
                                <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>{memberSinceDate}</div>
                            </div>
                        </div>

                        {/* Journal Entries = memories + trips */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.5rem 1rem", borderLeft: "1px solid #f1f5f9" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", flexShrink: 0 }}>
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Journal Entries</div>
                                <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>
                                    {memories.length + trips.length} Total
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                                    {memories.length} {memories.length === 1 ? "Memory" : "Memories"} · {trips.length} {trips.length === 1 ? "Trip" : "Trips"}
                                </div>
                            </div>
                        </div>

                        {/* Places Visited */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.5rem 0 0.5rem 1rem", borderLeft: "1px solid #f1f5f9" }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", flexShrink: 0 }}>
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" }}>Places Visited</div>
                                <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>{uniqueLocations.length} {uniqueLocations.length === 1 ? "Place" : "Places"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bio card */}
                    <div style={{
                        position: "relative",
                        background: "#eff6ff",
                        borderRadius: "14px",
                        padding: "1.2rem 1.4rem",
                        display: "flex",
                        alignItems: "center",
                        overflow: "hidden",
                        minHeight: "76px"
                    }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", maxWidth: "60%", zIndex: 2 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb" style={{ flexShrink: 0, marginTop: "1px", opacity: 0.7 }}>
                                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                            </svg>
                            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "700", color: "#1e40af", lineHeight: "1.55" }}>
                                {user?.bio || "Collect moments, not things. Travel more, worry less. 💙"}
                            </p>
                        </div>
                        <img
                            src="/bio_card_mountains.jpg"
                            alt="mountain illustration"
                            style={{
                                position: "absolute", right: 0, bottom: 0,
                                height: "100%", width: "220px",
                                objectFit: "cover", objectPosition: "center",
                                zIndex: 1, pointerEvents: "none",
                                borderRadius: "0 14px 14px 0",
                                mixBlendMode: "multiply"
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ═══ EDIT PROFILE MODAL ═══ */}
            {showEditModal && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 1000,
                    background: "rgba(15,23,42,0.45)",
                    backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "1rem"
                }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}
                >
                    <div style={{
                        background: "#ffffff", borderRadius: "20px",
                        padding: "2rem", width: "100%", maxWidth: "440px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>Edit Profile</h3>
                            <button onClick={() => setShowEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "1.3rem", lineHeight: 1 }}>✕</button>
                        </div>

                        {/* Username field */}
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "0.4rem" }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder="e.g. karthik123"
                            style={{
                                width: "100%", padding: "0.75rem 1rem",
                                border: "1.5px solid #e2e8f0", borderRadius: "10px",
                                fontSize: "0.95rem", color: "#0f172a",
                                outline: "none", marginBottom: "1.2rem",
                                boxSizing: "border-box",
                                transition: "border-color 0.15s"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        />

                        {/* Bio field */}
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "0.4rem" }}>
                            Bio
                        </label>
                        <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder="Tell the world about your travels..."
                            rows={3}
                            style={{
                                width: "100%", padding: "0.75rem 1rem",
                                border: "1.5px solid #e2e8f0", borderRadius: "10px",
                                fontSize: "0.95rem", color: "#0f172a",
                                outline: "none", resize: "vertical",
                                marginBottom: "1.2rem", boxSizing: "border-box",
                                fontFamily: "inherit", transition: "border-color 0.15s"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        />

                        {editError && (
                            <div style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "1rem", background: "#fef2f2", padding: "0.6rem 0.9rem", borderRadius: "8px" }}>
                                {editError}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{
                                    flex: 1, padding: "0.75rem",
                                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                                    borderRadius: "10px", cursor: "pointer",
                                    fontSize: "0.9rem", fontWeight: "700", color: "#64748b"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={editSaving}
                                style={{
                                    flex: 1, padding: "0.75rem",
                                    background: editSaving ? "#93c5fd" : "#2563eb",
                                    border: "none", borderRadius: "10px",
                                    cursor: editSaving ? "not-allowed" : "pointer",
                                    fontSize: "0.9rem", fontWeight: "700", color: "#ffffff",
                                    transition: "background 0.15s"
                                }}
                            >
                                {editSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Spinner keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Profile;
