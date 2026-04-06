import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    // États pour le formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        let userData;

        // PETITE ASTUCE POUR TES TESTS :
        // Si l'email contient "admin", on te connecte en tant qu'administrateur
        if (email.includes("admin")) {
            userData = {
                name: "Grand Steward",
                email: email,
                role: "admin" // <--- C'est la clé !
            };
        } else {
            userData = {
                name: email.split('@')[0],
                email: email,
                role: "user"
            };
        }

        login(userData);
        navigate('/places');
    };

    return (
        <div className="login-page">
            <div className="login-container reveal-on-load">
                <div className="login-header">
                    <h1 className="title-luxury">Sign In to the Ton</h1>
                    <p className="subtitle">Enter your credentials to access the royal registry</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                placeholder="your.name@regency.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <label className="checkbox-container">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn-gold-full">
                        Enter the Estate Registry
                    </button>
                </form>

                <div className="login-footer">
                    <p>Not yet a member? <Link to="/register">Apply for an invitation</Link></p>
                </div>
            </div>
        </div>
    );
}