import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.url, "with config:", config); // Debug log
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error); // Debug log
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log("Received response:", response.data); // Debug log
    return response;
  },
  async (error) => {
    console.error("Response interceptor error:", error); // Debug log
    const originalRequest = error.config;

    // Handle rate limit errors with retries
    if (error.response?.status === 429) {
      if (!originalRequest._retry || originalRequest._retry < MAX_RETRIES) {
        originalRequest._retry = (originalRequest._retry || 0) + 1;

        // Wait for RETRY_DELAY milliseconds before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

        // Log retry attempt
        console.log(
          `Retrying request (attempt ${originalRequest._retry}/${MAX_RETRIES})`
        );

        return api(originalRequest);
      } else {
        console.error("Max retries reached for rate limited request");
        return Promise.reject(
          new Error("Rate limit exceeded. Please try again later.")
        );
      }
    }

    // Handle unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error);
      return Promise.reject(
        new Error("An unexpected error occurred. Please try again later.")
      );
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error(
          "Unable to connect to the server. Please check your internet connection."
        )
      );
    }

    return Promise.reject(error);
  }
);

export default api;
