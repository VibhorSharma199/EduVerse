import axios from "axios";
import { API_URL } from "../config/api";

const dashboardService = {
  getDashboardData: async () => {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response;
  },
};

export default dashboardService;
