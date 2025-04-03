import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const moduleService = {
  getModule: async (id) => {
    const response = await axios.get(`${API_URL}/modules/${id}`);
    return response.data;
  },

  createModule: async (moduleData) => {
    const response = await axios.post(`${API_URL}/modules`, moduleData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateModule: async (id, moduleData) => {
    const response = await axios.patch(`${API_URL}/modules/${id}`, moduleData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteModule: async (id) => {
    const response = await axios.delete(`${API_URL}/modules/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  addLecture: async (moduleId, lectureData) => {
    const response = await axios.post(
      `${API_URL}/modules/${moduleId}/lectures`,
      lectureData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  updateLecture: async (moduleId, lectureId, lectureData) => {
    const response = await axios.patch(
      `${API_URL}/modules/${moduleId}/lectures/${lectureId}`,
      lectureData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  deleteLecture: async (moduleId, lectureId) => {
    const response = await axios.delete(
      `${API_URL}/modules/${moduleId}/lectures/${lectureId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  updateProgress: async (moduleId, progressData) => {
    const response = await axios.post(
      `${API_URL}/modules/${moduleId}/progress`,
      progressData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },
};

export default moduleService;
