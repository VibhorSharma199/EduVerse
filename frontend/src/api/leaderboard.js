import api from "../services/api";

export const getGlobalLeaderboard = async () => {
  const response = await api.get("/leaderboard/global");
  return response.data;
};

export const getCourseLeaderboard = async (courseId) => {
  const response = await api.get(`/leaderboard/course/${courseId}`);
  return response.data;
};

export const getMonthlyLeaderboard = async () => {
  const response = await api.get("/leaderboard/monthly");
  return response.data;
};
