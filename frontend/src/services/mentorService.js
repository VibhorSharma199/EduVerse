import api from "./api";

class MentorService {
  async createCourse(courseData) {
    try {
      const response = await api.post("/courses", courseData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await api.patch(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMentorCourses() {
    try {
      const response = await api.get("/courses/mentor");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addLecture(courseId, lectureData) {
    try {
      const response = await api.post(
        `/courses/${courseId}/lectures`,
        lectureData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateLecture(courseId, lectureId, lectureData) {
    try {
      const response = await api.put(
        `/courses/${courseId}/lectures/${lectureId}`,
        lectureData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteLecture(courseId, lectureId) {
    try {
      const response = await api.delete(
        `/courses/${courseId}/lectures/${lectureId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseEnrollments(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/enrollments`);
      return response.data;
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

  async createModule(moduleData) {
    try {
      const response = await api.post("/modules", moduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateModule(moduleId, moduleData) {
    try {
      const response = await api.patch(`/modules/${moduleId}`, moduleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteModule(moduleId) {
    try {
      const response = await api.delete(`/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getModule(moduleId) {
    try {
      const response = await api.get(`/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data.message || "An error occurred";
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return new Error(message);
    } else if (error.request) {
      return new Error(
        "No response received from server. Please check your connection."
      );
    } else {
      return new Error("Error setting up the request");
    }
  }
}

export default new MentorService();
