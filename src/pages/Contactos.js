import React, { useState } from "react";
import "../styles/Contactos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ÍCONES CORRETOS
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Contactos() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);

    alert("Mensagem enviada com sucesso! Entraremos em contacto em breve.");

    setFormData({
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: ""
    });
  };

  return (
    <>
      <Navbar />

      {/* BANNER */}
      <div className="contactos-banner">
        <div className="container">
          <h1>Entre em Contacto</h1>
          <p>
            Estamos aqui para ajudar. Fale connosco sobre serviços de controlo
            Integrado de Pragas!
          </p>
        </div>
      </div>

      {/* CONTEÚDO */}
      <section className="contactos-content">
        <div className="container">
          <div className="contactos-grid">

            {/* INFO */}
            <div className="contactos-info">
              <h2>Informações de Contacto</h2>

              <div className="info-item">
                <div className="info-content">
                  <h3>Sede</h3>
                  <p>Av. Maguinguana nº 1742, r/c<br />Maputo – Moçambique</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-content">
                  <h3>Telefones</h3>
                  <p>+258 82 299 6958<br />+258 87 383 0003</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-content">
                  <h3>Email</h3>
                  <p>comercial@appmoz.co.mz<br />maxi4u.offz@gmail.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-content">
                  <h3>Horário</h3>
                  <p>
                    Segunda - Sexta: 7h00 - 17h00<br />
                    Sábado: 7h00 - 13h30<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>

              {/* REDES SOCIAIS */}
              <div
  className="redes-sociais"
  style={{
    display: "block",
    visibility: "visible",
    opacity: 1
  }}
>
                <h3>Siga-nos</h3>

               <div
  className="social-links"
  style={{
    display: "flex",
    visibility: "visible",
    opacity: 1
  }}
>
                  <a
                    href="https://facebook.com/allpestprotect/"
                    className="social-link facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF /> Facebook
                  </a>

                  <a
                    href="https://www.instagram.com/appallpestprotect/"
                    className="social-link instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram /> Instagram
                  </a>

                  <a
                    href="https://wa.me/258873830003"
                    className="social-link whatsapp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>

                </div>
              </div>
            </div>

            {/* FORMULÁRIO */}
            <div className="contactos-form">
              <h2>Envie-nos uma Mensagem</h2>

              <form onSubmit={handleSubmit}>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nome *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Assunto *</label>
                    <select
                      name="assunto"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="orcamento">Orçamento</option>
                      <option value="servico">Serviço</option>
                      <option value="duvida">Dúvida</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mensagem *</label>
                  <textarea
                    name="mensagem"
                    rows="6"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-enviar">
                  Enviar Mensagem
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}