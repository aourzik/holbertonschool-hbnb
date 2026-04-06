import React, { useState } from 'react';

const ESTATES_DATA = [
    {
        id: 1,
        name: "Bridgerton Manor",
        location: "Mayfair, London",
        price: "5,000",
        image: "/images/estate1.jpg",
        status: "Available",
        coordinates: [51.5113, -0.1473] // Coordonnées GPS
    },
    {
        id: 2,
        name: "Featherington Estate",
        location: "Belgravia, London",
        price: "3,500",
        image: "/images/estate2.jpg",
        status: "Booked",
        coordinates: [51.4975, -0.1504]
    },
    {
        id: 3,
        name: "Danbury House",
        location: "Richmond, London",
        price: "7,200",
        image: "/images/estate3.jpg",
        status: "Available",
        coordinates: [51.4613, -0.3033]
    }
];

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX POUR LES ICONES 
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { useNavigate } from 'react-router-dom';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Places() {

    const navigate = useNavigate();

    const [showFilters, setShowFilters] = useState(false); // Pour afficher/cacher le menu
    const [searchTerm, setSearchTerm] = useState("");
    const [maxPrice, setMaxPrice] = useState(10000);

    //  On filtre les données avant de les envoyer à l'affichage
    const filteredEstates = ESTATES_DATA.filter(estate => {
        // 1. On prépare la recherche
        const search = searchTerm.toLowerCase().trim();
        // 2. On vérifie si la recherche est dans le LIEU ou dans le NOM du manoir
        const matchesSearch =
            estate.location.toLowerCase().includes(search) ||
            estate.name.toLowerCase().includes(search);
        // 3. Le prix
        const priceAsNumber = parseInt(estate.price.toString().replace(/[^0-9]/g, ''));
        const matchesPrice = priceAsNumber <= maxPrice;
        return matchesSearch && matchesPrice;
    });
    return (
        <div className="places-container">
            <header className="places-header">
                <h1 className="title-luxury reveal-on-load delay-1">Our Royal Residences</h1>
                <p className="subtitle reveal-on-load delay-2">Discover the most exquisite estates of the Ton</p>

                <button
                    className="btn-filter-toggle reveal-on-load delay-2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className="fas fa-sliders-h"></i> {showFilters ? "Close Filters" : "Filters"}
                </button>

                {showFilters && (
                    <div className="filters-dropdown">
                        <div className="filter-item">
                            <span>Location</span>
                            <input
                                type="text"
                                placeholder="e.g. Mayfair"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-item">
                            <span>Max Budget: £ {maxPrice}</span>
                            <input
                                type="range"
                                min="2000"
                                max="10000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                )}
            </header>

            {/* --- NOUVEAU PARENT : Il solidarise la liste et la map --- */}
            <div className="main-layout-grid">

                {/* COLONNE GAUCHE (LISTE) */}
                <div className="places-content-wrapper reveal-on-load delay-3">
                    <div className="estates-list-grid">
                        {filteredEstates.map((estate) => (
                            <div key={estate.id} className="estate-card">
                                <div
                                    className="estate-image-container"
                                    onClick={() => navigate(`/estate/${estate.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={estate.image} alt={estate.name} />
                                    <span className={`status-badge ${estate.status.toLowerCase()}`}>
                                        {estate.status}
                                    </span>
                                </div>

                                <div className="estate-content">
                                    <h3>{estate.name}</h3>
                                    <p className="location">{estate.location}</p>
                                    <div className="estate-footer">
                                        <span className="price">£ {estate.price}</span>
                                        <button
                                            className="btn-reserve"
                                            onClick={() => navigate(`/estate/${estate.id}`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLONNE DROITE (MAP) */}
                <aside className="map-sidebar reveal-on-load delay-4">
                    <div className="sticky-map">
                        <MapContainer
                            center={[51.505, -0.14]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            {filteredEstates.map((estate) => (
                                <Marker key={estate.id} position={estate.coordinates}>
                                    <Popup>
                                        <strong>{estate.name}</strong> <br />
                                        {estate.price} £ / month
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </aside>

            </div> {/* Fin de main-layout-grid */}
        </div>
    );
}