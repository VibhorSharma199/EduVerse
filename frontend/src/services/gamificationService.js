import api from "./api";

class GamificationService {
  // Get all badges
  async getBadges() {
    try {
      const response = await api.get("/gamification/badges");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all achievements
  async getAchievements() {
    try {
      const response = await api.get("/gamification/achievements");
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check course completion and award badges
  async checkCourseCompletion(courseId) {
    try {
      const response = await api.get(
        `/gamification/badges/check-course/${courseId}`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mark course as completed and check for badges/achievements
  async markCourseCompleted(courseId) {
    try {
      const response = await api.post(
        `/gamification/courses/${courseId}/complete`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data.message || "An error occurred";
      const status = error.response.status;

      // Handle specific error cases
      if (status === 401) {
        // Clear auth token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error(
        "No response received from server. Please check your connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error("Error setting up the request");
    }
  }
}

export default new GamificationService();
