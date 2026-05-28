import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // valida token no backend
        await axios.get("https://backendprincipal-production.up.railway.app/api/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsValid(true);
      } catch (error) {
        // token inválido → limpar tudo
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // enquanto verifica
  if (loading) return <div>Carregando...</div>;

  // se não tem login válido
  if (!token || !user || !isValid) {
    return <Navigate to="/login" />;
  }

  // verificação de role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;