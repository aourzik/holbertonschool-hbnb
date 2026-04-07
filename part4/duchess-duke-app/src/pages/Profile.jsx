import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, isLoggedIn } = useContext(AuthContext);

    const [userReviews, setUserReviews] = useState([]);
    const [myEstates, setMyEstates] = useState([]); // --- ÉTAT POUR TES MANOIRS ---
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoggedIn) {
            // 1. On récupère les infos de l'utilisateur (pour les reviews)
            fetch('/api/v1/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.reviews) setUserReviews(data.reviews);
                })
                .catch(err => console.error("Erreur Profil:", err));

            // 2. --- NOUVEAU : On récupère tous les manoirs pour filtrer les nôtres ---
            fetch('/api/v1/places/')
                .then(res => res.json())
                .then(allPlaces => {
                    const owned = allPlaces.filter(p => p.owner.id === user.id);
                    setMyEstates(owned);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erreur Places:", err);
                    setLoading(false);
                });
        }
    }, [isLoggedIn, user.id]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- 3. FONCTION DE SUPPRESSION ---
    const handleDeleteEstate = async (id, title) => {
        const confirmWithdraw = window.confirm(`Dearest ${user.name}, are you certain you wish to withdraw "${title}" from the Ton's registry? This scandal cannot be undone.`);

        if (confirmWithdraw) {
            try {
                const response = await fetch(`/api/v1/places/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    // On met à jour la liste localement
                    setMyEstates(myEstates.filter(e => e.id !== id));
                    alert("The archives have been updated successfully.");
                }
            } catch (err) {
                alert("The courier failed to deliver the request.");
            }
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
                <h2 className="title-luxury">Access Denied</h2>
                <p>Please sign in to view your ledger.</p>
                <button className="btn-gold-full" onClick={() => navigate('/login')}>Go to Login</button>
            </div>
        );
    }

    return (
        <div className="selected-place-page">
            <div className="profile-wrapper reveal-on-load">

                {/* --- SIDEBAR GAUCHE --- */}
                <aside className="profile-sidebar">
                    <div className="profile-avatar-container">
                        <img src="/images/violette.jpg" alt="User Avatar" className="profile-avatar" />
                        <span className="role-badge">{user?.role || "Member"}</span>
                    </div>
                    <h2 className="profile-name">{user?.name}</h2>
                    <p className="subtitle" style={{ marginBottom: '10px' }}>{user?.email}</p>

                    <div className="profile-actions-luxury">
                        <h3 className="section-title">Manage Your Heritage</h3>
                        <p>Register a residence worthy of the Ton.</p>
                        <Link to="/add-place" className="btn-gold-full add-estate-btn">
                            <i className="fas fa-plus"></i> Register Estate
                        </Link>
                    </div>

                    <div className="profile-stats">
                        <div>
                            <span className="stat-value">{myEstates.length}</span>
                            <span className="stat-label">Estates</span>
                        </div>
                        <div>
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

                {/* --- CONTENU DROITE --- */}
                <main className="profile-main-content">
                    <h2 className="section-title">Your Royal Ledger</h2>

                    {/* --- NOUVELLE SECTION : MES BIENS --- */}
                    <div className="activity-section" style={{ marginBottom: '40px' }}>
                        <h3 className="whistledown-quote" style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '20px' }}>
                            Your Prestigious Properties
                        </h3>

                        <div className="my-estates-list">
                            {myEstates.length > 0 ? (
                                myEstates.map(estate => (
                                    <div key={estate.id} className="manage-estate-item">
                                        <div className="manage-estate-info">
                                            <img src={estate.image || "/images/estate1.jpg"} alt="Miniature" />
                                            <div>
                                                <h4>{estate.title}</h4>
                                                <p>£ {estate.price.toLocaleString()} / night</p>
                                            </div>
                                        </div>
                                        <div className="manage-estate-btns">
                                            <button onClick={() => navigate(`/places/${estate.id}`)} className="btn-view-mini">View</button>
                                            <button onClick={() => handleDeleteEstate(estate.id, estate.title)} className="btn-delete-mini">Withdraw</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontStyle: 'italic', color: '#888' }}>You currently own no estates in the registry.</p>
                            )}
                        </div>
                    </div>

                    {/* --- SECTION REVIEWS --- */}
                    <div className="activity-section">
                        <h3 className="whistledown-quote" style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: '20px' }}>
                            Your Latest Gossip & Reviews
                        </h3>
                        <div className="activity-list">
                            {userReviews.length > 0 ? (
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
                                <p style={{ fontStyle: 'italic', color: '#888' }}>No social gossip recorded yet.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}