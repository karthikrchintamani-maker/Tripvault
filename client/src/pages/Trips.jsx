import React, { useState, useEffect } from "react";
import API from "../api/axios";

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState(null);
    const [modalError, setModalError] = useState("");
    
    // Form fields state
    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        description: "",
        rating: 5
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const tripsRes = await API.get("/trips");
            setTrips(tripsRes.data);
        } catch (err) {
            console.error("Failed to fetch trips data:", err);
            setError("Failed to load trips data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const openCreateModal = () => {
        setEditingTrip(null);
        setModalError("");
        setFormData({
            title: "",
            destination: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            description: "",
            rating: 5
        });
        setImageFile(null);
        setImagePreview("");
        setIsModalOpen(true);
    };

    const openEditModal = (trip, e) => {
        if (e) e.stopPropagation();
        
        setEditingTrip(trip);
        setModalError("");
        setFormData({
            title: trip.title,
            destination: trip.destination,
            startDate: trip.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "",
            endDate: trip.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "",
            description: trip.description || "",
            rating: trip.rating || 5
        });
        setImageFile(null);
        setImagePreview(trip.image ? (trip.image.startsWith("http") ? trip.image : `http://127.0.0.1:5000${trip.image}`) : "");
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "rating" ? Number(value) : value
        });
        if (modalError) setModalError("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            if (modalError) setModalError("");
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this trip?")) return;

        try {
            await API.delete(`/trips/${id}`);
            setSuccess("Trip deleted successfully");
            setTrips(trips.filter((t) => t._id !== id));
            setIsModalOpen(false);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Failed to delete trip:", err);
            setError("Failed to delete trip");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setModalError("");

        if (!formData.title.trim()) {
            setModalError("Title is required");
            return;
        }
        if (!formData.destination.trim()) {
            setModalError("Destination is required");
            return;
        }

        const data = new FormData();
        data.append("title", formData.title);
        data.append("destination", formData.destination);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("description", formData.description);
        data.append("rating", formData.rating);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            if (editingTrip) {
                // Update
                const res = await API.put(`/trips/${editingTrip._id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setTrips(trips.map((t) => (t._id === editingTrip._id ? res.data : t)));
                setSuccess("Trip updated successfully");
            } else {
                // Create
                const res = await API.post("/trips", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setTrips([res.data, ...trips]);
                setSuccess("Trip created successfully");
            }
            setIsModalOpen(false);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Save trip error:", err);
            setModalError(err.response?.data?.message || "Failed to save trip");
        }
    };

    const formatTripDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 0" }}>
            
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: "1rem"
            }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                    Trip Planner
                </h1>
                <button onClick={openCreateModal} className="btn btn-primary" style={{
                    backgroundColor: "#005B60",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    fontWeight: "600",
                    fontSize: "0.95rem"
                }}>
                    ✈️ Create Trip
                </button>
            </div>

            {error && <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>{error}</div>}
            {success && <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>{success}</div>}

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
                    <h3>Loading trips...</h3>
                </div>
            ) : trips.length > 0 ? (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {trips.map((trip) => (
                        <div 
                            key={trip._id}
                            onClick={(e) => openEditModal(trip, e)}
                            className="glass-panel"
                            style={{
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: 0,
                                overflow: "hidden",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: "280px"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.05)";
                                e.currentTarget.style.borderColor = "#cbd5e1";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                                e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                        >
                            {trip.image ? (
                                <img 
                                    src={trip.image.startsWith("http") ? trip.image : `http://127.0.0.1:5000${trip.image}`} 
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

                                    <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: "1.4", margin: "0 0 1rem 0" }}>
                                        {trip.description || "No description provided."}
                                    </p>
                                </div>

                                <div style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center",
                                    borderTop: "1px solid #f1f5f9",
                                    paddingTop: "0.75rem",
                                    fontSize: "0.85rem",
                                    color: "#94a3b8"
                                }}>
                                    <span>
                                        🗓️ {formatTripDate(trip.startDate)} - {formatTripDate(trip.endDate)}
                                    </span>
                                    <button 
                                        onClick={(e) => handleDelete(trip._id, e)} 
                                        className="btn-danger"
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#ef4444",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            padding: "2px 6px",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        Delete
                                    </button>
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
                        No Trips Found
                    </h3>
                    <p style={{ color: "#64748b", maxWidth: "400px", margin: "0 auto 1.5rem auto", fontSize: "0.95rem" }}>
                        Your trip list is empty. Plan and log your very first travel adventure using the button below!
                    </p>
                    <button onClick={openCreateModal} className="btn btn-primary" style={{
                        backgroundColor: "#005B60",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.75rem 1.5rem",
                        fontWeight: "600"
                    }}>
                        + Add First Trip
                    </button>
                </div>
            )}

            {/* Modal Overlay for Add/Edit Trips */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(15, 23, 42, 0.4)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "2rem",
                        width: "100%",
                        maxWidth: "500px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>
                                {editingTrip ? "Edit Trip Details" : "Plan New Trip"}
                            </h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontSize: "1.5rem",
                                    color: "#64748b",
                                    cursor: "pointer"
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        {modalError && <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>{modalError}</div>}

                        <form onSubmit={handleFormSubmit}>
                            
                            <div className="form-group" style={{ marginBottom: "1rem" }}>
                                <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Winter in Switzerland"
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "1rem" }}>
                                <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>Destination</label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Zurich, Switzerland"
                                    required
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: "1rem" }}>
                                <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>Rating (1 - 5)</label>
                                <select 
                                    name="rating" 
                                    value={formData.rating} 
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ width: "100%", height: "42px", padding: "0.5rem" }}
                                >
                                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                                    <option value={3}>⭐⭐⭐ (3/5)</option>
                                    <option value={2}>⭐⭐ (2/5)</option>
                                    <option value={1}>⭐ (1/5)</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: "1rem" }}>
                                <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>Trip Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="form-input"
                                    style={{ padding: "0.5rem" }}
                                />
                                {imagePreview && (
                                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "150px",
                                                borderRadius: "8px",
                                                objectFit: "cover"
                                            }} 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                                <label className="form-label" style={{ fontWeight: "600", fontSize: "0.9rem", color: "#475569" }}>Description / Notes</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    style={{ minHeight: "80px", padding: "0.5rem" }}
                                    placeholder="Write details about hotels, flights, or highlights..."
                                />
                            </div>

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: "#005B60", border: "none" }}>
                                    {editingTrip ? "Save Changes" : "Add Trip"}
                                </button>
                                {editingTrip && (
                                    <button 
                                        type="button" 
                                        onClick={(e) => handleDelete(editingTrip._id, e)} 
                                        className="btn btn-danger"
                                        style={{ 
                                            backgroundColor: "#ef4444", 
                                            color: "white", 
                                            border: "none", 
                                            borderRadius: "8px", 
                                            padding: "0.75rem 1.5rem",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Trips;
