import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, isLoggedIn } = useContext(AuthContext);

    // 1. On crée un état local pour stocker les reviews qu'on va récupérer
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            fetch('/api/v1/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Erreur de récupération");
                    return res.json();
                })
                .then(data => {
                    // --- CRUCIAL : On enregistre les reviews reçues dans notre état ---
                    if (data.reviews) {
                        setUserReviews(data.reviews);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur Profil:", err);
                    setLoading(false);
                });
        }
    }, [isLoggedIn]);

    // 2. Supprime la ligne : const userReviews = user?.reviews || []; 
    // (Elle ne sert plus car on utilise maintenant l'état userReviews défini au dessus)

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
                <h2 className="title-luxury">Access Denied</h2>
                <p>Please sign in to view your ledger.</p>
                <button className="btn-gold-full" onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="selected-place-page">
            <div className="profile-wrapper reveal-on-load">

                {/* --- SIDEBAR GAUCHE (INFOS) --- */}
                <aside className="profile-sidebar">
                    <div className="profile-avatar-container">
                        <img src="/images/violette.jpg" alt="User Avatar" className="profile-avatar" />
                        <span className="role-badge">{user?.role || "Member"}</span>
                    </div>

                    <h2 className="profile-name">{user?.name}</h2>
                    <p className="subtitle" style={{ marginBottom: '10px' }}>{user?.email}</p>

                    <div className="profile-stats">
                        <div>
                            <span className="stat-value">0</span>
                            <span className="stat-label">Bookings</span>
                        </div>
                        <div>
                            {/* On affiche le nombre réel de reviews trouvées */}
                            <span className="stat-value">{userReviews.length}</span>
                            <span className="stat-label">Reviews</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <button className="btn-logout-nav" onClick={handleLogout} style={{ width: '100%' }}>
                            Depart from the Ton
                        </button>
                    </div>
                </aside>

                {/* --- CONTENU DROITE (ACTIVITÉ) --- */}
                <main className="profile-main-content">
                    <h2 className="section-title">Your Royal Ledger</h2>

                    <div className="activity-section">
                        <h3 className="whistledown-quote" style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '20px' }}>
                            Your Latest Gossip & Reviews
                        </h3>

                        <div className="activity-list">
                            {loading ? (
                                <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Loading your royal records...</p>
                            ) : userReviews.length > 0 ? (
                                userReviews.map((rev) => (
                                    <div key={rev.id} className="review-item" style={{ marginBottom: '20px' }}>
                                        <div className="review-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="stars" style={{ color: 'var(--regency-gold)' }}>
                                                {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                            </span>
                                            <strong style={{ color: 'var(--regency-gold)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                                {rev.place_name}
                                            </strong>
                                        </div>
                                        <p className="review-text" style={{ marginTop: '10px', fontStyle: 'italic' }}>
                                            "{rev.text}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                /* Si aucune review n'est trouvée */
                                <div className="review-item" style={{ textAlign: 'center', padding: '20px' }}>
                                    <p className="review-text">
                                        "It appears your social calendar is currently empty, My Lord.
                                        The season is young, and many estates await your presence."
                                    </p>
                                    <cite style={{ display: 'block', textAlign: 'right', marginTop: '10px', color: 'var(--regency-gold)' }}>
                                        — Lady Whistledown
                                    </cite>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '30px', textAlign: 'center' }}>
                            <button className="btn-reserve" onClick={() => navigate('/places')} style={{ width: 'auto', padding: '10px 40px' }}>
                                Browse More Estates
                            </button>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}