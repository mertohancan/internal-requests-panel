import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000",
  withCredentials: true, // Cookie'leri otomatik gönder
});

// Request interceptor - Cookie otomatik gönderilir
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Redirect to login (cookie otomatik silinir)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
