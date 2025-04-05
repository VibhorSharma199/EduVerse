import api from "./api";

class CourseService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  async getAllCourses(params = {}) {
    try {
      console.log("Making API request to /courses with params:", params);
      const response = await api.get("/courses", { params });
      console.log("API response:", response.data);

      if (!response.data) {
        console.error("Invalid API response:", response);
        throw new Error("Invalid response from server");
      }

      return response.data;
    } catch (error) {
      console.error("Error in getAllCourses:", error);
      throw this.handleError(error);
    }
  }

  async getFeaturedCourses() {
    try {
      const cachedData = this.getCache("featured-courses");
      if (cachedData) return cachedData;

      const response = await api.get("/courses", {
        params: { featured: true },
      });
      const data = response.data?.data || [];
      console.log("Featured courses response:", response.data); // Debug log
      this.setCache("featured-courses", data);
      return data;
    } catch (error) {
      console.error("Error in getFeaturedCourses:", error); // Debug log
      throw this.handleError(error);
    }
  }

  async getCourse(id) {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCourse(courseData) {
    try {
      const response = await api.post("/courses", courseData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCourse(id, courseData) {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCourse(id) {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async enrollCourse(id) {
    try {
      const response = await api.post(`/courses/${id}/enroll`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMentorCourses() {
    try {
      const response = await api.get("/courses/mentor");
      return response.data;
    } catch (error) {
      console.error("Error fetching mentor courses:", error);
      throw this.handleError(error);
    }
  }

  async rateCourse(id, rating, review) {
    try {
      const response = await api.post(`/courses/${id}/rate`, {
        rating,
        review,
      });
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseProgress(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/progress`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCourseProgress(courseId, lessonId, completed) {
    try {
      const response = await api.put(`/courses/${courseId}/progress`, {
        lessonId,
        completed,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  clearCache() {
    this.cache.clear();
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

export default new CourseService();
