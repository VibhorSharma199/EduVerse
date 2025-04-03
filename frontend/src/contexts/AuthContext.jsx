import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAuthError = useCallback((error) => {
    console.error("Auth error:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    setError(errorMessage);
    throw error;
  }, []);

  const initAuth = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null);
        return;
      }
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error("Error initializing auth:", error);
      setUser(null);
      authService.removeToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const userData = await authService.login(email, password);
        setUser(userData);
        return userData;
      } catch (error) {
        return handleAuthError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError]
  );

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        setError(null);
        const newUser = await authService.register(userData);
        setUser(newUser);
        return newUser;
      } catch (error) {
        return handleAuthError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        setError(null);
        const updatedUser = await authService.updateProfile(userData);
        setUser(updatedUser);
        return updatedUser;
      } catch (error) {
        return handleAuthError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError]
  );

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        setLoading(true);
        setError(null);
        const result = await authService.changePassword(
          currentPassword,
          newPassword
        );
        return result;
      } catch (error) {
        return handleAuthError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError]
  );

  const value = {
    user,
    loading,
    error,
    clearError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
