import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import du cerveau global

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirige vers l'accueil après déconnexion
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