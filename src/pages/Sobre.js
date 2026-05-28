import React, { useState, useEffect } from "react";
import "../styles/Sobre.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imagem from "../img/job.jpg";

// Importe suas imagens aqui (exemplo - ajuste os caminhos conforme suas pastas)
// Técnico 1
import tecnico1_foto2 from "../img/imagem4.jpg";
import tecnico1_foto3 from "../img/desraterizacao.webp";
import castrodire from "../img/castrodire.jpg";

// Técnico 2
/*import tecnico1_foto1 from "../img/imagem1.jpg";
import tecnico1_foto2 from "../img/imagem4.jpg";
import tecnico1_foto3 from "../img/imagem8.jpg";

// Técnico 3
import tecnico1_foto1 from "../img/imagem1.jpg";
import tecnico1_foto2 from "../img/imagem4.jpg";
import tecnico1_foto3 from "../img/imagem8.jpg";*/


export default function Sobre() {
  // Dados fixos da equipe técnica com 3 imagens cada
  const equipe = [
    {
      id: 1,
      nome: "Castro Zavale",
      cargo: "Diretor",
      //especialidade: "Controlo de Pragas",
      imagens: [castrodire]
    },
    {
      id: 2,
      //nome: "Maria Silva",
      cargo: "Técnica Especialista",
      especialidade: "Desinfestação",
      imagens: [tecnico1_foto2]
    },
    {
      id: 3,
      //nome: "João Santos",
      cargo: "Técnico de Campo",
      especialidade: "Controlo de Roedores",
      imagens: [tecnico1_foto3]
    }
  ];

  return (
    <>
      <Navbar />

      {/* Banner Sobre */}
      <div className="sobre-banner">
        <div className="container">
          <h1>Sobre a APP All Pest Protect</h1>
          <p>Proteção completa contra pragas desde 2020</p>
        </div>
      </div>

      {/* Nossa História */}
      <section className="nossa-historia">
        <div className="container">
          <div className="historia-content">
            <div className="historia-text">
              <h2>Nossa História</h2>
              <p>
               A <strong>APP – All Pest Protect, Lda.,</strong> é uma empresa moçambicana constituída 
               nas entidades legais competentes, com o NUIT nº 401738517, situada
                na Av. Maguiguana, nº. 1742, R/C - Cidade de Maputo. Operamos no mercado
                 nacional desde 2022, nas áreas de Fumigação, Controlo Integrado de Pragas
                  e Limpeza com o propósito de prestar apoio à empresas e singulares através
                   do uso e aplicação de técnicas e modalidades específicas da área.
                   A nossa visão é ser, a nível nacional, o maior provedor de serviços
                    de controlo de pragas, Desinfeção e limpeza. Para isso, introduzimos 
                    treinamentos e capacitações periódicas para o nosso pessoal técnico e garantimos
                     o dinamismo e qualidade em todos os serviços prestados. O lema é: Sua vida Longe
                      de Pragas!
                      <strong>CONTEXTO DA COVID 19</strong>
                     Em tempos de pandemia (Coronavírus), a Higienização direcionada das instalações, 
                     fazendo o uso de produtos desinfetantes em todo o processo de limpeza constitui um
                      requisito básico no combate a Pandemia.
                      Através do uso e aplicação de técnicas e modalidades específicas no que concerne ao 
                      controlo de pragas, Higienização e Limpeza, a <strong>APP – All Pest Protect, Lda.,</strong>
                       desempenhou um papelpreponderante no controlo e combate a Covid 19 desde que o surto 
                       deste vírus foi então detectado no solo pátrio.

                      Somos uma empresa Nacional com departamentos técnicos e administrativos, constituído
                       por profissionais experientes,
                       especializados em diversas áreas nas faculdades Nacionais e Internacionais. O nosso objectivo é
                        beneficiar a vossa instituição apostando na qualidade de serviços diversos e na sua maior 
                        satisfação em todas as áreas em que estamos capacitados.
                      A APP - All Pest Protect é constituída por técnicos formados em diversas áreas que auxiliam em 
                      aspectos de estética e inovação dos espaços, sempre que se justificar. As nossas intervenções cingem-se,
                       para além do Controlo pontual e integrado de Pragas, no seguinte (espaços comuns): Assistência preventiva 
                       contra todo tipo de pragas; Ideias para colocação de equipamento estratégico para melhor resultado na extinção das 
                       pragas invasoras. Neste contexto, o nosso lema é: Bem-estar, Conforto e Ambiente.
                     O quadro técnico da APP - ALL PEST PROTECT, LDA. é composto por profissionais 
                     altamente qualificados e com experiência em controlo de pragas, Conservação de 
                     espaços e edifícios das mais diversas tipologias, trabalhando com parâmetros de
                      alto padrão, nossos colaboradores são muito disciplinados durante a execução de 
                      suas tarefas e sempre buscando melhorias e melhores práticas.





              </p>
            </div>
            <div className="historia-image">
              <div className="image-container">
                <div className="historia-placeholder">
                  <img src={imagem} alt="APP Pest Protect - Nossa História" />
                  <p>APP All Pest Protect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="nossa-missao">
        <div className="container">
          <div className="missao-grid">
            <div className="missao-card">
              <div className="missao-icon"></div>
              <h3>Missão</h3>
              <p>
                Prestar apoio a empresas e singulares na prevenção e controle
                sistemático de pragas e limpeza, através de soluções inovadoras
                e eficazes, garantindo segurança e bem-estar.
              </p>
            </div>
            <div className="missao-card">
              <div className="missao-icon"></div>
              <h3>Visão</h3>
              <p>
                Ser referência no setor de controle de pragas e limpeza,
                reconhecida pela qualidade dos serviços, ética profissional e
                contribuição à saúde pública.
              </p>
            </div>
            <div className="missao-card">
              <div className="missao-icon"></div>
              <h3>Valores</h3>
              <p>
                • Qualidade e Excelência
                <br />
                • Ética Profissional
                <br />
                • Responsabilidade Ambiental e Social
                <br />• Dinamismo e Proatividade
              </p>
            </div>
          </div>
        </div>
      </section>

      
      {/* Equipe Técnica - Com 1 imagem por técnico */}
      <section className="nossa-equipe">
        <div className="container">
          <h2>Nossa Equipe Técnica</h2>

          <div className="equipe-grid">
            {equipe.map((membro) => (
              <div key={membro.id} className="membro-equipe">
                <div className="membro-foto-container">
                  <img 
                    src={membro.imagens[0]} 
                    alt={membro.nome}
                    className="foto-membro-unica"
                  />
                </div>
                <h4>{membro.nome}</h4>
                <p>{membro.cargo}</p>
                <span>{membro.especialidade}</span>
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
              <strong>2020</strong>
              <span>Ano da Constituiçao</span>
            </div>
            <div className="stat-item">
              <strong>1000+</strong>
              <span>Clientes Atendidos</span>
            </div>
            <div className="stat-item">
              <strong>+6</strong>
              <span>Anos de Experiência</span>
            </div>
            <div className="stat-item">
              <strong>24/7</strong>
              <span>Suporte ao Cliente</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}