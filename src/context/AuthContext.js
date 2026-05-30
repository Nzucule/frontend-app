import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Carrega usuário do localStorage quando o app inicia
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    setUser(res.data.user);
  })
  .catch(() => {
    localStorage.clear();
    setUser(null);
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
  localStorage.clear();
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
