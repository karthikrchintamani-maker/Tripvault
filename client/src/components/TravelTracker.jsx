import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Inline SVG Teal Marker Pin (Offline compatible)
const tealPinSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#0d9488"/>
</svg>
`)}`;

const customMarkerIcon = new L.Icon({
    iconUrl: tealPinSvg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Mapping of countries to continents
const countryToContinent = {
    // Asia
    "india": "Asia", "china": "Asia", "japan": "Asia", "south korea": "Asia", "indonesia": "Asia",
    "thailand": "Asia", "singapore": "Asia", "malaysia": "Asia", "vietnam": "Asia", "philippines": "Asia",
    "pakistan": "Asia", "bangladesh": "Asia", "nepal": "Asia", "sri lanka": "Asia", "russia": "Asia",
    "turkey": "Asia", "saudi arabia": "Asia", "uae": "Asia", "iran": "Asia", "iraq": "Asia",
    "israel": "Asia", "jordan": "Asia", "lebanon": "Asia", "syria": "Asia", "yemen": "Asia",
    "oman": "Asia", "qatar": "Asia", "kuwait": "Asia", "bahrain": "Asia", "kazakhstan": "Asia",
    "uzbekistan": "Asia", "turkmenistan": "Asia", "kyrgyzstan": "Asia", "tajikistan": "Asia",
    "afghanistan": "Asia", "mongolia": "Asia", "myanmar": "Asia", "cambodia": "Asia", "laos": "Asia",
    "taiwan": "Asia", "maldives": "Asia", "bhutan": "Asia", "brunei": "Asia", "east timor": "Asia",
    
    // Europe
    "united kingdom": "Europe", "france": "Europe", "germany": "Europe", "italy": "Europe", "spain": "Europe",
    "switzerland": "Europe", "netherlands": "Europe", "belgium": "Europe", "austria": "Europe", "sweden": "Europe",
    "norway": "Europe", "denmark": "Europe", "finland": "Europe", "ireland": "Europe", "portugal": "Europe",
    "greece": "Europe", "poland": "Europe", "czech republic": "Europe", "hungary": "Europe", "romania": "Europe",
    "bulgaria": "Europe", "croatia": "Europe", "slovenia": "Europe", "slovakia": "Europe", "estonia": "Europe",
    "latvia": "Europe", "lithuania": "Europe", "ukraine": "Europe", "belarus": "Europe", "moldova": "Europe",
    "albania": "Europe", "north macedonia": "Europe", "serbia": "Europe", "montenegro": "Europe",
    "bosnia and herzegovina": "Europe", "iceland": "Europe", "finland": "Europe", "cyprus": "Europe", "malta": "Europe",
    
    // North America
    "united states": "North America", "canada": "North America", "mexico": "North America", "cuba": "North America",
    "jamaica": "North America", "haiti": "North America", "dominican republic": "North America", "guatemala": "North America",
    "honduras": "North America", "el salvador": "North America", "nicaragua": "North America", "costa rica": "North America",
    "panama": "North America", "bahamas": "North America", "barbados": "North America",
    
    // South America
    "brazil": "South America", "argentina": "South America", "colombia": "South America", "peru": "South America",
    "chile": "South America", "ecuador": "South America", "bolivia": "South America", "venezuela": "South America",
    "paraguay": "South America", "uruguay": "South America", "guyana": "South America", "suriname": "South America",
    
    // Africa
    "egypt": "Africa", "south africa": "Africa", "nigeria": "Africa", "kenya": "Africa", "morocco": "Africa",
    "algeria": "Africa", "tunisia": "Africa", "libya": "Africa", "sudan": "Africa", "ethiopia": "Africa",
    "uganda": "Africa", "tanzania": "Africa", "ghana": "Africa", "ivory coast": "Africa", "senegal": "Africa",
    "cameroon": "Africa", "angola": "Africa", "zimbabwe": "Africa", "zambia": "Africa", "namibia": "Africa",
    "botswana": "Africa", "madagascar": "Africa", "mauritius": "Africa", "seychelles": "Africa", "rwanda": "Africa",
    
    // Oceania
    "australia": "Oceania", "new zealand": "Oceania", "fiji": "Oceania", "papua new guinea": "Oceania",
    "solomon islands": "Oceania", "vanuatu": "Oceania", "samoa": "Oceania", "tonga": "Oceania",
    
    // Antarctica
    "antarctica": "Antarctica"
};

// Total count of recognized countries per continent
// Inline SVG Violet Marker Pin (Offline compatible)
const violetPinSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#7c3aed"/>
</svg>
`)}`;

const tripMarkerIcon = new L.Icon({
    iconUrl: violetPinSvg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Total count of recognized countries per continent
const continentTotalCountries = {
    "Asia": 49,
    "Europe": 44,
    "Africa": 54,
    "North America": 23,
    "South America": 12,
    "Oceania": 14,
    "Antarctica": 1
};

const TravelTracker = ({ memories = [], trips = [] }) => {
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);

    // Fetch simplified world geojson for country boundaries
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson")
            .then((res) => res.json())
            .then((data) => setGeoJsonData(data))
            .catch((err) => console.error("Error loading world boundaries geojson:", err));
    }, []);

    // 1. Group memories & trips by country to calculate visit statistics
    const countryStats = {};

    memories.forEach((memory) => {
        if (!memory.country) return;
        const countryKey = memory.country.toLowerCase().trim();
        
        // Calculate duration in days
        let durationDays = 1;
        if (memory.startDate && memory.endDate) {
            const start = new Date(memory.startDate);
            const end = new Date(memory.endDate);
            const diffTime = Math.abs(end - start);
            durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        if (!countryStats[countryKey]) {
            countryStats[countryKey] = {
                name: memory.country,
                trips: 0,
                daysSpent: 0,
                lastVisit: new Date(0)
            };
        }

        countryStats[countryKey].trips += 1;
        countryStats[countryKey].daysSpent += durationDays;
        
        const memoryDate = new Date(memory.date);
        if (memoryDate > countryStats[countryKey].lastVisit) {
            countryStats[countryKey].lastVisit = memoryDate;
        }
    });

    trips.forEach((trip) => {
        if (!trip.country) return;
        const countryKey = trip.country.toLowerCase().trim();
        
        // Calculate duration in days
        let durationDays = 1;
        if (trip.startDate && trip.endDate) {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            const diffTime = Math.abs(end - start);
            durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }

        if (!countryStats[countryKey]) {
            countryStats[countryKey] = {
                name: trip.country,
                trips: 0,
                daysSpent: 0,
                lastVisit: new Date(0)
            };
        }

        countryStats[countryKey].trips += 1;
        countryStats[countryKey].daysSpent += durationDays;
        
        const tripDate = trip.startDate ? new Date(trip.startDate) : new Date(trip.updatedAt || trip.createdAt || Date.now());
        if (tripDate > countryStats[countryKey].lastVisit) {
            countryStats[countryKey].lastVisit = tripDate;
        }
    });

    const visitedCountriesList = Object.keys(countryStats);
    const totalVisited = visitedCountriesList.length;

    // 2. Continents Calculations
    const visitedContinentsSet = new Set();
    const continentVisitedCountries = {
        "Asia": new Set(),
        "Europe": new Set(),
        "Africa": new Set(),
        "North America": new Set(),
        "South America": new Set(),
        "Oceania": new Set(),
        "Antarctica": new Set()
    };

    visitedCountriesList.forEach((cKey) => {
        const cName = countryStats[cKey].name.toLowerCase().trim();
        const continent = countryToContinent[cName] || "Asia"; // Fallback to Asia
        visitedContinentsSet.add(continent);
        continentVisitedCountries[continent].add(cKey);
    });

    const totalContinents = visitedContinentsSet.size;

    // Cities count
    const uniqueCities = [
        ...new Set([
            ...memories.map((m) => m.city?.toLowerCase().trim()).filter(Boolean),
            ...trips.map((t) => t.city?.toLowerCase().trim()).filter(Boolean)
        ])
    ];

    // Percentage of world explored
    const exploredPercentage = ((totalVisited / 195) * 100).toFixed(1);

    // Style helper for Leaflet GeoJSON layer
    const getCountryStyle = (feature) => {
        const countryName = feature.properties.name?.toLowerCase().trim();
        const isVisited = visitedCountriesList.some(
            (vCountry) => vCountry === countryName || countryName.includes(vCountry) || vCountry.includes(countryName)
        );

        return {
            fillColor: isVisited ? "#0d9488" : "#cbd5e1", // Teal if visited, light slate gray if not
            weight: 1,
            opacity: 1,
            color: "#ffffff", // White borders
            fillOpacity: isVisited ? 0.75 : 0.4
        };
    };

    // Hover actions for countries GeoJSON
    const onEachCountry = (feature, layer) => {
        const countryName = feature.properties.name;
        const countryKey = countryName?.toLowerCase().trim();
        const stats = countryStats[countryKey] || visitedCountriesList.find(c => countryKey.includes(c) || c.includes(countryKey)) ? countryStats[visitedCountriesList.find(c => countryKey.includes(c) || c.includes(countryKey))] : null;

        layer.on({
            mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                    fillOpacity: 0.9,
                    weight: 1.5,
                    color: "#005B60"
                });
                
                setHoveredCountry({
                    name: countryName,
                    trips: stats ? stats.trips : 0,
                    daysSpent: stats ? stats.daysSpent : 0,
                    lastVisit: stats && stats.lastVisit.getTime() > 0 ? stats.lastVisit.toLocaleDateString() : "N/A"
                });
            },
            mouseout: (e) => {
                const target = e.target;
                target.setStyle(getCountryStyle(feature));
                setHoveredCountry(null);
            }
        });
    };

    return (
        <div style={{ marginTop: "2rem" }}>
            
            {/* Headers */}
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.25rem" }}>
                Your World Exploration
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Relive your journeys and track how much of the world you have explored.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem", alignItems: "start" }}>
                
                {/* Left Side: Leaflet Interactive Map */}
                <div className="glass-panel" style={{ 
                    padding: "1rem", 
                    borderRadius: "16px", 
                    background: "#ffffff", 
                    border: "1px solid #e2e8f0",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    
                    {/* Hover country info overlay */}
                    {hoveredCountry && (
                        <div style={{
                            position: "absolute",
                            top: "1.5rem",
                            left: "1.5rem",
                            background: "rgba(15, 23, 42, 0.9)",
                            backdropFilter: "blur(6px)",
                            color: "white",
                            padding: "0.8rem 1.2rem",
                            borderRadius: "10px",
                            zIndex: 1000,
                            pointerEvents: "none",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                            fontSize: "0.85rem",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}>
                            <h4 style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.4rem", color: "#2dd4bf" }}>
                                {hoveredCountry.name}
                            </h4>
                            <div>✈️ Trips: {hoveredCountry.trips}</div>
                            <div>🗓️ Days Spent: {hoveredCountry.daysSpent}</div>
                            <div>🌍 Last Visited: {hoveredCountry.lastVisit}</div>
                        </div>
                    )}

                    {/* Leaflet Map */}
                    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                        <MapContainer 
                            center={[20, 0]} 
                            zoom={2} 
                            minZoom={2}
                            maxBounds={[[-90, -180], [90, 180]]}
                            maxBoundsViscosity={1.0}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                noWrap={true}
                            />
                            
                            {/* GeoJSON Country Boundaries */}
                            {geoJsonData && (
                                <GeoJSON 
                                    data={geoJsonData} 
                                    style={getCountryStyle}
                                    onEachFeature={onEachCountry}
                                />
                            )}

                            {/* Trip Location Markers */}
                            {memories.map((memory) => {
                                const lat = Number(memory.latitude);
                                const lng = Number(memory.longitude);
                                if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

                                return (
                                    <Marker 
                                        key={memory._id} 
                                        position={[lat, lng]} 
                                        icon={customMarkerIcon}
                                    >
                                        <Popup>
                                            <div style={{ width: "200px", fontSize: "0.85rem" }}>
                                                {memory.image && (
                                                    <img 
                                                        src={`http://127.0.0.1:5000${memory.image}`} 
                                                        alt={memory.title}
                                                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", marginBottom: "0.5rem" }}
                                                    />
                                                )}
                                                <h4 style={{ fontWeight: "700", marginBottom: "0.25rem" }}>{memory.title}</h4>
                                                <div style={{ color: "#64748b", marginBottom: "0.25rem" }}>
                                                    📍 {memory.city}, {memory.country}
                                                </div>
                                                <div style={{ color: "#64748b", marginBottom: "0.5rem" }}>
                                                    🗓️ {new Date(memory.date).toLocaleDateString()}
                                                </div>
                                                <Link 
                                                    to="/memories" 
                                                    style={{ 
                                                        display: "block", 
                                                        textAlign: "center", 
                                                        background: "#005B60", 
                                                        color: "white", 
                                                        padding: "0.35rem 0.5rem", 
                                                        borderRadius: "4px", 
                                                        fontWeight: "600",
                                                        fontSize: "0.8rem"
                                                    }}
                                                >
                                                    View Memory
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}

                            {/* Trip Location Markers (Violet Color Pin) */}
                            {trips.map((trip) => {
                                const lat = Number(trip.latitude);
                                const lng = Number(trip.longitude);
                                if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return null;

                                return (
                                    <Marker 
                                        key={trip._id} 
                                        position={[lat, lng]} 
                                        icon={tripMarkerIcon}
                                    >
                                        <Popup>
                                            <div style={{ width: "200px", fontSize: "0.85rem" }}>
                                                {trip.image && (
                                                    <img 
                                                        src={`http://127.0.0.1:5000${trip.image}`} 
                                                        alt={trip.title}
                                                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "6px", marginBottom: "0.5rem" }}
                                                    />
                                                )}
                                                <h4 style={{ fontWeight: "700", marginBottom: "0.25rem" }}>{trip.title}</h4>
                                                <div style={{ color: "#64748b", marginBottom: "0.25rem" }}>
                                                    📍 {trip.destination}
                                                </div>
                                                <div style={{ color: "#64748b", marginBottom: "0.5rem" }}>
                                                    🗓️ {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : ""}
                                                </div>
                                                <Link 
                                                    to="/trips" 
                                                    style={{ 
                                                        display: "block", 
                                                        textAlign: "center", 
                                                        background: "#4f46e5", 
                                                        color: "white", 
                                                        padding: "0.35rem 0.5rem", 
                                                        borderRadius: "4px", 
                                                        fontWeight: "600",
                                                        fontSize: "0.8rem"
                                                    }}
                                                >
                                                    View Trip Details
                                                </Link>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>

                </div>

                {/* Right Side: Travel Stats & Progress Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    
                    {/* Travel Stats Panel */}
                    <div className="glass-panel" style={{ 
                        padding: "1.8rem", 
                        borderRadius: "16px", 
                        background: "#ffffff", 
                        border: "1px solid #e2e8f0" 
                    }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.2rem", color: "#0f172a" }}>
                            Travel Statistics
                        </h3>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>🌍 Countries Visited</span>
                                <span style={{ fontWeight: "700", color: "#0f172a" }}>{totalVisited} / 195</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>🌎 World Explored</span>
                                <span style={{ fontWeight: "700", color: "#7c3aed" }}>{exploredPercentage}%</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>🗺️ Continents Explored</span>
                                <span style={{ fontWeight: "700", color: "#0f172a" }}>{totalContinents} / 7</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>📍 Cities Visited</span>
                                <span style={{ fontWeight: "700", color: "#0f172a" }}>{uniqueCities.length}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>✈️ Total Trips</span>
                                <span style={{ fontWeight: "700", color: "#0f172a" }}>{memories.length + trips.length}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                                <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>📸 Memories Created</span>
                                <span style={{ fontWeight: "700", color: "#0f172a" }}>{memories.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Exploration Progress Panel */}
                    <div className="glass-panel" style={{ 
                        padding: "1.8rem", 
                        borderRadius: "16px", 
                        background: "#ffffff", 
                        border: "1px solid #e2e8f0" 
                    }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1.2rem", color: "#0f172a" }}>
                            Exploration Progress
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {Object.keys(continentTotalCountries).map((continent) => {
                                const visitedSet = continentVisitedCountries[continent] || new Set();
                                const visitedCount = visitedSet.size;
                                const totalCount = continentTotalCountries[continent];
                                const percentage = Math.round((visitedCount / totalCount) * 100);

                                return (
                                    <div key={continent} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", color: "#475569" }}>
                                            <span>{continent}</span>
                                            <span>{percentage}%</span>
                                        </div>
                                        <div style={{ width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                                            <div style={{ 
                                                width: `${percentage}%`, 
                                                height: "100%", 
                                                background: "linear-gradient(135deg, #005B60, #7c3aed)", 
                                                borderRadius: "4px" 
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default TravelTracker;
