import React from "react";

const MemoryCard = ({ memory, onEdit, onDelete }) => {
    const formattedDate = new Date(memory.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const backendUrl = "http://127.0.0.1:5000";
    const imageUrl = memory.image ? `${backendUrl}${memory.image}` : null;

    return (
        <div className="glass-panel memory-card">
            <div className="memory-image-container">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={memory.title}
                        className="memory-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="memory-no-image">
                        <span style={{ fontSize: "2rem" }}>🏞️</span>
                        <span>No Photo Uploaded</span>
                    </div>
                )}
                <div className="memory-badge-location">
                    <span>📍</span> {memory.location}
                </div>
                <div className="memory-badge-date">{formattedDate}</div>
            </div>

            <div className="memory-body">
                <h3 className="memory-title">{memory.title}</h3>
                <p className="memory-desc">{memory.description}</p>
                <div className="memory-actions">
                    <button
                        title="Edit Memory"
                        onClick={() => onEdit(memory)}
                        className="action-btn action-btn-edit"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        title="Delete Memory"
                        onClick={() => onDelete(memory._id)}
                        className="action-btn action-btn-delete"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemoryCard;
