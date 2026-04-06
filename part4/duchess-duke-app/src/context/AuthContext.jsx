import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Création du contexte (la boîte vide)
const AuthContext = createContext();

// 2. Le Provider (le diffuseur de données)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // null = déconnecté, {name: "..."} = connecté
    const [loading, setLoading] = useState(true);

    // Au chargement, on vérifie si l'utilisateur était déjà connecté (localStorage)
    useEffect(() => {
        const savedUser = localStorage.getItem('regency_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Fonction pour se connecter
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('regency_user', JSON.stringify(userData));
    };

    // Fonction pour se déconnecter
    const logout = () => {
        setUser(null);
        localStorage.removeItem('regency_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Le Hook personnalisé pour utiliser l'auth facilement
export const useAuth = () => useContext(AuthContext);