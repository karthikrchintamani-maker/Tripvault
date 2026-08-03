import React, { useState, useEffect } from "react";
import API from "../api/axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [memoriesCount, setMemoriesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await API.get("/auth/me");
                setUser(userRes.data);

                const memoryRes = await API.get("/memory");
                setMemoriesCount(memoryRes.data.length);
            } catch (err) {
                console.error("Error fetching profile details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return "";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="glass-panel profile-card">
            <div className="profile-avatar">{getInitials(user?.name)}</div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>

            <div className="profile-details-grid">
                <div className="profile-detail-item">
                    <span className="profile-detail-label">Member Since</span>
                    <span className="profile-detail-value">
                        {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long"
                              })
                            : "N/A"}
                    </span>
                </div>

                <div className="profile-detail-item">
                    <span className="profile-detail-label">Journal Entries</span>
                    <span className="profile-detail-value">{memoriesCount} Memories</span>
                </div>
            </div>
        </div>
    );
};

export default Profile;
