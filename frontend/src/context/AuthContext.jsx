import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const userData = sessionStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'admin' || parsedUser.is_admin === true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      // i change code there  20 August (2-12) FROM claude IN main Laravel e-commerce project setup FOR login page (.data)
      const { token, user: userData } = response.data.data;
      
      sessionStorage.setItem('auth_token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAdmin(userData.role === 'admin' || userData.is_admin === true);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      // i change code there  20 August (2-12) FROM claude IN main Laravel e-commerce project setup FOR login page 
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.errors || error.response?.data?.message || 'Registration failed.' 
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user');
      setUser(null);
      setIsAdmin(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put('/profile', profileData);
      // i change code there  20 August (2-12) FROM claude IN main Laravel e-commerce project setup FOR login page 
      const updatedUser = response.data.data;
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed.' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};