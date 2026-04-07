import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddPlace() {
    const navigate = useNavigate();
    const [amenitiesList, setAmenitiesList] = useState([]); // Liste venant du serveur
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        latitude: '',
        longitude: '',
        selectedAmenities: [] // IDs des cases cochées
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- 1. Charger les Amenities disponibles au montage ---
    useEffect(() => {
        fetch('/api/v1/amenities/')
            .then(res => res.json())
            .then(data => setAmenitiesList(data))
            .catch(err => console.error("Error loading amenities", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- 2. Gérer les cases à cocher ---
    const handleAmenityChange = (amenityId) => {
        const updated = formData.selectedAmenities.includes(amenityId)
            ? formData.selectedAmenities.filter(id => id !== amenityId)
            : [...formData.selectedAmenities, amenityId];
        setFormData({ ...formData, selectedAmenities: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            amenities: formData.selectedAmenities
        };

        try {
            const response = await fetch('/api/v1/places/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/places/${data.id}`); // Redirection vers le nouveau manoir !
            } else {
                const errData = await response.json();
                setError(errData.Error || "Failed to register estate");
            }
        } catch (err) {
            setError("The courier could not reach the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-place-page reveal-on-load">
            <div className="container-small">
                <h1 className="title-luxury">Register a New Estate</h1>
                <p className="subtitle">Expand the heritage of the Ton with your prestigious residence.</p>

                {error && <p className="error-message-royal">{error}</p>}

                <form onSubmit={handleSubmit} className="luxury-form">
                    <section className="form-section">
                        <h3>General Details</h3>
                        <input type="text" name="title" placeholder="Estate Name (e.g. Aubrey Hall)" required onChange={handleChange} />
                        <textarea name="description" placeholder="Describe the grandeur of your halls..." required onChange={handleChange} />
                    </section>

                    <section className="form-section">
                        <h3>Pricing & Location</h3>
                        <div className="input-group-row">
                            <input type="number" name="price" placeholder="Price per Night (£)" required onChange={handleChange} />
                            <input type="number" step="any" name="latitude" placeholder="Latitude" required onChange={handleChange} />
                            <input type="number" step="any" name="longitude" placeholder="Longitude" required onChange={handleChange} />
                        </div>
                    </section>

                    <section className="form-section">
                        <h3>Amenities & Features</h3>
                        <div className="amenities-selection-grid">
                            {amenitiesList.map(amenity => (
                                <label key={amenity.id} className="amenity-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedAmenities.includes(amenity.id)}
                                        onChange={() => handleAmenityChange(amenity.id)}
                                    />
                                    <span className="checkmark"></span>
                                    {amenity.name}
                                </label>
                            ))}
                        </div>
                    </section>

                    <button type="submit" className="btn-gold-full" disabled={loading}>
                        {loading ? "Registering..." : "Submit to the Archives"}
                    </button>
                </form>
            </div>
        </div>
    );
}