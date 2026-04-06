import React, { useState, useContext } from 'react'; // 1. On ajoute useContext
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 2. On importe AuthContext (avec accolades)

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 3. On utilise useContext(AuthContext) à la place de useAuth()
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();

                // On stocke le token JWT
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                }

                // On met à jour le contexte avec les infos de l'user
                login(data.user);
                navigate('/places');
            } else {
                alert("The Royal Guards have rejected your credentials.");
            }
        } catch (error) {
            console.error("Login connection error:", error);
        }
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