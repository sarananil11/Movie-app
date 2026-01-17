import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// wrapping app
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



    const login = async (userData) => {
        try {
            const response = await fetch(`http://localhost:5000/users?email=${userData.email}&password=${userData.password}`);
            const users = await response.json();

            if (users.length > 0) {
                // fake jason web token
                const userWithToken = { ...users[0], token: 'mock-jwt-token-' + Date.now() };
                localStorage.setItem('movie_app_user', JSON.stringify(userWithToken)); // local storage
                setUser(userWithToken);
                return { success: true };
            } else {
                return { success: false, message: 'Invalid email or password' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server error' };
        }
    };



    const register = async (userData) => {
        try {
            // Check if user already exists
            const checkRes = await fetch(`http://localhost:5000/users?email=${userData.email}`);
            const existingUsers = await checkRes.json();

            if (existingUsers.length > 0) {
                return { success: false, message: 'Email already registered' };
            }

            // data to db
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            // auto log after reg
            const newUser = await response.json();
            const userWithToken = { ...newUser, token: 'mock-jwt-token-' + Date.now() };
            localStorage.setItem('movie_app_user', JSON.stringify(userWithToken));
            setUser(userWithToken);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Server error' };
        }
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
