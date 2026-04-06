import React, { useState, useContext } from 'react'; // 1. On ajoute useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 2. On importe AuthContext (avec accolades)

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 3. On utilise useContext(AuthContext) à la place de useAuth()
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulation de connexion (à remplacer plus tard par un appel API /auth/login)
        const nameFromEmail = email.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

        const userData = {
            name: formattedName,
            email: email,
            role: email.includes("admin") ? "Grand Steward" : "Member of the Ton"
        };

        login(userData);
        navigate('/places'); // Redirection vers les manoirs après connexion
    };

    return (
        <div className="login-page">
            <div className="login-card reveal-on-load">
                <h2 className="title-luxury">Enter the Ton</h2>
                <p className="subtitle">Sign in to your royal account</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="lady.whistledown@ton.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-gold-full">Sign In</button>
                </form>
            </div>
        </div>
    );
}