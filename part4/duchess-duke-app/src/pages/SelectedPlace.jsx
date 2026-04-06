import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function SelectedPlace() {
    const { id } = useParams();
    const navigate = useNavigate();

    const images = [
        "/images/estate1.jpg",
        "/images/manoir1.jpg",
        "/images/manoir2.jpg",
        "/images/manoir3.jpg"
    ];

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
                                <span className="price-big">£ 5,000 <small>/ month</small></span>
                            </div>

                            <div className="booking-inputs">
                                <div className="input-group">
                                    <label>Arrival</label>
                                    <input type="date" />
                                </div>
                                <div className="input-group">
                                    <label>Guests</label>
                                    <select>
                                        <option>1 Member of the Ton</option>
                                        <option>2 People</option>
                                    </select>
                                </div>
                            </div>

                            <button className="btn-book-now">Reserve this Estate</button>
                            <p className="booking-note">You won't be charged yet</p>
                        </div>
                    </aside>

                </div> {/* Fin du layout */}
            </div>
        </div>
    );
}