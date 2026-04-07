import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddPlace() {
    const navigate = useNavigate();
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        latitude: '',
        longitude: '',
        selectedAmenities: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/v1/amenities/')
            .then(res => res.json())
            .then(data => setAmenitiesList(data))
            .catch(err => console.error("Error loading amenities", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Gestion des fichiers ---
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Générer des URLs temporaires pour l'affichage (previews)
        const previews = files.map(file => URL.createObjectURL(file));
        setFilePreviews(previews);
    };

    const clearFiles = () => {
        setSelectedFiles([]);
        setFilePreviews([]);
    };

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

        try {
            let uploadedUrls = [];

            // --- ÉTAPE 1 : Upload des images si présentes ---
            if (selectedFiles.length > 0) {
                const imgFormData = new FormData();
                selectedFiles.forEach(file => {
                    imgFormData.append('images', file);
                });

                const imgResponse = await fetch('/api/v1/places/upload-images', {
                    method: 'POST',
                    // Note : Pas de header Content-Type ici, le navigateur s'en occupe pour FormData
                    body: imgFormData
                });

                if (!imgResponse.ok) throw new Error("Failed to upload images");
                const imgData = await imgResponse.json();
                uploadedUrls = imgData.urls; // On récupère les URLs générées par Flask
            }

            // --- ÉTAPE 2 : Envoi du manoir avec les URLs d'images ---
            const payload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                amenities: formData.selectedAmenities,
                images: uploadedUrls // On envoie les chemins /images/uploads/...
            };

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
                navigate(`/estate/${data.id}`); // Redirection vers ton manoir
            } else {
                const errData = await response.json();
                setError(errData.Error || "Failed to register estate");
            }
        } catch (err) {
            setError(err.message || "The courier could not reach the server.");
        } finally {
            setLoading(false);
            filePreviews.forEach(url => URL.revokeObjectURL(url));
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

                    {/* --- NOUVELLE SECTION : IMAGES --- */}
                    <section className="form-section file-upload-section">
                        <h3>Gallery & Portraits</h3>
                        <div className="file-upload-wrapper">
                            {/* Le vrai bouton, caché visuellement mais cliquable */}
                            <input
                                type="file" id="estateImages"
                                multiple accept="image/*"
                                onChange={handleFileChange}
                                className="input-file-hidden"
                            />
                            {/* Notre bouton stylisé "Bridgerton" qui déclenche le vrai input */}
                            <label htmlFor="estateImages" className="btn-royal-upload">
                                <i className="fas fa-feather-alt"></i>
                                {selectedFiles.length > 0 ? "Change Portraits" : "Select Portraits"}
                            </label>

                            {selectedFiles.length > 0 && (
                                <button type="button" onClick={clearFiles} className="btn-clear-files">
                                    <i className="fas fa-times"></i> Clear Selection
                                </button>
                            )}

                            <p className="file-hint">Select the most exquisite portraits of your halls (multi-selection allowed).</p>

                            {/* Zone de prévisualisation (Previews) */}
                            {filePreviews.length > 0 && (
                                <div className="file-previews-grid">
                                    {filePreviews.map((url, index) => (
                                        <div key={index} className="preview-item">
                                            <img src={url} alt={`Preview ${index}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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