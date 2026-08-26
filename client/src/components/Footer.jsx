import React from "react";

const Footer = () => {
    return (
        <footer style={{
            borderTop: "1px solid #e2e8f0",
            padding: "2rem 1.5rem",
            background: "#ffffff",
            textAlign: "center",
            marginTop: "auto",
            color: "#64748b",
            fontSize: "0.9rem"
        }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem"
            }}>
                <h3 style={{ 
                    fontSize: "1.2rem", 
                    fontWeight: "800", 
                    color: "#005B60", 
                    margin: 0,
                    letterSpacing: "-0.3px"
                }}>
                    TripVault
                </h3>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    Capture your journeys. Share your memories.
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>
                    © 2026 Karthik R · All rights reserved.
                </p>
                <a 
                    href="https://github.com/karthikrchintamani-maker/Tripvault" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                        color: "#005B60",
                        fontWeight: "600",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        marginTop: "0.25rem",
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "#004b50"}
                    onMouseLeave={(e) => e.target.style.color = "#005B60"}
                >
                    GitHub Repository
                </a>
            </div>
        </footer>
    );
};

export default Footer;
