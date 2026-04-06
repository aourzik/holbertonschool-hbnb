import React, { useState, useContext } from 'react'; // Ne pas oublier useState ici !
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const navigate = useNavigate();

    // On récupère les infos de l'utilisateur et la fonction logout depuis le contexte
    const { user, logout, isLoggedIn } = useContext(AuthContext);

    // États pour gérer l'édition (si tu en as besoin)
    const [isEditing, setIsEditing] = useState(false);

    // Sécurité : si l'utilisateur n'est pas connecté, on le renvoie au login
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
        <div className="profile-page reveal-on-load">
            <div className="container">
                <header className="profile-header">
                    <h1 className="title-luxury">Your Royal Ledger</h1>
                    <p className="subtitle">Welcome back, {user?.name}</p>
                </header>

                <div className="profile-grid">
                    {/* Colonne de gauche : Infos utilisateur */}
                    <div className="profile-info-card card-luxury">
                        <div className="profile-avatar-section">
                            <img src="/images/violette.jpg" alt="User Avatar" className="large-avatar" />
                            <h2>{user?.name}</h2>
                            <span className="user-role-badge">{user?.role}</span>
                        </div>

                        <div className="profile-details">
                            <div className="detail-item">
                                <strong>Email</strong>
                                <span>{user?.email}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Status</strong>
                                <span>Member of the Ton</span>
                            </div>
                        </div>

                        <button className="btn-logout-full" onClick={handleLogout}>
                            Depart from the Ton (Logout)
                        </button>
                    </div>

                    {/* Colonne de droite : Historique / Activité */}
                    <div className="profile-activity-card card-luxury">
                        <h3>Recent Transactions & Reservations</h3>
                        <div className="activity-list">
                            <p className="empty-message">No recent movements in your ledger, My Lord.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}