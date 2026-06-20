import React, { useState, useEffect } from "react";
import "../styles/Sobre.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imagem from "../img/job.jpg";
import { 
  FaBullseye, 
  FaEye, 
  FaBalanceScale, 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt, 
  FaMedal, 
  FaAward,
  FaCheckCircle,
  FaClock,
  FaHandshake,
  FaLeaf
} from "react-icons/fa";
import { GiAchievement, GiTeamIdea, GiGrowing } from "react-icons/gi";

// Importação das imagens dos clientes
import yaya from "../img/yaya.png";
import loto from "../img/loto.png";
import geniel from "../img/geniel.png";
import edm from "../img/edm.png";
import apiex from "../img/apiex.jpeg";
import neopac from "../img/neopac.jpeg";

export default function Sobre() {
  // Dados dos clientes/parceiros
  const clientes = [
    {
      id: 1,
      nome: "Premier Loto",
      cargo: "Desinfeção e Controlo de Pragas",
      imagem: loto,
      descricao: "Parceiro estratégico na área de desinfeção e controlo de pragas"
    },
    {
      id: 2,
      nome: "Geniel",
      cargo: "Limpeza Geral",
      imagem: geniel,
      descricao: "Especialista em soluções de limpeza profissional"
    },
    {
      id: 3,
      nome: "Mercearia YAYA",
      cargo: "Controlo de Pragas",
      imagem: yaya,
      descricao: "Referência no controlo de pragas no setor alimentar"
    },
    {
      id: 4,
      nome: "Electricidade de Moçambique",
      cargo: "Controlo de Pragas",
      imagem: edm,
      descricao: "Parceiro na manutenção de instalações livres de pragas"
    },
    {
      id: 5,
      nome: "APIEX",
      cargo: "Controlo de Pragas",
      imagem: apiex,
      descricao: "Apoio na promoção de investimentos com ambientes seguros"
    },
    {
      id: 6,
      nome: "NEOPAC PLUS, LDA",
      cargo: "Controlo de Pragas",
      imagem: neopac,
      descricao: "Soluções integradas em controlo de pragas"
    }
  ];

  // Dados da equipe técnica
  const equipeTecnica = [
    {
      nome: "Eng. Carlos Mendes",
      cargo: "Director Técnico",
      especialidade: "Controlo Integrado de Pragas",
      experiencia: "12 anos"
    },
    {
      nome: "Dra. Ana Silva",
      cargo: "Coordenadora de Operações",
      especialidade: "Biossegurança Ambiental",
      experiencia: "8 anos"
    },
    {
      nome: "Téc. João Santos",
      cargo: "Especialista em Fumigação",
      especialidade: "Controlo de Roedores e Insetos",
      experiencia: "6 anos"
    },
    {
      nome: "Téc. Maria Oliveira",
      cargo: "Especialista em Desinfeção",
      especialidade: "Higiene e Saneamento",
      experiencia: "5 anos"
    }
  ];

  return (
    <>
      <Navbar />

      {/* Banner Sobre */}
      <div className="sobre-banner">
        <div className="container">
          <h1>Sobre a APP All Pest Protect</h1>
          <p>Proteção completa contra pragas desde 2022</p>
        </div>
      </div>

      {/* Nossa História */}
      <section className="nossa-historia">
        <div className="container">
          <div className="historia-content">
            <div className="historia-text">
              <span className="historia-badge">Quem Somos</span>
              <h2>Compromisso com Ambientes Saudáveis</h2>
              <p>
                Somos uma empresa moçambicana sediada na Cidade de Maputo, presentes no mercado desde 2022, 
                actuando nas áreas de fumigação, controlo integrado de pragas e limpeza. Focamo-nos na prestação 
                de serviços de qualidade, utilizando técnicas modernas e especializadas.
              </p>
              <p>
                Contamos com uma equipa técnica qualificada e investimos continuamente na formação dos nossos 
                profissionais para garantir aos clientes e público em geral serviços eficientes e cada vez mais 
                modernizados.
              </p>
              <div className="historia-features">
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <span>Equipa Especializada</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <span>Tecnologia Avançada</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <span>Produtos Certificados</span>
                </div>
                <div className="feature-item">
                  <FaCheckCircle className="feature-icon" />
                  <span>Atendimento 24/7</span>
                </div>
              </div>
              <div className="historia-vision">
                <p>
                  <strong>Nossa Visão:</strong> Ser líder nacional no setor, promovendo bem-estar, conforto e 
                  ambientes livres de pragas.
                </p>
              </div>
            </div>
            <div className="historia-image">
              <div className="image-container">
                <div className="historia-placeholder">
                  <img src={imagem} alt="APP Pest Protect" />
                  <div className="image-overlay">
                    <span>APP All Pest Protect</span>
                    <p>Excelência em Controlo de Pragas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="nossa-missao">
        <div className="container">
          <h2 className="section-title">Nossa Essência</h2>
          <p className="section-subtitle">O que nos move e nos guia no dia a dia</p>
          <div className="missao-grid">
            <div className="missao-card">
              <div className="missao-icon">
                <FaBullseye />
              </div>
              <h3>Missão</h3>
              <p>
                Prestar apoio a empresas e singulares na prevenção e controle sistemático de pragas e limpeza, 
                através de soluções inovadoras e eficazes, garantindo segurança e bem-estar.
              </p>
            </div>

            <div className="missao-card">
              <div className="missao-icon">
                <FaEye />
              </div>
              <h3>Visão</h3>
              <p>
                Ser referência no setor de controlo de pragas e limpeza, reconhecida pela qualidade dos serviços, 
                ética profissional e contribuição à saúde pública e ambiental.
              </p>
            </div>

            <div className="missao-card">
              <div className="missao-icon">
                <FaBalanceScale />
              </div>
              <h3>Valores</h3>
              <ul className="valores-list">
                <li><FaCheckCircle /> Qualidade e Excelência</li>
                <li><FaCheckCircle /> Ética Profissional</li>
                <li><FaCheckCircle /> Responsabilidade Ambiental</li>
                <li><FaCheckCircle /> Dinamismo e Proatividade</li>
                <li><FaCheckCircle /> Compromisso com o Cliente</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="diferenciais">
        <div className="container">
          <h2 className="section-title">Nossos Diferenciais</h2>
          <p className="section-subtitle">O que nos torna a escolha certa</p>
          <div className="diferenciais-grid">
            <div className="diferencial-item">
              <div className="diferencial-icon">
                <FaMedal />
              </div>
              <h3>Excelência Comprovada</h3>
              <p>Mais de 500 clientes atendidos com 98% de satisfação</p>
            </div>
            <div className="diferencial-item">
              <div className="diferencial-icon">
                <FaLeaf />
              </div>
              <h3>Produtos Eco-Friendly</h3>
              <p>Certificados e seguros para pessoas e animais</p>
            </div>
            <div className="diferencial-item">
              <div className="diferencial-icon">
                <FaClock />
              </div>
              <h3>Atendimento Rápido</h3>
              <p>Resposta em até 24 horas para emergências</p>
            </div>
            <div className="diferencial-item">
              <div className="diferencial-icon">
                <FaAward />
              </div>
              <h3>Garantia de 6 Meses</h3>
              <p>Assistência gratuita em caso de reincidência</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe Técnica */}
      <section className="equipe-tecnica">
        <div className="container">
          <h2 className="section-title">Equipa Técnica Especializada</h2>
          <p className="section-subtitle">Profissionais qualificados para cuidar do seu ambiente</p>
          <div className="equipe-grid">
            {equipeTecnica.map((membro, index) => (
              <div key={index} className="membro-card">
                <div className="membro-foto">
                  <div className="foto-placeholder">
                    <FaUsers className="placeholder-icon" />
                  </div>
                </div>
                <h4>{membro.nome}</h4>
                <p className="membro-cargo">{membro.cargo}</p>
                <div className="membro-info">
                  <span><strong>Especialidade:</strong> {membro.especialidade}</span>
                  <span><strong>Experiência:</strong> {membro.experiencia}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clientes/Parceiros */}
      <section className="clientes-parceiros">
        <div className="container">
          <h2 className="section-title">Empresas que Confiam em Nós</h2>
          <p className="section-subtitle">Parceiros que escolheram a excelência em controlo de pragas</p>
          <div className="clientes-grid">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="cliente-card">
                <div className="cliente-imagem">
                  <img src={cliente.imagem} alt={cliente.nome} />
                </div>
                <h4>{cliente.nome}</h4>
                <p>{cliente.cargo}</p>
                <small>{cliente.descricao}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="estatisticas">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaChartLine className="stat-icon" />
              </div>
              <strong>2022</strong>
              <span>Ano de Fundação</span>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaUsers className="stat-icon" />
              </div>
              <strong>500+</strong>
              <span>Clientes Atendidos</span>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaAward className="stat-icon" />
              </div>
              <strong>98%</strong>
              <span>Taxa de Satisfação</span>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <FaClock className="stat-icon" />
              </div>
              <strong>24/7</strong>
              <span>Suporte ao Cliente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada para Ação */}
      <section className="sobre-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Proteja seu Ambiente Hoje</h2>
            <p>Agende uma vistoria gratuita e descubra como podemos ajudar</p>
            <div className="cta-buttons">
              <button className="cta-button primary" onClick={() => window.location.href = "/agendar"}>
                Agendar Intervenção
              </button>
              <button className="cta-button secondary" onClick={() => window.location.href = "/contactos"}>
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}