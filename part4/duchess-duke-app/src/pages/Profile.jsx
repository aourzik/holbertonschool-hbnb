import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

export default function Profile() {
    const { user } = useAuth();

    // Simulation de données (sera remplacé par Flask plus tard)
    const myReservations = [
        {
            id: 101,
            estate: "Bridgerton House",
            date: "May 12, 1813",
            status: "Completed",
            image: "/images/manor1.jpg"
        },
        {
            id: 102,
            estate: "Featherington Garden",
            date: "June 20, 1813",
            status: "Upcoming",
            image: "/images/manor2.jpg"
        }
    ];

    const myReviews = [
        { id: 1, estate: "Clyvedon Castle", rating: 5, text: "A truly marvelous stay. The staff was impeccable.", date: "April 1813" }
    ];

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedEstate, setSelectedEstate] = useState(null);

    const handleOpenReview = (estateName) => {
        setSelectedEstate(estateName);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = (reviewData) => {
        console.log("Nouvelle review :", reviewData);
        alert("Your review has been published!");
        // Ici, plus tard, on fera un fetch vers Flask
    };

    return (
        <><div className="profile-wrapper reveal-on-load">
            {/* SIDEBAR : Infos de l'utilisateur */}
            <aside className="profile-sidebar">
                <div className="profile-avatar-container">
                    <img
                        src={user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name + "&background=C5A87A&color=fff"}
                        alt="Profile"
                        className="profile-avatar" />
                    <div className="role-badge">{user?.role || "Member of the Ton"}</div>
                </div>
                <h1 className="profile-name">{user?.name || "My Lord"}</h1>
                <p className="profile-email">{user?.email}</p>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-value">{myReservations.length}</span>
                        <span className="stat-label">Stays</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{myReviews.length}</span>
                        <span className="stat-label">Reviews</span>
                    </div>
                </div>
            </aside>

            {/* CONTENU PRINCIPAL : Séjours et Commentaires */}
            <main className="profile-content">

                {/* Section Séjours */}
                <section className="profile-section">
                    <h2 className="section-title">Your Estate Engagements</h2>
                    <div className="reservations-grid">
                        {myReservations.map(res => (
                            <div key={res.id} className="res-card">
                                <div className="res-image" style={{ backgroundImage: `url(${res.image})` }}></div>
                                <div className="res-details">
                                    <div className="res-header">
                                        <span className={`status-badge ${res.status.toLowerCase()}`}>{res.status}</span>
                                        <p className="res-date"><i className="far fa-calendar"></i> {res.date}</p>
                                    </div>
                                    <h3>{res.estate}</h3>
                                    {res.status === "Completed" && (
                                        <button
                                            className="btn-review-action"
                                            onClick={() => handleOpenReview(res.estate)}
                                        >
                                            <i className="fas fa-pen-nib"></i> Write a Memoir
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section Commentaires */}
                <section className="profile-section">
                    <h2 className="section-title">Your Published Memoirs</h2>
                    <div className="reviews-history">
                        {myReviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className="review-header">
                                    <strong>{review.estate}</strong>
                                    <div className="stars">{"★".repeat(review.rating)}</div>
                                </div>
                                <p className="review-text">"{review.text}"</p>
                                <span className="review-date">Published on {review.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div><div>
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    estateName={selectedEstate}
                    onSubmit={handleReviewSubmit} />
            </div></>
    );
}