import axios from "axios";

const api = axios.create({
  // baseURL: "https://site-app-production.up.railway.app/api", // URL de Produção (comentado por enquanto)
  baseURL: "https://apppest-backend-1.onrender.com/api",                       // URL do teu Laravel Local
});

// Adiciona o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;