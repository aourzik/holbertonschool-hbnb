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

    // --- ÉTATS (Dynamic Data) ---
    const [estates, setEstates] = useState([]); // On commence avec un tableau vide
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [maxPrice, setMaxPrice] = useState(10000);

    // --- RÉCUPÉRATION DES DONNÉES DEPUIS L'API ---
    useEffect(() => {
        const fetchEstates = async () => {
            try {
                // TEST : On essaie 'localhost' au lieu de '127.0.0.1' (parfois ça débloque le navigateur)
                const apiUrl = '/api/v1/places/';
                console.log("Appel de l'API sur :", apiUrl);

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Réponse serveur non OK : ${response.status}`);
                }

                const data = await response.json();
                console.log("Données brutes reçues :", data);

                const formattedData = data.map(item => ({
                    ...item,
                    name: item.title || "Sans nom",
                    coordinates: [item.latitude || 51.505, item.longitude || -0.09],
                    price: Number(item.price) || 0,
                    status: "Available",
                    image: "/images/estate1.jpg"
                }));

                setEstates(formattedData);
            } catch (error) {
                console.error("ERREUR DÉTAILLÉE :", error.message);
                // Si ça échoue encore, on vérifie si c'est un problème de réseau
                if (error.message === "Failed to fetch") {
                    console.warn("Le navigateur bloque la requête. Vérifie le CORS dans app/__init__.py");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEstates();
    }, []);

    // --- LOGIQUE DE FILTRE ---
    // --- LOGIQUE DE FILTRE SIMPLIFIÉE ---
    const filteredEstates = estates.filter(estate => {
        const search = searchTerm.toLowerCase().trim();

        // On sécurise : si title ou description sont undefined, on met une chaîne vide
        const nameStr = (estate.name || estate.title || "").toLowerCase();
        const descStr = (estate.description || "").toLowerCase();

        const matchesSearch = nameStr.includes(search) || descStr.includes(search);

        // On désactive temporairement le filtre de prix pour voir si les données arrivent
        // const matchesPrice = estate.price <= maxPrice; 

        return matchesSearch; // On ne retourne que la recherche pour l'instant
    });

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading the Season's finest estates...</div>;
    console.log("Nombre de manoirs chargés :", estates.length);
    console.log("Premier manoir :", estates[0]);
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
                            <span>Search</span>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-item">
                            <span>Max Budget: £ {maxPrice.toLocaleString()}</span>
                            <input
                                type="range"
                                min="1000"
                                max="10000"
                                step="500"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                )}
            </header>

            <div className="main-layout-grid">
                {/* COLONNE GAUCHE (LISTE) */}
                <div className="places-content-wrapper reveal-on-load delay-3">
                    <div className="estates-list-grid">
                        {filteredEstates.length > 0 ? (
                            filteredEstates.map((estate) => (
                                <div key={estate.id} className="estate-card">
                                    <div
                                        className="estate-image-container"
                                        onClick={() => navigate(`/estate/${estate.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={estate.image} alt={estate.name} />
                                        <span className={`status-badge available`}>
                                            Available
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
                                            >
                                                View Details
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
                                        £ {estate.price} / month
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