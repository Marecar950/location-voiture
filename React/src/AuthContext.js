import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        id: '',
        dateOfBirth: '',
        email: '',
        firstname: '',
        lastname: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try  {
                const decodedToken = jwtDecode(token);
                setIsLoggedIn(true);
                setUserData({
                    id: decodedToken.id,
                    dateOfBirth: decodedToken.dateOfBirth,
                    email: decodedToken.email,
                    firstname: decodedToken.firstname,
                    lastname: decodedToken.lastname
                });
            } catch (error) {
                console.error('Failed to decode token:', error);
                setIsLoggedIn(false);
                setUserData({
                    id: '',
                    dateOfBirth: '',
                    email: '',
                    firstname: '',
                    lastname: '',
                });
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUserData(decodedToken.user);
    }

    const user = (newUserData) => {
        setIsLoggedIn(true);
        setUserData(newUserData);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userData, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);