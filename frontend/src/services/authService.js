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
        const userData = response.data.data;

        // Include badges and achievements in the user data
        if (userData.badges) {
          userData.badges = userData.badges.map((badge) => ({
            _id: badge._id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
          }));
        }
        if (userData.achievements) {
          userData.achievements = userData.achievements.map((achievement) => ({
            _id: achievement._id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
          }));
        }

        return userData;
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
      return new Error(error.response.data.message || "Authentication failed");
    }
    return new Error(error.message || "An unexpected error occurred");
  }
}

export default new AuthService();
