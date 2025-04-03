import api from "./api";

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.status === "success") {
        const { token, user } = response.data;
        this.setToken(token);
        return user;
      }
      throw new Error(response.data.message || "Login failed");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.status === "success") {
        const { token, user } = response.data;
        this.setToken(token);
        return user;
      }
      throw new Error(response.data.message || "Registration failed");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.removeToken();
    }
  }

  async getCurrentUser() {
    try {
      if (!this.getToken()) {
        throw new Error("No authentication token found");
      }
      const response = await api.get("/auth/me");
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to get user data");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(userData) {
    try {
      if (!this.getToken()) {
        throw new Error("No authentication token found");
      }
      const response = await api.put("/auth/profile", userData);
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update profile");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.getToken()) {
        throw new Error("No authentication token found");
      }
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to change password");
    } catch (error) {
      throw this.handleError(error);
    }
  }

  setToken(token) {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      this.removeToken();
    }
  }

  getToken() {
    return localStorage.getItem("token") || null;
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  handleError(error) {
    console.error("Auth service error:", error);

    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 400:
          return new Error(error.response.data.message || "Invalid request");
        case 401:
          this.removeToken();
          return new Error("Session expired. Please log in again.");
        case 403:
          return new Error("You don't have permission to perform this action");
        case 404:
          return new Error("Resource not found");
        case 429:
          return new Error("Too many requests. Please try again later.");
        case 500:
          return new Error("Internal server error. Please try again later.");
        default:
          return new Error(
            error.response.data.message || "Authentication failed"
          );
      }
    }

    if (error.request) {
      return new Error(
        "No response received from server. Please check your internet connection."
      );
    }

    return new Error(error.message || "An unexpected error occurred");
  }
}

export default new AuthService();
