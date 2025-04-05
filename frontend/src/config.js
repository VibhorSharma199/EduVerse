// API Configuration
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Learn-F";
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";

// Feature flags
export const FEATURES = {
  GAMIFICATION: import.meta.env.VITE_ENABLE_GAMIFICATION === "true",
  CHATBOT: import.meta.env.VITE_ENABLE_CHATBOT === "true",
  FORUM: import.meta.env.VITE_ENABLE_FORUM === "true",
};

// Theme configuration
export const THEME = {
  PRIMARY_COLOR: import.meta.env.VITE_PRIMARY_COLOR || "#1976d2",
  SECONDARY_COLOR: import.meta.env.VITE_SECONDARY_COLOR || "#dc004e",
  BACKGROUND_COLOR: import.meta.env.VITE_BACKGROUND_COLOR || "#f8fafc",
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

// Cache configuration
export const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_ITEMS: 100,
};
