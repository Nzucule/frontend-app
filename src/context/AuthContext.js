import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário ao iniciar app
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUser(res.data.user);
    })
    .catch(() => {
      localStorage.removeItem("token");
      setUser(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // LOGIN
  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });

    const usuario = res.data.user;
    const token = res.data.token;

    localStorage.setItem("token", token);
    setUser(usuario);

    return usuario;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}