import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { AuthContext } from '../context/AuthContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SelectedPlace() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- 1. ÉTATS ET CONTEXTE ---
    const [estate, setEstate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    // Utilisation du contexte (Remplace useAuth)
    const { isLoggedIn, login, user } = useContext(AuthContext);

    // --- 2. RÉCUPÉRATION DE LA DONNÉE (Via Proxy) ---
    useEffect(() => {
        const fetchEstateDetails = async () => {
            try {
                // On utilise le proxy /api/v1/
                const response = await fetch(`/api/v1/places/${id}`);
                if (!response.ok) throw new Error("Estate not found");
                const data = await response.json();

                // On adapte le JSON au Front
                setEstate({
                    ...data,
                    name: data.title,
                    price: data.price
                });
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEstateDetails();
    }, [id]);

    // --- 3. LOGIQUE DE CALCUL ---
    const today = new Date().toISOString().split('T')[0];

    const calculateTotal = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const totalDays = calculateTotal();
    const rawPrice = estate ? Number(estate.price) : 0;
    const totalPrice = Math.round(totalDays * (rawPrice / 30));

    const images = [
        "/images/estate1.jpg",
        "/images/manoir1.jpg",
        "/images/manoir2.jpg",
        "/images/manoir3.jpg"
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        const nameFromEmail = emailInput.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        const userData = {
            name: formattedName,
            role: emailInput.includes("admin") ? "Grand Steward" : "Member of the Ton",
            email: emailInput
        };

        login(userData);
        setShowLoginModal(false);
    };

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading Royal Details...</div>;
    if (!estate) return <div className="container" style={{ padding: '100px' }}>Estate not found in archives...</div>;

    return (
        <div className="selected-place-page reveal-on-load">
            <div className="container">
                <button onClick={() => navigate('/places')} className="btn-back">
                    ← Back to the Ton
                </button>

                <header className="place-header-detail">
                    <h1 className="title-luxury">{estate.name}</h1>
                    <p className="location-detail">London, UK • ★ 4.9 (128 reviews)</p>
                </header>

                <div className="carousel-container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }}
                        autoplay={{ delay: 3500 }} loop={true}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img src={img} alt={`View ${index}`} className="carousel-img" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="place-content-layout">
                    <div className="place-main-info">
                        <div className="host-intro">
                            <img src="/images/violette.jpg" alt="Host" className="host-avatar" />
                            <div>
                                <h3>Hosted by {estate.owner?.first_name || "Violet"} {estate.owner?.last_name || "Bridgerton"}</h3>
                                <p className="host-meta">Member of the Ton</p>
                            </div>
                        </div>

                        <hr className="separator" />

                        <div className="description-section">
                            <h3>About this residence</h3>
                            <p>{estate.description}</p>
                        </div>

                        <div className="amenities-section">
                            <h3>What this place offers</h3>
                            <div className="amenities-grid">
                                {estate.amenities?.map(a => (
                                    <div key={a.id} className="amenity-item"><i className="fas fa-check"></i> {a.name}</div>
                                )) || <p>Standard Royal Services</p>}
                            </div>
                        </div>
                    </div>

                    <aside className="booking-sidebar">
                        <div className="booking-card">
                            <div className="booking-header">
                                <span className="price-big">£ {estate.price.toLocaleString()} <small>/ month</small></span>
                            </div>

                            <div className="booking-inputs">
                                <div className="input-group">
                                    <label>Arrival</label>
                                    <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <label>Departure</label>
                                    <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                                </div>
                            </div>

                            {totalDays > 0 && (
                                <div className="price-summary-box">
                                    <div className="price-row">
                                        <span>Total for {totalDays} days</span>
                                        <span>£ {totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {isLoggedIn ? (
                                <button className="btn-book-now" disabled={totalDays <= 0} onClick={() => setShowModal(true)}>
                                    Reserve this Estate
                                </button>
                            ) : (
                                <button className="btn-login-to-book" onClick={() => setShowLoginModal(true)}>
                                    Login to Reserve
                                </button>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* MODALS (Confirmation & Login) */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Reservation Sent</h2>
                        <p>Your request for <strong>{estate.name}</strong> has been received.</p>
                        <button className="btn-gold-full" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {showLoginModal && (
                <div className="modal-overlay">
                    <div className="modal-content login-modal">
                        <button className="close-modal" onClick={() => setShowLoginModal(false)}>&times;</button>
                        <h2 className="title-luxury">Sign in to the Ton</h2>
                        <form className="login-form" onSubmit={handleLogin}>
                            <input type="email" placeholder="Email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                            <input type="password" placeholder="Password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                            <button type="submit" className="btn-gold-full">Sign In</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}