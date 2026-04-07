import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Vérification locale du mot de passe
        if (formData.password !== formData.confirmPassword) {
            setError("The ciphers do not match, My Lord.");
            return;
        }

        try {
            const response = await fetch('/api/v1/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Inscription réussie ! On redirige vers le login
                navigate('/login', { state: { message: "Your application has been accepted. Please sign in." } });
            } else {
                setError(data.Error || "An error occurred during your registration.");
            }
        } catch (err) {
            setError("The server is not responding to our couriers.");
        }
    };

    return (
        <div className="login-page"> {/* On réutilise la classe de la page login pour le fond */}
            <div className="login-container reveal-on-load">
                <header className="login-header">
                    <h1 className="title-luxury">Join the Ton</h1>
                    <p className="subtitle">Register your lineage to access the finest estates.</p>
                </header>

                {error && <p className="error-message-royal">{error}</p>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group-row">
                        <div className="input-with-icon">
                            <i className="fas fa-user"></i>
                            <input type="text" name="first_name" placeholder="First Name" required onChange={handleChange} />
                        </div>
                        <div className="input-with-icon">
                            <i className="fas fa-feather"></i>
                            <input type="text" name="last_name" placeholder="Last Name" required onChange={handleChange} />
                        </div>
                    </div>

                    <div className="input-with-icon">
                        <i className="fas fa-envelope"></i>
                        <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
                    </div>

                    <div className="input-with-icon">
                        <i className="fas fa-lock"></i>
                        <input type="password" name="password" placeholder="Choose a Cipher" required onChange={handleChange} />
                    </div>

                    <div className="input-with-icon">
                        <i className="fas fa-check-double"></i>
                        <input type="password" name="confirmPassword" placeholder="Confirm Cipher" required onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn-gold-full">Apply for Membership</button>
                </form>

                <div className="login-footer">
                    <p>Already a member? <Link href="/login">Return to Login</Link></p>
                </div>
            </div>
        </div>
    );
}