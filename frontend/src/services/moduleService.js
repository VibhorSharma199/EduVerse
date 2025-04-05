import api from "./api";

class ModuleService {
  async getModule(courseId, moduleId) {
    try {
      const response = await api.get(`/modules/${moduleId}`);
      return response.data.data; // The backend returns data in a data property
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLecture(courseId, moduleId, lectureId) {
    try {
      // First get the module data
      const moduleData = await this.getModule(courseId, moduleId);

      // Find the lecture in the module
      const lecture = moduleData.lectures?.find((l) => l._id === lectureId);

      if (!lecture) {
        throw new Error("Lecture not found");
      }

      return lecture;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completeLecture(courseId, moduleId, lectureId) {
    try {
      // Use the module progress endpoint
      const response = await api.post(`/modules/${moduleId}/progress`, {
        completedLectures: 1, // Mark one lecture as completed
        lectureId: lectureId,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async completeModule(courseId, moduleId) {
    try {
      // First get the module to know its lectures
      const moduleData = await this.getModule(courseId, moduleId);

      // Mark each lecture as completed
      for (const lecture of moduleData.lectures) {
        if (!lecture.completed && lecture.progress !== 100) {
          await this.completeLecture(courseId, moduleId, lecture._id);
        }
      }

      return moduleData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || "An error occurred");
    }
  }
}

export default new ModuleService();
