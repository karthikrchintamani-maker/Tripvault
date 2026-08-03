import React, { useState, useEffect } from "react";
import API from "../api/axios";
import MemoryCard from "../components/MemoryCard";

const Memories = () => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState(null);
    const [modalError, setModalError] = useState("");

    // Form inputs state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        date: "",
        country: "",
        city: "",
        latitude: "",
        longitude: "",
        startDate: "",
        endDate: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const fetchMemories = async () => {
        setLoading(true);
        try {
            const res = await API.get("/memory");
            setMemories(res.data);
        } catch (err) {
            setError("Failed to fetch memories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const openCreateModal = () => {
        setEditingMemory(null);
        setModalError("");
        setFormData({
            title: "",
            description: "",
            location: "",
            date: new Date().toISOString().split("T")[0],
            country: "",
            city: "",
            latitude: "12.9716",
            longitude: "77.5946",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0]
        });
        setImageFile(null);
        setImagePreview("");
        setIsModalOpen(true);
    };

    const openEditModal = (memory) => {
        setEditingMemory(memory);
        setModalError("");
        setFormData({
            title: memory.title,
            description: memory.description,
            location: memory.location,
            date: new Date(memory.date).toISOString().split("T")[0],
            country: memory.country || "",
            city: memory.city || "",
            latitude: memory.latitude !== undefined ? String(memory.latitude) : "0",
            longitude: memory.longitude !== undefined ? String(memory.longitude) : "0",
            startDate: memory.startDate ? new Date(memory.startDate).toISOString().split("T")[0] : "",
            endDate: memory.endDate ? new Date(memory.endDate).toISOString().split("T")[0] : ""
        });
        setImageFile(null);
        setImagePreview(memory.image ? `http://127.0.0.1:5000${memory.image}` : "");
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this memory?")) return;

        try {
            await API.delete(`/memory/${id}`);
            setSuccess("Memory deleted successfully");
            setMemories(memories.filter((m) => m._id !== id));
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Failed to delete memory");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setModalError("");

        // Programmatic field validation to catch empty fields in hidden scroll views
        if (!formData.title.trim()) {
            setModalError("Title is required");
            return;
        }
        if (!formData.location.trim()) {
            setModalError("Location is required");
            return;
        }
        if (!formData.date) {
            setModalError("Date is required");
            return;
        }
        if (!formData.country.trim()) {
            setModalError("Country is required");
            return;
        }
        if (!formData.city.trim()) {
            setModalError("City is required");
            return;
        }
        if (!formData.startDate) {
            setModalError("Start date is required");
            return;
        }
        if (!formData.endDate) {
            setModalError("End date is required");
            return;
        }
        if (!formData.description.trim()) {
            setModalError("Description is required");
            return;
        }

        // Multi-part Form Data
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("location", formData.location);
        data.append("date", formData.date);
        data.append("country", formData.country);
        data.append("city", formData.city);
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            if (editingMemory) {
                // Update
                const res = await API.put(`/memory/${editingMemory._id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setMemories(memories.map((m) => (m._id === editingMemory._id ? res.data : m)));
                setSuccess("Memory updated successfully");
            } else {
                // Create
                const res = await API.post("/memory", data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setMemories([res.data, ...memories]);
                setSuccess("Memory created successfully");
            }
            setIsModalOpen(false);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Create/update memory error:", err);
            setModalError(err.response?.data?.message || "Failed to save memory");
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Travel Journal</h1>
                <button onClick={openCreateModal} className="btn btn-primary">
                    + Add New Memory
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
                    <h3>Loading memories...</h3>
                </div>
            ) : memories.length > 0 ? (
                <div className="memories-grid">
                    {memories.map((memory) => (
                        <MemoryCard
                            key={memory._id}
                            memory={memory}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-panel empty-state">
                    <span className="empty-state-icon">🗺️</span>
                    <h3 className="empty-state-title">Your Journal is Empty</h3>
                    <p className="empty-state-desc">
                        Start documenting your adventures by adding your very first travel memory!
                    </p>
                    <button onClick={openCreateModal} className="btn btn-primary">
                        + Add First Memory
                    </button>
                </div>
            )}

            {/* Modal Overlay for Add/Edit */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingMemory ? "Edit Memory" : "New Memory"}</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                &times;
                            </button>
                        </div>

                        {modalError && <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>{modalError}</div>}

                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Scuba diving in Maldives"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Malé, Maldives"
                                    required
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="country">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Maldives"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="city">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Malé"
                                        required
                                    />
                                </div>
                            </div>



                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="startDate">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="endDate">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="date">
                                    Display Date (Journal Date)
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="description">
                                    Description / Diary Entry
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="form-input form-textarea"
                                    placeholder="Detail your experience, the food, people, and vibes..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Trip Photo</label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ color: "var(--text-secondary)" }}
                                    />
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="file-input-preview"
                                        />
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingMemory ? "Update Memory" : "Create Memory"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Memories;
