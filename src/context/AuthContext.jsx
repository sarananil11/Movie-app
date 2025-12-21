import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('movie_app_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Simulate API call
        const mockUser = { ...userData, token: 'mock-jwt-token-' + Date.now() };
        localStorage.setItem('movie_app_user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    const register = (userData) => {
        // Simulate registration
        const mockUser = { ...userData, token: 'mock-jwt-token-' + Date.now() };
        localStorage.setItem('movie_app_user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    const logout = () => {
        localStorage.removeItem('movie_app_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
