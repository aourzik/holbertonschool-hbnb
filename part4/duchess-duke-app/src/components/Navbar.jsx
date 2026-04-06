import { Link } from 'react-router-dom';

export default function Navbar() {
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
                    <li><Link to="/connect" className="btn-connect">Connect</Link></li>
                </ul>
            </nav>
        </header>
    );
}