import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        console.log("Current user data:", user);
        setUser(user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      authService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      console.log("Login response:", response);
      const user = response.user || response;
      console.log("Setting user:", user);
      setUser(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const user = await authService.register(userData);
      setUser(user);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: authService.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
