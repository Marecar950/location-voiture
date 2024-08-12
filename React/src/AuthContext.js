import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedUser, setIsLoggedUser] = useState(false);
    const [isLoggedAdmin, setIsLoggedAdmin] = useState(false);

    const [userData, setUserData] = useState({
        id: '',
        civility: '',
        lastname: '',
        firstname: '',
        dateOfBirth: '',
        email: '',        
        roles: []
    });
    const [adminData, setAdminData] = useState({
        email: '',
        roles: [],
    }) 

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');

        if (userToken) {
            try  {
                const decodedToken = jwtDecode(userToken);
                setIsLoggedUser(true);
                setUserData({
                    id: decodedToken.id,
                    civility: decodedToken.civility,
                    lastname: decodedToken.lastname,
                    firstname: decodedToken.firstname,
                    dateOfBirth: decodedToken.dateOfBirth,
                    email: decodedToken.email,
                    roles: decodedToken.roles
                });
            } catch (error) {
                console.error('Failed to decode token:', error);
                setIsLoggedUser(false);
                setUserData({
                    id: '',
                    civility: '',
                    lastname: '',
                    firstname: '',
                    dateOfBirth: '',
                    email: '',
                    roles: []
                });
            }
        }

        if (adminToken) {
            const decodedToken = jwtDecode(adminToken);
            setIsLoggedAdmin(true);
            setAdminData({
                email: decodedToken.username,
                roles: decodedToken.roles
            })
        }
        setLoading(false);
    }, []);

    const loginUser = (token) => {
        localStorage.setItem('userToken', token);
        setIsLoggedUser(true);
    }

    const loginAdmin = (token) => {
        localStorage.setItem('adminToken', token);
        setIsLoggedAdmin(true);
    }

    const user = (newUserData) => {
        setIsLoggedUser(true);
        setUserData(newUserData);
    }

    const admin = (newAdminData) => {
        setIsLoggedAdmin(true);
        setAdminData(newAdminData);
    }

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        setIsLoggedUser(false);
        setIsLoggedAdmin(false)
    };

    return (
        <AuthContext.Provider value={{ isLoggedUser, isLoggedAdmin, userData, adminData, user, admin, loginUser, loginAdmin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);