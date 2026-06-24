import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const emailInputRef = useRef(null);

  // Auto-focus no email ao carregar
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    
    // Verificar se há credenciais salvas
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validação básica
    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://backendprincipal-production.up.railway.app/api/login",
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 segundos
        }
      );

      const { token, user } = response.data;

      // Salvar token e user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Salvar email para "lembrar-me"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Redirecionar por perfil
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      
      if (err.code === "ECONNABORTED") {
        setError("Tempo limite excedido. Verifique sua conexão.");
      } else if (err.response) {
        // Erro do servidor
        if (err.response.status === 401) {
          setError("Credenciais inválidas! Verifique seu email e senha.");
        } else if (err.response.status === 500) {
          setError("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          setError(err.response.data?.message || "Erro ao fazer login. Tente novamente.");
        }
      } else if (err.request) {
        setError("Não foi possível conectar ao servidor. Verifique sua internet.");
      } else {
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Orb extra para efeito visual */}
      <div className="orb-extra"></div>

      <div className="login-container">
        <div className="login-header">
          <div className="logo">🛡️</div>
          <h1>
            All <span>Pest Protect</span>
          </h1>
          <p>Sistema de Controlo de Pragas e Desinfestação</p>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <h2>Acesse sua conta</h2>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <span className="form-icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              ref={emailInputRef}
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              required
              disabled={isLoading}
              className={error ? "error" : ""}
              autoComplete="email"
              aria-label="Email"
            />
          </div>

          <div className="form-group">
            <span className="form-icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              required
              disabled={isLoading}
              className={error ? "error" : ""}
              autoComplete="current-password"
              aria-label="Senha"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              tabIndex="-1"
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              Lembrar-me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            aria-label={isLoading ? "Carregando..." : "Entrar no Sistema"}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Entrando...
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </button>

          <div className="login-divider">ou</div>

          <div className="login-footer">
            <p>
              Ainda não tem conta?{" "}
              <Link to="/register" className="create-account-link">
                Criar Conta
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="system-info">
        <span>All Pest Protect</span>
        <span className="version">v2.0</span>
        <span>Sua vida longe de pragas!</span>
      </div>
    </div>
  );
}

export default Login;