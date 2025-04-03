import api from "../services/api";

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await api.post(`/courses/${courseId}/enroll`);
  return response.data;
};

export const getCourseProgress = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/progress`);
  return response.data;
};

export const updateCourseProgress = async (courseId, data) => {
  const response = await api.put(`/courses/${courseId}/progress`, data);
  return response.data;
};
