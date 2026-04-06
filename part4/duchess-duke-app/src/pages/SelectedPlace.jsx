const ESTATES_DATA = [
    {
        id: 1,
        name: "Bridgerton Manor",
        location: "Mayfair, London",
        price: "5,000",
        image: "/images/estate1.jpg",
        status: "Available",
        coordinates: [51.5113, -0.1473]
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

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useAuth } from '../context/AuthContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SelectedPlace() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- 1. ÉTATS (STATES) ---
    const [checkIn, setCheckIn] = React.useState("");
    const [checkOut, setCheckOut] = React.useState("");

    // --- 2. RÉCUPÉRATION DE LA DONNÉE ---
    const estate = ESTATES_DATA.find(item => item.id === Number(id));

    // --- 3. SÉCURITÉ ---
    if (!estate) {
        return <div className="container" style={{ padding: '100px' }}>Estate not found...</div>;
    }

    // --- 4. LOGIQUE DE CALCUL  ---
    const today = new Date().toISOString().split('T')[0];

    // On transforme "5,000" en nombre 5000
    const rawPrice = Number(estate.price.toString().replace(/[^0-9]/g, ''));

    const calculateTotal = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const totalDays = calculateTotal();
    // Calcul au prorata (prix mensuel / 30 * nombre de jours)
    const totalPrice = Math.round(totalDays * (rawPrice / 30));

    const images = [
        "/images/estate1.jpg",
        "/images/manoir1.jpg",
        "/images/manoir2.jpg",
        "/images/manoir3.jpg"
    ];

    // États pour stocker les dates
    const [arrivalDate, setArrivalDate] = React.useState("");

    // État pour contrôler l'affichage du modal de confirmation
    const [showModal, setShowModal] = useState(false);

    // Récupération de l'état d'authentification et des fonctions de login/logout
    const { isLoggedIn, login } = useAuth();

    // État pour contrôler l'affichage du modal de login (si l'utilisateur n'est pas connecté)
    const [showLoginModal, setShowLoginModal] = useState(false);

    // États pour les inputs du formulaire de login
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        // On extrait le nom à partir de l'email
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

    return (
        <div className="selected-place-page reveal-on-load">
            <div className="container">
                <button onClick={() => navigate('/places')} className="btn-back">
                    ← Back to the Ton
                </button>

                <header className="place-header-detail">
                    <h1 className="title-luxury">The Grand Estate #{id}</h1>
                    <p className="location-detail">Mayfair, London • ★ 4.9 (128 reviews)</p>
                </header>

                {/* --- CARROUSEL --- */}
                <div className="carousel-container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3500 }}
                        loop={true}
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <img src={img} alt={`View ${index}`} className="carousel-img" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* --- LE LAYOUT EN DEUX COLONNES --- */}
                <div className="place-content-layout">

                    {/* COLONNE GAUCHE : INFOS */}
                    <div className="place-main-info">
                        <div className="host-intro">
                            <img src="/images/violette.jpg" alt="Host" className="host-avatar" />
                            <div>
                                <h3>Hosted by Violet Bridgerton</h3>
                                <p className="host-meta">Member of the Ton • Joined 1812</p>
                            </div>
                        </div>

                        <hr className="separator" />

                        <div className="description-section">
                            <h3>About this residence</h3>
                            <p>
                                Welcome to one of Mayfair's most prestigious estates. This residence offers
                                a perfect blend of Regency architectural splendor and modern comfort.
                                With its grand ballroom, private library, and sprawling gardens, it is
                                the ideal setting for the season's most exclusive gatherings.
                            </p>
                        </div>

                        <div className="amenities-section">
                            <h3>What this place offers</h3>
                            <div className="amenities-grid">
                                <div className="amenity-item"><i className="fas fa-leaf"></i> Private Garden</div>
                                <div className="amenity-item"><i className="fas fa-music"></i> Grand Piano</div>
                                <div className="amenity-item"><i className="fas fa-concierge-bell"></i> Butler Service</div>
                                <div className="amenity-item"><i className="fas fa-horse"></i> Stables</div>
                            </div>
                        </div>

                        <hr className="separator" />

                        <div className="reviews-section">
                            <h3><i className="fas fa-star"></i> 4.9 • 128 Reviews</h3>
                            <div className="review-item">
                                <strong>Viscount Anthony</strong>
                                <p>"An impeccable stay. The gardens are divine for morning promenades."</p>
                            </div>
                        </div>
                    </div>

                    {/* COLONNE DROITE : RÉSERVATION */}
                    <aside className="booking-sidebar">
                        <div className="booking-card">
                            <div className="booking-header">
                                <span className="price-big">£ {estate.price} <small>/ month</small></span>
                            </div>

                            <div className="booking-inputs">
                                <div className="input-group">
                                    <label>Arrival</label>
                                    <input
                                        type="date"
                                        min={today}
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Departure</label>
                                    <input
                                        type="date"
                                        min={checkIn || today}
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Guests</label>
                                    <select>
                                        <option>1 Member of the Ton</option>
                                        <option>2 People</option>
                                    </select>
                                </div>
                            </div>

                            {/* AFFICHAGE DYNAMIQUE DU TOTAL */}
                            {totalDays > 0 && (
                                <div className="price-summary-box">
                                    <div className="price-row">
                                        <span>£ {estate.price} / month x {totalDays} days</span>
                                        <span>£ {totalPrice.toLocaleString()}</span>
                                    </div>
                                    <hr className="mini-separator" />
                                    <div className="total-row-display">
                                        <strong>Total</strong>
                                        <strong>£ {totalPrice.toLocaleString()}</strong>
                                    </div>
                                </div>
                            )}

                            {isLoggedIn ? (
                                <button
                                    className="btn-book-now"
                                    disabled={totalDays <= 0}
                                    onClick={() => setShowModal(true)}
                                >
                                    Reserve this Estate
                                </button>
                            ) : (
                                <button className="btn-login-to-book" onClick={() => setShowLoginModal(true)}>
                                    Login to Reserve
                                </button>
                            )}
                            <p className="booking-note">You won't be charged yet</p>
                        </div>
                    </aside>

                </div> {/* Fin du layout */}
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content reveal-on-load">
                        <button className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
                        <div className="modal-header">
                            <i className="fas fa-check-circle success-icon"></i>
                            <h2>Reservation Request Sent</h2>
                        </div>
                        <div className="modal-body">
                            <p>Your request for <strong>{estate.name}</strong> has been received, My Lord.</p>
                            <div className="summary-details">
                                <span><i className="far fa-calendar"></i> {checkIn} to {checkOut}</span>
                                <span><i className="fas fa-coins"></i> Total: £ {totalPrice.toLocaleString()}</span>
                            </div>
                            <p className="note">The Estate Manager will contact you shortly via courier.</p>
                        </div>
                        <button className="btn-gold-full" onClick={() => navigate('/places')}>
                            Return to the Ton
                        </button>
                    </div>
                </div>
            )}
            {showLoginModal && (
                <div className="modal-overlay">
                    <div className="modal-content login-modal reveal-on-load">
                        <button className="close-modal" onClick={() => setShowLoginModal(false)}>&times;</button>

                        <div className="modal-header">
                            <h2 className="title-luxury">Welcome back to the Ton</h2>
                            <p className="subtitle">Sign in to manage your royal estates</p>
                        </div>

                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-envelope"></i>
                                    {/* Champ Email */}
                                    <input
                                        type="email"
                                        placeholder="lady.whistledown@ton.com"
                                        required
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a href="#" className="forgot-pass">Forgot password?</a>
                            </div>

                            <button type="submit" className="btn-gold-full">
                                Sign In
                            </button>
                        </form>

                        <div className="modal-footer">
                            <p>Not a member of the Ton yet? <a href="#">Apply for an invite</a></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}