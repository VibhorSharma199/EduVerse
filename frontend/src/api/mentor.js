import api from "../services/api";

export const getMentors = async () => {
  const response = await api.get("/mentors");
  return response.data;
};

export const getMentorProfile = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}`);
  return response.data;
};

export const updateMentorProfile = async (data) => {
  const response = await api.put("/mentors/profile", data);
  return response.data;
};

export const getMentorCourses = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}/courses`);
  return response.data;
};

export const getMentorStats = async (mentorId) => {
  const response = await api.get(`/mentors/${mentorId}/stats`);
  return response.data;
};
