import axios from "axios";

const defaultHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${defaultHost}:8000/api/v1`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("nritya_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
