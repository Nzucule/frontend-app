import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useStore } from "../context/StoreContext";

// Importar o logo
import logoApp from "../img/logo.png";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useStore();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Função para ler os dados do usuário do localStorage
  const checarUsuario = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // 1. Checa o usuário quando muda de rota
    checarUsuario();

    // 2. Cria um listener para atualizar na hora quando o login acontecer
    window.addEventListener("storage", checarUsuario);
    window.addEventListener("local-storage-update", checarUsuario);

    return () => {
      window.removeEventListener("storage", checarUsuario);
      window.removeEventListener("local-storage-update", checarUsuario);
    };
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <div className="logo-container">
            <div className="logo-image-frame">
              <img 
                src={logoApp} 
                alt="APP All Pest Protect" 
                className="logo-image"
              />
            </div>
            
            <div className="logo-text">
              <span className="logo-all">ALL</span>
              <span className="logo-pest">PEST</span>
              <span className="logo-protect">PROTECT</span>
            </div>
          </div>
        </Link>

        {/* Links de Navegação Principais */}
        <ul className="navbar-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              Início
            </Link>
          </li>
          <li>
            <Link 
              to="/servicos" 
              className={location.pathname === "/servicos" ? "active" : ""}
            >
              Nossos Serviços
            </Link>
          </li>
          <li>
            <Link 
              to="/artigos" 
              className={location.pathname.startsWith("/artigo") ? "active" : ""}
            >
              Artigos
            </Link>
          </li>
          <li>
            <Link 
              to="/sobre" 
              className={location.pathname === "/sobre" ? "active" : ""}
            >
              Sobre Nós
            </Link>
          </li>
          <li>
            <Link 
              to="/contactos" 
              className={location.pathname === "/contactos" ? "active" : ""}
            >
              Contato
            </Link>
          </li>
        </ul>

        {/* Área de Autenticação / Controle de Acesso */}
        <div className="navbar-auth">
          <Link to="/carrinho" className="btn-cart" aria-label="Carrinho">
            🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <>
              {/* Se for Admin, mostra o botão do Painel Administrativo */}
              {user.role === "admin" ? (
                <Link to="/admin/dashboard" className="btn-dashboard">
                  Painel Admin
                </Link>
              ) : (
                /* Se for Cliente, exibe apenas uma saudação com o nome */
                <span className="user-greeting">Olá, {user.name || "Cliente"}</span>
              )}
              
              <button onClick={handleLogout} className="btn-logout">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Entrar
              </Link>
              <Link to="/register" className="btn-register">
                Registre-se
              </Link>
            </>
          )}
        </div>

        {/* Botão menu mobile */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Menu mobile responsivo */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link to="/servicos" onClick={() => setMenuOpen(false)}>Serviços</Link>
          <Link to="/artigos" onClick={() => setMenuOpen(false)}>Artigos</Link>
          <Link to="/carrinho" onClick={() => setMenuOpen(false)}>Carrinho{cartCount > 0 ? ` (${cartCount})` : ""}</Link>
          <Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre Nós</Link>
          <Link to="/contactos" onClick={() => setMenuOpen(false)}>Contato</Link>
          
          <div className="mobile-menu-auth">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                    Painel Admin
                  </Link>
                ) : (
                  <span className="mobile-user-greeting">Olá, {user.name || "Cliente"}</span>
                )}
                <button 
                  onClick={() => { handleLogout(); setMenuOpen(false); }} 
                  className="mobile-logout"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Registre-se</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}