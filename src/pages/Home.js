import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bannerFundo from "../img/imagem4.jpg";

// Importação das imagens dos clientes (PREMIER LOTO REMOVIDO)
import yaya from "../img/yaya.png";
import geniel from "../img/geniel.png";
import edm from "../img/edm.png";
import apiex from "../img/apiex.jpeg";
import neopac from "../img/neopac.jpeg";

// Importação da imagem do Mata-Mosquitos
import mataMosquitos from "../img/mata-mosquitos.png";

export default function Home() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await axios.get("https://apppest-backend-1.onrender.com/api/servicos");
      const dados = response.data?.data || response.data;
      setServicos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.log("Erro ao carregar serviços:", error);
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

  const irParaAgendamento = () => {
    navigate("/agendar");
  };

  // DADOS DOS CLIENTES - PREMIER LOTO REMOVIDO, TECHVISION ADICIONADO (SEM IMAGEM)
  const clientesReais = [
    { 
      nome: "TechVision", 
      servico: "Tecnologia e Inovação", 
      logo: null,
      alt: "TechVision - Tecnologia e Inovação",
      isTechVision: true
    },
    { 
      nome: "Geniel", 
      servico: "Limpeza Geral", 
      logo: geniel,
      alt: "Geniel - Limpeza Geral",
      isTechVision: false
    },
    { 
      nome: "Mercearia YAYA", 
      servico: "Controlo de Pragas", 
      logo: yaya,
      alt: "Mercearia YAYA - Controlo de Pragas",
      isTechVision: false
    },
    { 
      nome: "Electricidade de Moçambique", 
      servico: "Controlo de Pragas", 
      logo: edm,
      alt: "Electricidade de Moçambique - Controlo de Pragas",
      isTechVision: false
    },
    { 
      nome: "APIEX", 
      servico: "Controlo de Pragas", 
      logo: apiex,
      alt: "APIEX - Controlo de Pragas",
      isTechVision: false
    },
    { 
      nome: "NEOPAC PLUS, LDA", 
      servico: "Controlo de Pragas", 
      logo: neopac,
      alt: "NEOPAC PLUS, LDA - Controlo de Pragas",
      isTechVision: false
    },
  ];

  return (
    <>
      <Navbar />

      {/* Banner Principal */}
      <div 
        className="home-banner" 
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bannerFundo})` }}
      >
        <div className="home-banner-content">
          <h1>Controlo Integrado de Pragas</h1>
          <p>Protecção completa para residências, escritórios, centros comerciais, hotéis e indústrias.</p>
          <div className="banner-buttons">
            <button onClick={irParaAgendamento} className="home-button">
              Agendar Intervenção
            </button>
            <Link to="/sobre" className="home-button secondary">Conheça-nos</Link>
          </div>
        </div>
      </div>

      {/* SECÇÃO: NOSSOS CLIENTES */}
      <section className="home-clientes">
        <div className="container">
          <h2>Empresas que Confiam em Nós</h2>
          <p className="section-subtitle">Parceiros de confiança que escolheram a APP All Pest Protect para proteger os seus ambientes</p>
          <div className="clientes-grid">
            {clientesReais.map((cliente, index) => (
              <div key={index} className="cliente-item">
                <div className="cliente-logo-container">
                  {cliente.isTechVision ? (
                    <div className="techvision-text-logo">
                      <span className="techvision-icon">💻</span>
                      <span className="techvision-name">TechVision</span>
                      <span className="techvision-tag">TECH</span>
                    </div>
                  ) : (
                    <img 
                      src={cliente.logo} 
                      alt={cliente.alt}
                      className="cliente-logo"
                    />
                  )}
                </div>
                <p className="cliente-servico">{cliente.servico}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECÇÃO INSTITUCIONAL */}
      <section className="home-brand-presentation">
        <div className="container">
          <div className="brand-intro-text">
            <span className="text-highlight">Líder em Controlo de Pragas em Moçambique</span>
            <h2>APP All Pest Protect</h2>
            <p>
              Somos uma empresa moçambicana sediada na Cidade de Maputo, presentes no mercado desde 2022, 
              a actuar nas áreas de fumigação, controlo integrado de pragas e limpeza. Focamo-nos na prestação 
              de serviços de qualidade, utilizando técnicas modernas e especializadas.
            </p>
            <p className="brand-vision">
              <strong>A Nossa Missão:</strong> Garantir ambientes seguros e livres de pragas, promovendo saúde, 
              bem-estar e conforto para famílias e empresas moçambicanas.
            </p>
            <p className="brand-vision">
              <strong>A Nossa Visão:</strong> Ser a referência nacional em controlo de pragas, reconhecida pela 
              excelência técnica, inovação e compromisso com a satisfação dos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* SECÇÃO: SINAIS DE INFESTAÇÃO */}
      <section className="home-infestation-signs">
        <div className="container">
          <h2>Como Identificar uma Infestação de Pragas?</h2>
          <p className="section-subtitle">Esteja atento aos sinais e aja rapidamente</p>
          <div className="signs-grid">
            <div className="sign-item">
              <div className="sign-number">01</div>
              <h3>Presença de Fezes</h3>
              <p>Pequenos excrementos escuros perto de alimentos, rodapés ou em armários indicam atividade de pragas.</p>
            </div>
            <div className="sign-item">
              <div className="sign-number">02</div>
              <h3>Marcas de Roeduras</h3>
              <p>Móveis, fios elétricos e embalagens com marcas de dentes são sinais claros de roedores.</p>
            </div>
            <div className="sign-item">
              <div className="sign-number">03</div>
              <h3>Odores Desagradáveis</h3>
              <p>Cheiro forte e característico pode indicar presença de baratas, ratos ou infestações ocultas.</p>
            </div>
            <div className="sign-item">
              <div className="sign-number">04</div>
              <h3>Teias e Ovos</h3>
              <p>A presença de teias de aranha, ovos de insetos ou cascas de pupas são evidências de reprodução.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: ESTATÍSTICAS */}
      <section className="home-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Clientes Atendidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Taxa de Satisfação</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Anos de Experiência</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15</span>
              <span className="stat-label">Técnicos Especializados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Secção Serviços */}
      <section id="servicos" className="home-services">
        <div className="container">
          <h2>Os Nossos Serviços</h2>
          <p className="section-subtitle">Soluções completas para cada tipo de praga</p>

          {loading ? (
            <div className="loading">A carregar serviços...</div>
          ) : (
            <div className="services-grid">
              {Array.isArray(servicos) && servicos.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="service-card"
                  onClick={() => navigate(`/servico/${s.id}`)}
                >
                  {s.imagem && (
                    <img
                      src={`backendprincipal-production.up.railway.app/storage/${s.imagem}`}
                      alt={s.nome}
                      className="service-img"
                    />
                  )}
                  <h3>{s.nome}</h3>
                  <div className="service-price">{s.preco} MT</div>
                  <p className="service-description">{s.descricao}</p>
                  <button className="btn-agendar">Ver Detalhes</button>
                </div>
              ))}
            </div>
          )}

          <div className="view-all-container">
            <Link to="/servicos" className="view-all-btn">Ver Todos os Serviços</Link>
          </div>
        </div>
      </section>

      {/* SECÇÃO: MÉTODOS DE CONTROLO */}
      <section className="home-control-methods">
        <div className="container">
          <h2>Os Nossos Métodos de Controlo de Pragas</h2>
          <p className="section-subtitle">Tecnologia e experiência para resultados eficazes</p>
          <div className="methods-grid">
            <div className="method-item">
              <div className="method-number">1</div>
              <h3>Inspeção Detalhada</h3>
              <p>Realizamos uma vistoria completa para identificar o tipo de praga, nível de infestação e pontos críticos.</p>
            </div>
            <div className="method-item">
              <div className="method-number">2</div>
              <h3>Tratamento Específico</h3>
              <p>Utilizamos produtos e técnicas adequadas para cada tipo de praga, garantindo máxima eficácia.</p>
            </div>
            <div className="method-item">
              <div className="method-number">3</div>
              <h3>Monitorização Contínua</h3>
              <p>Instalamos pontos de monitorização para prevenir novas infestações e garantir proteção duradoura.</p>
            </div>
            <div className="method-item">
              <div className="method-number">4</div>
              <h3>Relatórios Detalhados</h3>
              <p>Fornecemos relatórios completos com todas as ações realizadas e recomendações para o cliente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: DIFERENCIAIS */}
      <section className="home-features-pub">
        <div className="container">
          <h2>Porquê escolher os nossos serviços?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">✓</div>
              <h3>Garantia de 6 Meses</h3>
              <p>Oferecemos assistência gratuita caso as pragas reapareçam dentro do período de garantia contratual.</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">✓</div>
              <h3>Produtos Eco-Friendly</h3>
              <p>Utilizamos produtos certificados de baixa toxicidade, seguros para a sua família, colaboradores e animais de estimação.</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">✓</div>
              <h3>Atendimento 24/7</h3>
              <p>Pronto atendimento especializado para dar resposta imediata a emergências a qualquer hora do dia ou da noite.</p>
            </div>
            <div className="feature-item">
              <div className="feature-number">✓</div>
              <h3>Equipa Qualificada</h3>
              <p>Contamos com técnicos treinados e certificados para garantir serviços de excelência e segurança.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: DEPOIMENTOS - PREMIER LOTO REMOVIDO */}
      <section className="home-testimonials">
        <div className="container">
          <h2>O que os nossos clientes dizem</h2>
          <div className="testimonials-grid">
            <div className="testimonial-item">
              <p className="testimonial-text">"A TechVision é parceira da APP All Pest Protect na modernização dos seus serviços. Inovação e tecnologia a favor do controlo de pragas."</p>
              <div className="testimonial-author">
                <strong>TechVision</strong>
                <span>Tecnologia e Inovação</span>
              </div>
            </div>
            <div className="testimonial-item">
              <p className="testimonial-text">"Excelente trabalho! Resolveram a infestação que tínhamos na nossa mercearia rapidamente. Clientes e funcionários estão mais seguros agora."</p>
              <div className="testimonial-author">
                <strong>Mercearia YAYA</strong>
                <span>Controlo de Pragas</span>
              </div>
            </div>
            <div className="testimonial-item">
              <p className="testimonial-text">"A Electricidade de Moçambique confia na APP All Pest Protect para manter as nossas instalações livres de pragas. Serviço profissional e confiável."</p>
              <div className="testimonial-author">
                <strong>Electricidade de Moçambique</strong>
                <span>Controlo de Pragas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: BANNER DE PROMOÇÃO */}
      <section className="home-promo-banner">
        <div className="promo-container">
          <div className="promo-text">
            <span>PLANO DE PROTEÇÃO ANUAL</span>
            <h2>Proteja o seu Ambiente Durante Todo o Ano</h2>
            <p>Assine o nosso plano anual e ganhe <strong>vistorias trimestrais gratuitas</strong> + <strong>desconto de 10%</strong> em serviços emergenciais. Inclui relatórios detalhados e certificado de controlo de pragas.</p>
          </div>
          <div className="promo-action">
            <Link to="/contactos" className="pub-btn-promo">Solicitar Proposta</Link>
          </div>
        </div>
      </section>

      {/* SECÇÃO: PREVENÇÃO DE PRAGAS - DICAS */}
      <section className="home-prevention-tips">
        <div className="container">
          <h2>Dicas para Prevenir Infestações de Pragas</h2>
          <p className="section-subtitle">Pequenas ações que fazem grande diferença</p>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-number">1</span>
              <div>
                <h3>Mantenha a Limpeza</h3>
                <p>Limpe regularmente cozinhas, despensas e áreas de armazenamento. Remova restos de alimentos e mantenha o lixo sempre fechado.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">2</span>
              <div>
                <h3>Vede Frestas e Rachaduras</h3>
                <p>Vede todas as aberturas em paredes, rodapés e portas. Pequenas frestas são portas de entrada para pragas indesejadas.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">3</span>
              <div>
                <h3>Elimine Água Parada</h3>
                <p>Elimine poças de água, mantenha calhas limpas e repare vazamentos. Água parada atrai mosquitos e outros insetos.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">4</span>
              <div>
                <h3>Armazene Alimentos Corretamente</h3>
                <p>Guarde alimentos em recipientes herméticos. Isso impede que pragas tenham acesso fácil à comida.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">5</span>
              <div>
                <h3>Mantenha Jardins e Quintais Limpos</h3>
                <p>Remova folhas secas, entulhos e mantenha a relva cortada. Jardins descuidados são abrigo para pragas.</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">6</span>
              <div>
                <h3>Agende Vistorias Periódicas</h3>
                <p>Não espere ter uma infestação. Agende vistorias preventivas com especialistas para detetar problemas precocemente.</p>
              </div>
            </div>
          </div>
          <div className="tips-cta">
            <button onClick={irParaAgendamento} className="btn-tips-cta">
              Agende uma Vistoria Preventiva
            </button>
          </div>
        </div>
      </section>

      {/* SECÇÃO: PRAGAS URBANAS COMUNS */}
      <section className="home-pest-types">
        <div className="container">
          <h2>Pragas Urbanas que Eliminamos</h2>
          <p className="section-subtitle">Conheça as principais pragas que atuamos e como as combatemos</p>
          <div className="pest-types-grid">
            <div className="pest-type-item">
              <h3>Baratas</h3>
              <p>Eliminação total de baratas alemãs, americanas e orientais com produtos específicos e seguros.</p>
            </div>
            <div className="pest-type-item">
              <h3>Roedores</h3>
              <p>Controlo eficaz de ratos e ratazanas com métodos seguros, iscas e armadilhas profissionais.</p>
            </div>
            <div className="pest-type-item">
              <h3>Mosquitos</h3>
              <p>Tratamentos larvicidas e adulticidas para combate ao mosquito da dengue, zika e malária.</p>
            </div>
            <div className="pest-type-item">
              <h3>Formigas</h3>
              <p>Eliminação de formigas com tecnologia de iscas que destroem a colónia inteira.</p>
            </div>
            <div className="pest-type-item">
              <h3>Moscas</h3>
              <p>Controlo de moscas domésticas e de frutas com métodos eficientes e seguros para alimentos.</p>
            </div>
            <div className="pest-type-item">
              <h3>Aranhas e Escorpiões</h3>
              <p>Remoção segura e prevenção de aranhas e escorpiões em residências e empresas.</p>
            </div>
            <div className="pest-type-item">
              <h3>Cupins</h3>
              <p>Tratamento especializado para eliminar cupins que destroem estruturas de madeira e móveis.</p>
            </div>
            <div className="pest-type-item">
              <h3>Traças</h3>
              <p>Eliminação de traças que danificam roupas, livros e documentos importantes.</p>
            </div>
            <div className="pest-type-item">
              <h3>Percevejos</h3>
              <p>Tratamento específico para eliminar percevejos de cama, garantindo noites tranquilas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: MATA-MOSQUITOS */}
      <section className="home-product-pub">
        <div className="container product-flex">
          <div className="product-info-text">
            <span className="badge-alert">EQUIPAMENTO RECOMENDADO</span>
            <h2>Mata-Mosquitos Elétrico UV</h2>
            <p className="product-intro">
              Proteção contínua contra mosquitos, moscas e outros insetos voadores. Tecnologia UV que atrai e elimina insetos de forma segura e sem químicos.
            </p>
            
            <div className="product-features-list">
              <div className="prod-feature">
                <strong>Proteção contra Vetores de Doenças</strong>
                <p>A tecnologia de luz UV atrai mosquitos, moscas e outros insetos voadores, eliminando-os por contacto elétrico imediato.</p>
              </div>
              <div className="prod-feature">
                <strong>Operação Segura e Sem Químicos</strong>
                <p>Equipamento livre de fumos, odores ou substâncias tóxicas. Ideal para quartos, cozinhas, escritórios e áreas de restauração.</p>
              </div>
              <div className="prod-features-grid">
                <span>Baixo consumo energético</span>
                <span>Funcionamento silencioso</span>
                <span>Ampla área de cobertura</span>
                <span>Higiénico e de fácil limpeza</span>
                <span>Preservação da saúde familiar</span>
              </div>
            </div>

            <p className="shipping-info">Disponível para entrega imediata em Maputo, Matola e envio para todas as províncias.</p>

            <div className="product-action">
              <a 
                href="https://wa.me/258873830003?text=QUERO%20ADQUIRIR%20O%20MATA-MOSQUITOS" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp-pub"
              >
                Solicitar via WhatsApp
              </a>
            </div>
          </div>
          
          <div className="product-image-box">
            <div className="product-placeholder">
              <img 
                src={mataMosquitos} 
                alt="Mata-Mosquitos Elétrico UV - APP All Pest Protect"
                className="product-image"
              />
              <div className="product-overlay">
                <span>Mata-Mosquitos Elétrico UV</span>
                <p>APP All Pest Protect</p>
                <div className="price-tag">Adquirir Equipamento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO: ÁREAS DE ATUAÇÃO */}
      <section className="home-areas">
        <div className="container">
          <h2>Áreas de Atuação</h2>
          <p className="section-subtitle">Cobertura estratégica para proteção imediata</p>
          <div className="areas-grid">
            <div className="area-item">
              <h3>Maputo</h3>
              <p>Atendimento prioritário na capital</p>
            </div>
            <div className="area-item">
              <h3>Matola</h3>
              <p>Cobertura na cidade vizinha</p>
            </div>
            <div className="area-item">
              <h3>Machava</h3>
              <p>Atendimento residencial e comercial</p>
            </div>
            <div className="area-item">
              <h3>Outras Províncias</h3>
              <p>Disponibilidade para todo o país</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECÇÃO CTA FINAL */}
      <section className="home-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ambiente Seguro e Livre de Pragas</h2>
            <p>Agende uma vistoria gratuita e receba um orçamento personalizado. Proteja a sua família ou empresa hoje mesmo!</p>
            <div className="cta-buttons">
              <Link to="/contactos" className="cta-button">Solicitar Orçamento</Link>
              <button onClick={irParaAgendamento} className="cta-button secondary">
                Agendar Intervenção
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}