import React, { useState } from "react";
import "../styles/Contactos.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

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

  // 🔥 ENVIAR MENSAGEM PARA WHATSAPP
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construir a mensagem para o WhatsApp
    const mensagemWhatsApp = `Olá! 👋\n\n` +
      `📌 *Nova mensagem do site APP All Pest Protect*\n\n` +
      `👤 *Nome:* ${formData.nome}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `📞 *Telefone:* ${formData.telefone || "Não informado"}\n` +
      `📋 *Assunto:* ${formData.assunto}\n` +
      `💬 *Mensagem:* ${formData.mensagem}\n\n` +
      `📅 Enviado em: ${new Date().toLocaleString('pt-PT')}`;

    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagemWhatsApp);

    // Número do WhatsApp (já tens o número)
    const numeroWhatsApp = "258873830003";

    // Criar link do WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    // Abrir WhatsApp em nova aba
    window.open(urlWhatsApp, "_blank");

    // Limpar formulário
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
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h3>Sede</h3>
                  <p>Av. Maguinguana nº 1742, r/c<br />Maputo – Moçambique</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-content">
                  <h3>Telefones</h3>
                  <p>
                    <a href="tel:+258822996958">+258 82 299 6958</a><br />
                    <a href="tel:+258873830003">+258 87 383 0003</a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:comercial@appmoz.co.mz">comercial@appmoz.co.mz</a><br />
                    <a href="mailto:maxi4u.offz@gmail.com">maxi4u.offz@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FaClock />
                </div>
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
              <div className="redes-sociais">
                <h3>Siga-nos</h3>
                <div className="social-links">
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
              <p className="form-subtitle">
                Preencha o formulário e enviaremos a sua mensagem diretamente para o nosso WhatsApp
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome *</label>
                    <input
                      type="text"
                      name="nome"
                      placeholder="Seu nome completo"
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
                      placeholder="seu@email.com"
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
                      placeholder="84 123 4567"
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
                    rows="5"
                    placeholder="Escreva a sua mensagem aqui..."
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-enviar">
                  <FaWhatsapp style={{ marginRight: "10px" }} />
                  Enviar via WhatsApp
                </button>

                <p className="form-nota">
                  Ao enviar, será redirecionado para o WhatsApp com a mensagem pré-preenchida.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 🔥 MAPA - ADICIONADO */}
      <section className="mapa-section">
        <div className="container">
          <h2>📍 Onde Estamos</h2>
          <p className="section-subtitle">Visite-nos na nossa sede em Maputo</p>
          <div className="mapa-container">
            <div className="mapa-placeholder">
              <h3>
                <FaMapMarkerAlt /> APP All Pest Protect - Maputo
              </h3>
              <p>📍 Av. Maguinguana nº 1742, r/c, Maputo – Moçambique</p>
              <div className="mapa-image">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126837.123456789!2d32.5!3d-25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee4a123456789ab%3A0x123456789abcdef!2sMaputo%2C+Mo%C3%A7ambique!5e0!3m2!1spt-PT!2spt!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização APP All Pest Protect - Maputo, Moçambique"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}