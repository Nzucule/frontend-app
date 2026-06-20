import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>APP - All Pest Protect</h3>
          <p>Soluções completas de controlo de pragas e limpeza, garantindo ambientes seguros, limpos e livres de riscos à saúde.</p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/servicos">Serviços</Link></li>
            <li><Link to="/sobre">Sobre Nós</Link></li>
            <li><Link to="/contactos">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Serviços</h4>
          <ul>
            <li>Controlo Integrado de Pragas</li>
            <li>Desratização</li>
            <li>Tratamento de Percevejos</li>
            <li>Controlo de Baratas</li>
            <li>Eliminação de Mosquitos</li>
            <li>Tratamento Preventivo</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contactos</h4>
          <ul>
            <li> Maputo, Moçambique</li>
            <li> +258 82 299 6958</li>
            <li>comercial@appmoz.co.mz</li>
            <li>www.appmoz.co.mz</li>
          </ul>
        </div>
        <div className="footer-redes">
  <h3>Siga-nos</h3>

  <div className="footer-social-links">

    <a
      href="https://facebook.com/allpestprotect/"
      className="footer-social-link facebook"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaFacebookF /> Facebook
    </a>

    <a
      href="https://www.instagram.com/appallpestprotect/"
      className="footer-social-link instagram"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaInstagram /> Instagram
    </a>

    <a
      href="https://wa.me/258873830003"
      className="footer-social-link whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp /> WhatsApp
    </a>

  </div>
</div>
                    
        
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 APP – All Pest Protect, Lda - Todos os direitos reservados</p>
        <p>site feito por ADZ Tecnology</p>
      </div>
    </footer>
  );
}