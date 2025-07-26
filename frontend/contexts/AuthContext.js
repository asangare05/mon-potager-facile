// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les informations utilisateur
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.get('/auth/user');
      setUser(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement utilisateur:', err);
      localStorage.removeItem('token');
      setUser(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || 'Erreur de connexion'
      };
    }
  };

  // Fonction d'inscription
  const register = async (email, password) => {
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || 'Erreur lors de l\'inscription'
      };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};