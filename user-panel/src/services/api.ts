import axios, { AxiosError } from "axios";

export interface ApiError {
  error?: string;
  message?: string;
}

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cookie'leri otomatik gönder
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Helper function to extract error message
export const getErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      defaultMessage
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
