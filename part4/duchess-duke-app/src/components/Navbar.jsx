import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 2. On importe 'AuthContext' (avec les accolades) et PAS 'useAuth'
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    // 3. On remplace 'useAuth()' par 'useContext(AuthContext)'
    const { isLoggedIn, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="main-header">
            <nav className="navbar">
                <a href="#home" className="logo-link">
                    <div className="logo">
                        <img src="/images/logo.png" alt="Duchess & Duke Icon" className="logo-icon" />
                        <div className="logo-text">
                            <span className="brand-name">Duchess & Duke</span>
                            <span className="brand-sub">Housing</span>
                        </div>
                    </div>
                </a>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><a href="/#about">About</a></li>
                    <li><Link to="/places">Places</Link></li>
                    <li><a href="/#main-footer">Contact us</a></li>

                    {/* CONDITION D'AFFICHAGE : LOGOUT OU CONNECT */}
                    {isLoggedIn ? (
                        <>
                            <li className="user-welcome">
                                {/* On rend le nom cliquable vers le profil */}
                                <Link to="/profile" className="profile-link">My Ledger, {user?.name}</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="btn-logout-nav">Log Out</button>
                            </li>
                        </>
                    ) : (
                        <li><Link to="/login" className="btn-connect">Connect</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}