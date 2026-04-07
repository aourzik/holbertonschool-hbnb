import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// FIX POUR LES ICONES 
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Places() {
    const navigate = useNavigate();

    // --- ÉTATS ---
    const [estates, setEstates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [maxPrice, setMaxPrice] = useState(10000);

    // --- RÉCUPÉRATION DES DONNÉES ---
    useEffect(() => {
        const fetchEstates = async () => {
            try {
                const apiUrl = '/api/v1/places/';
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error(`Erreur: ${response.status}`);

                const data = await response.json();

                const formattedData = data.map(item => ({
                    ...item,
                    name: item.title || "Sans nom",
                    coordinates: [item.latitude || 51.505, item.longitude || -0.09],
                    image: item.image || "/images/estate1.jpg",
                    isAvailable: item.is_available !== undefined ? item.is_available : true,
                    price: Number(item.price) || 0,
                    // ON UTILISE LA DONNÉE RÉELLE DE L'API ICI
                    isAvailable: item.is_available !== undefined ? item.is_available : true,

                }));

                setEstates(formattedData);
            } catch (error) {
                console.error("ERREUR :", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEstates();
    }, []);

    // --- LOGIQUE DE FILTRE ---
    const filteredEstates = estates.filter(estate => {
        const search = searchTerm.toLowerCase().trim();
        const nameStr = (estate.name || "").toLowerCase();
        const descStr = (estate.description || "").toLowerCase();

        const matchesSearch = nameStr.includes(search) || descStr.includes(search);
        const matchesPrice = estate.price <= maxPrice;

        return matchesSearch && matchesPrice;
    });

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading the Season's finest estates...</div>;

    return (
        <div className="places-container">
            <header className="places-header">
                <h1 className="title-luxury reveal-on-load">Our Royal Residences</h1>
                <p className="subtitle reveal-on-load">Discover the most exquisite estates of the Ton</p>

                <button className="btn-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                    <i className="fas fa-sliders-h"></i> {showFilters ? "Close Filters" : "Filters"}
                </button>

                {showFilters && (
                    <div className="filters-dropdown">
                        <div className="filter-item">
                            <span>Search</span>
                            <input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="filter-item">
                            <span>Max Budget: £ {maxPrice.toLocaleString()}</span>
                            <input type="range" min="1000" max="10000" step="500" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
                        </div>
                    </div>
                )}
            </header>

            <div className="main-layout-grid">
                <div className="places-content-wrapper">
                    <div className="estates-list-grid">
                        {filteredEstates.length > 0 ? (
                            filteredEstates.map((estate) => (
                                <div key={estate.id} className={`estate-card ${!estate.isAvailable ? 'booked-style' : ''}`}>
                                    <div
                                        className="estate-image-container"
                                        onClick={() => navigate(`/estate/${estate.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={estate.image} alt={estate.name} style={{ filter: estate.isAvailable ? 'none' : 'grayscale(0.5)' }} />

                                        {/* CHANGEMENT DYNAMIQUE DU BADGE */}
                                        <span className={`status-badge ${estate.isAvailable ? 'available' : 'booked'}`}>
                                            {estate.isAvailable ? "Available" : "Booked"}
                                        </span>
                                    </div>

                                    <div className="estate-content">
                                        <h3>{estate.name}</h3>
                                        <p className="location">London, UK</p>
                                        <div className="estate-footer">
                                            <span className="price">£ {estate.price.toLocaleString()}</span>
                                            <button
                                                className="btn-reserve"
                                                onClick={() => navigate(`/estate/${estate.id}`)}
                                                disabled={!estate.isAvailable} // Optionnel : désactive le bouton si déjà pris
                                            >
                                                {estate.isAvailable ? "View Details" : "Occupied"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No estates found for this criteria.</p>
                        )}
                    </div>
                </div>

                <aside className="map-sidebar">
                    <div className="sticky-map">
                        <MapContainer center={[51.505, -0.14]} zoom={11} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {filteredEstates.map((estate) => (
                                <Marker key={estate.id} position={estate.coordinates}>
                                    <Popup>
                                        <strong>{estate.name}</strong> <br />
                                        Status: {estate.isAvailable ? "Available" : "Booked"}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </aside>
            </div>
        </div>
    );
}