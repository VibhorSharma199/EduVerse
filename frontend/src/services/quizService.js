import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

const quizService = {
  getQuiz: async (id) => {
    const response = await axios.get(`${API_URL}/quizzes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  createQuiz: async (quizData) => {
    const response = await axios.post(`${API_URL}/quizzes`, quizData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  updateQuiz: async (id, quizData) => {
    const response = await axios.patch(`${API_URL}/quizzes/${id}`, quizData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await axios.delete(`${API_URL}/quizzes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  submitQuiz: async (id, answers) => {
    const response = await axios.post(
      `${API_URL}/quizzes/${id}/submit`,
      { answers },
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  },

  getQuizResults: async (id) => {
    const response = await axios.get(`${API_URL}/quizzes/${id}/results`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default quizService;
