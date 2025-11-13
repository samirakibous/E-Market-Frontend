import axios from "axios";

// Création de l'instance Axios
const api = axios.create({
  // baseURL: "http://16.16.253.155:8000/api",
  baseURL: "http://localhost:3000/api",
});

//ajouter automatiquement le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;
