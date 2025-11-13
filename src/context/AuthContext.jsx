import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Charger le profil utilisateur si le token existe
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/profile");
          setUser(res.data.user);
        } catch (err) {
          console.error("Erreur récupération du profil :", err);
          logout(); // token invalide
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log(res.data);
      const { token, user } = res.data.data; 
      localStorage.setItem("token", token);
      setToken(token);

      setUser(user);
    } catch (err) {
      console.error("Erreur login :", err);
      throw err; // remonter l'erreur pour l'afficher dans Login.jsx
    }
  };

 const register = async (formData) => {
  const res = await api.post("/auth/register", formData);
  
  // Récupérer le token et l'user depuis la réponse
  const { token, user } = res.data.data;

  localStorage.setItem("token", token);
  setToken(token);

  setUser(user);

  return res.data;
};


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = () => useContext(AuthContext);
