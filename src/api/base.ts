import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Network error. Please check your connection.");
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data?.success && response.data?.message && !response.config.headers?.["suppress-toast"]) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    if (error.config?.headers?.["suppress-toast"]) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || error.message || "An error occurred";
    
    if (error.response?.status !== 401) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export const suppressToast = (config: Record<string, any> = {}) => ({
  ...config,
  headers: {
    ...(config.headers || {}),
    "suppress-toast": true,
  },
});

export default api;
