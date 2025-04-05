import axios from "axios";
import { API_URL } from "../config";

class GamificationService {
  // Get all badges
  async getBadges() {
    try {
      const response = await axios.get(`${API_URL}/gamification/badges`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all achievements
  async getAchievements() {
    try {
      const response = await axios.get(`${API_URL}/gamification/achievements`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get leaderboard
  async getLeaderboard(period = "all", limit = 10) {
    try {
      const response = await axios.get(
        `${API_URL}/gamification/leaderboard?period=${period}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user progress
  async getUserProgress() {
    try {
      const response = await axios.get(`${API_URL}/gamification/progress`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check course completion and award badges
  async checkCourseCompletion(courseId) {
    try {
      const response = await axios.post(
        `${API_URL}/gamification/check-completion`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Mark course as completed and check for badges/achievements
  async markCourseCompleted(courseId) {
    try {
      const response = await axios.post(
        `/gamification/courses/${courseId}/complete`
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Award points
  async awardPoints(points, reason) {
    try {
      const response = await axios.post(
        `${API_URL}/gamification/award-points`,
        { points, reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Unlock a badge
  async unlockBadge(badgeId) {
    try {
      const response = await axios.post(
        `${API_URL}/gamification/unlock-badge`,
        { badgeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Unlock an achievement
  async unlockAchievement(achievementId) {
    try {
      const response = await axios.post(
        `${API_URL}/gamification/unlock-achievement`,
        { achievementId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
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
