// src/services/api.js
import axios from "axios";

// Création de l'instance Axios
const api = axios.create({
  // baseURL: "http://16.16.253.155:8000/api",
  baseURL: "http://localhost:3000/api",
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // récupère le token depuis localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optionnel : intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalide ou expiré → redirection vers la page login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
