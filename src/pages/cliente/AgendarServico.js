import React, { useState, useEffect } from "react";
import axios from "../../api";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import "../../styles/AgendarServico.css";

function AgendarServico() {
  const [servicos, setServicos] = useState([]);
  const [servico, setServico] = useState(null);
  const [userLogado, setUserLogado] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFatura, setShowFatura] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [precos, setPrecos] = useState(null);
  const [agendamentoId, setAgendamentoId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    servico_id: "",
    endereco_completo: "",
    bairro: "",
    cidade: "Maputo",
    zona: "cidade",
    quantidade_compartimentos: 1,
    data_agendamento: "",
    observacoes: "",
    nome_cliente: "",
    email_cliente: "",
    contacto_cliente: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        setUserLogado(JSON.parse(user));
      } catch (e) {
        console.error("Erro ao fazer parse do user", e);
        setUserLogado(null);
      }
    } else {
      setUserLogado(null);
    }
    setAuthChecked(true);
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/servicos");
      const dados = response.data?.data || response.data;
      setServicos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao procurar serviços da API:", error);
      setServicos([]);
      setError("Nota: Não foi possível carregar a lista de serviços automaticamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (servico && servico.categoria && servico.categoria !== "termico") {
      calcularPrecos();
    } else {
      setPrecos(null);
    }
  }, [formData.zona, formData.quantidade_compartimentos, servico]);

  const calcularPrecos = () => {
    if (!servico) return;
    let unitario = 0;
    let logistica = 0;

    if (servico.categoria === "fumigacao") {
      if (formData.zona === "cidade") {
        unitario = 925;
        logistica = 300;
      } else {
        unitario = 1025;
        logistica = 500;
      }
    } else if (servico.categoria === "desratizacao") {
      if (formData.zona === "cidade") {
        unitario = 510;
        logistica = 300;
      } else {
        unitario = 610;
        logistica = 500;
      }
    }

    const subtotal = unitario * formData.quantidade_compartimentos;
    const total = subtotal + logistica;
    setPrecos({ unitario, logistica, subtotal, total });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const formatarDataLocal = (dataString) => {
    if (!dataString) return "";
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // 🔥 VALIDAÇÃO DA PRIMEIRA ETAPA (DADOS DO SERVIÇO)
  // Apenas o serviço e a data são obrigatórios — os restantes
  // campos (endereço, bairro, compartimentos) passaram a ser
  // opcionais para simplificar o preenchimento do formulário.
  const validarPrimeiraEtapa = () => {
    if (!formData.servico_id) {
      setError("Por favor, selecione um serviço.");
      return false;
    }

    if (!formData.data_agendamento) {
      setError("Por favor, selecione uma data para o agendamento.");
      return false;
    }

    const dataSelecionada = new Date(formData.data_agendamento + "T12:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
      setError("Por favor, selecione uma data a partir de hoje.");
      return false;
    }

    return true;
  };

  // 🔥 VALIDAÇÃO DA SEGUNDA ETAPA (DADOS DO CLIENTE - APENAS PARA NÃO LOGADOS)
  // Apenas o contacto telefónico é obrigatório, para que a
  // equipa consiga entrar em contacto com o cliente.
  const validarSegundaEtapa = () => {
    if (!userLogado && !formData.contacto_cliente.trim()) {
      setError("Por favor, preencha o seu contacto telefónico.");
      return false;
    }
    return true;
  };

  // 🔥 AVANÇAR PARA A PRÓXIMA ETAPA
  const avancarEtapa = () => {
    setError("");

    if (currentStep === 1) {
      // Validar primeira etapa
      if (validarPrimeiraEtapa()) {
        setCurrentStep(2);
        // Limpar erros anteriores
        setError("");
      }
    } else if (currentStep === 2) {
      // Validar segunda etapa
      if (validarSegundaEtapa()) {
        // Se for serviço térmico, vai direto para o PDF
        if (servico && servico.categoria === "termico") {
          enviarAgendamentoTermico();
        } else {
          // Mostrar fatura para confirmar
          setShowFatura(true);
        }
      }
    }
  };

  // 🔥 VOLTAR ETAPA
  const voltarEtapa = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 🔥 ENVIAR AGENDAMENTO TÉRMICO
  const enviarAgendamentoTermico = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        servico_id: formData.servico_id,
        endereco_completo: formData.endereco_completo,
        bairro: formData.bairro,
        cidade: formData.cidade,
        zona: formData.zona,
        data_agendamento: formData.data_agendamento,
        quantidade_compartimentos: 1,
        observacoes: formData.observacoes,
        ...(!userLogado && {
          nome_cliente: formData.nome_cliente,
          email_cliente: formData.email_cliente,
          telefone_cliente: formData.contacto_cliente,
          anonimo: true
        })
      };

      const response = await axios.post("/agendamentos", payload);

      if (response.data.success) {
        setAgendamentoId(response.data.data?.agendamento?.id || Math.floor(Math.random() * 1000));
        setShowPDFPreview(true);
        setCurrentStep(3);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao solicitar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CONFIRMAR AGENDAMENTO (para serviços normais)
  const confirmarAgendamento = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        servico_id: formData.servico_id,
        endereco_completo: formData.endereco_completo,
        bairro: formData.bairro,
        cidade: formData.cidade,
        zona: formData.zona,
        data_agendamento: formData.data_agendamento,
        quantidade_compartimentos: formData.quantidade_compartimentos,
        observacoes: formData.observacoes,
        ...(!userLogado && {
          nome_cliente: formData.nome_cliente,
          email_cliente: formData.email_cliente,
          telefone_cliente: formData.contacto_cliente,
          anonimo: true
        })
      };

      const response = await axios.post("/agendamentos", payload);

      if (response.data.success) {
        setAgendamentoId(response.data.data?.agendamento?.id || Math.floor(Math.random() * 1000));
        setShowPDFPreview(true);
        setShowFatura(false);
        setCurrentStep(3);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao realizar agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(11, 79, 108);
    doc.text("APP", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("APP All Pest Protect", 105, 28, { align: "center" });
    
    doc.setDrawColor(255, 217, 61);
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Av. Maguinguana nº 1742, r/c, Maputo – Moçambique", 105, 42, { align: "center" });
    doc.text("Tel: +258 84 3830770 | Email: comercial@appmoz.co.mz", 105, 48, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(11, 79, 108);
    doc.text("SOLICITAÇÃO DE SERVIÇO", 105, 60, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Nº: ${agendamentoId}`, 20, 70);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 150, 70);
    
    doc.setFontSize(14);
    doc.setTextColor(11, 79, 108);
    doc.text("DADOS DO CLIENTE", 20, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nome: ${userLogado?.name || formData.nome_cliente || "—"}`, 20, 95);
    doc.text(`Email: ${userLogado?.email || formData.email_cliente || "—"}`, 20, 102);
    doc.text(`Telefone: ${userLogado?.telefone || formData.contacto_cliente || "—"}`, 20, 109);
    
    doc.setFontSize(14);
    doc.setTextColor(11, 79, 108);
    doc.text("DADOS DO SERVIÇO", 20, 125);
    
    autoTable(doc, {
      startY: 132,
      head: [['Serviço', 'Endereço', 'Bairro', 'Zona', 'Data']],
      body: [[
        servico?.nome || "—",
        formData.endereco_completo,
        formData.bairro,
        formData.zona === 'cidade' ? 'Dentro da Cidade' : 'Fora da Cidade',
        formatarDataLocal(formData.data_agendamento)
      ]],
      headStyles: { fillColor: [11, 79, 108], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 20 }
    });

    let yPos = doc.lastAutoTable.finalY + 10;

    if (servico?.categoria !== "termico" && precos) {
      doc.setFontSize(11);
      doc.setTextColor(11, 79, 108);
      doc.text("DETALHAMENTO DE VALORES", 20, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Preço por compartimento: ${precos.unitario} MT`, 20, yPos);
      yPos += 6;
      doc.text(`Número de compartimentos: ${formData.quantidade_compartimentos}`, 20, yPos);
      yPos += 6;
      doc.text(`Subtotal: ${precos.subtotal} MT`, 20, yPos);
      yPos += 8;

      doc.setDrawColor(255, 217, 61);
      doc.setLineWidth(0.3);
      doc.line(20, yPos - 2, 190, yPos - 2);

      yPos += 4;
      doc.setFontSize(12);
      doc.setTextColor(11, 79, 108);
      doc.text(`TOTAL A PAGAR: ${precos.total} MT`, 20, yPos);
      yPos += 8;
    }
    
    if (formData.observacoes) {
      doc.text(`Observações: ${formData.observacoes}`, 20, yPos);
      yPos += 7;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(255, 217, 61);
    doc.text("STATUS: PENDENTE", 20, yPos + 5);
    
    doc.save(`solicitacao_${agendamentoId}.pdf`);
  };

  const getMinDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const renderSteps = () => {
    return (
      <div className="steps-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Dados do Serviço</span>
        </div>
        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">{userLogado ? 'Confirmar' : 'Contacto'}</span>
        </div>
        <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Concluído</span>
        </div>
      </div>
    );
  };

  const renderConteudoFormulario = () => {
    return (
      <div className="agendar-container">
        {/* Botão Voltar */}
        <button onClick={() => navigate("/")} className="btn-voltar-home">
          ← Voltar para a Página Inicial
        </button>

        {/* Cabeçalho */}
        <div className="header-agendar">
          <h2 className="titulo-agendar">Agendar Serviço</h2>
          <p className="subtitulo-agendar">Preencha os dados abaixo para solicitar o seu serviço</p>
        </div>

        {/* Steps */}
        {renderSteps()}

        {/* Mensagens de Erro/Sucesso */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!showFatura && !showPDFPreview ? (
          <>
            {/* Card de Serviço Selecionado */}
            {servico && (
              <div className="info-servico-card">
                <div className="servico-selecionado-header">
                  <span className="servico-selecionado-badge">Serviço Selecionado</span>
                  <h3>{servico.nome}</h3>
                </div>
                <p className="servico-desc">{servico.descricao}</p>
                {servico.categoria === "termico" ? (
                  <div className="aviso-termico">
                    <span className="aviso-icon">🔍</span>
                    <p>
                      <strong>Tratamento Térmico requer análise presencial.</strong> Após a solicitação, entraremos em contato para agendar visita técnica.
                    </p>
                  </div>
                ) : (
                  <div className="info-precos">
                    <span className="check-icon">✓</span>
                    <p>Serviço disponível para sua região</p>
                  </div>
                )}
              </div>
            )}

            <form className="agendar-form" onSubmit={(e) => e.preventDefault()}>
              {/* 🔥 ETAPA 1: DADOS DO SERVIÇO */}
              <div className={`section-card ${currentStep === 1 ? 'active-step' : 'inactive-step'}`}>
                <h4 className="section-title">Dados do Serviço</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Serviço *</label>
                    <select
                      name="servico_id"
                      value={formData.servico_id}
                      onChange={(e) => {
                        const servicoSelecionado = Array.isArray(servicos) ? servicos.find(s => Number(s.id) === Number(e.target.value)) : null;
                        setServico(servicoSelecionado || null);
                        setFormData({ ...formData, servico_id: e.target.value });
                        setError("");
                      }}
                      disabled={currentStep !== 1}
                      required
                    >
                      <option value="">Selecione um serviço</option>
                      {Array.isArray(servicos) && servicos.map((s) => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Endereço Completo</label>
                    <input type="text" name="endereco_completo" value={formData.endereco_completo} onChange={handleChange} placeholder="Rua/Avenida, Número" disabled={currentStep !== 1 || loading} />
                  </div>
                  <div className="form-group">
                    <label>Bairro</label>
                    <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} placeholder="Seu bairro" disabled={currentStep !== 1 || loading} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zona *</label>
                    <select name="zona" value={formData.zona} onChange={handleChange} required disabled={currentStep !== 1 || loading}>
                      <option value="cidade">Dentro da Cidade (Maputo)</option>
                      <option value="fora_cidade">Fora da Cidade</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data Desejada *</label>
                    <input type="date" name="data_agendamento" value={formData.data_agendamento} onChange={handleChange} min={getMinDate()} required disabled={currentStep !== 1 || loading} />
                  </div>
                </div>

                {servico && servico.categoria !== "termico" && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Número de Compartimentos</label>
                      <input type="number" name="quantidade_compartimentos" min="1" value={formData.quantidade_compartimentos} onChange={handleChange} disabled={currentStep !== 1 || loading} />
                      <small>Quantidade de cômodos/áreas a serem tratadas</small>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Observações (opcional)</label>
                  <textarea name="observacoes" rows="3" value={formData.observacoes} onChange={handleChange} placeholder="Informações adicionais sobre o serviço..." disabled={currentStep !== 1 || loading} />
                </div>
              </div>

              {/* 🔥 ETAPA 2: INFORMAÇÕES DE CONTACTO (apenas para não logados) */}
              {!userLogado && (
                <div className={`section-card ${currentStep === 2 ? 'active-step' : 'inactive-step'}`}>
                  <h4 className="section-title">Informações de Contacto</h4>
                  <p className="section-subtext">Preencha os seus dados para que possamos entrar em contacto</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nome Completo</label>
                      <input type="text" name="nome_cliente" value={formData.nome_cliente} onChange={handleChange} placeholder="Ex: João Silva" disabled={currentStep !== 2 || loading} />
                    </div>
                    <div className="form-group">
                      <label>E-mail</label>
                      <input type="email" name="email_cliente" value={formData.email_cliente} onChange={handleChange} placeholder="Ex: joao@gmail.com" disabled={currentStep !== 2 || loading} />
                    </div>
                    <div className="form-group">
                      <label>Contacto Telefónico *</label>
                      <input type="tel" name="contacto_cliente" value={formData.contacto_cliente} onChange={handleChange} placeholder="Ex: +258 84 000 0000" required disabled={currentStep !== 2 || loading} />
                    </div>
                  </div>
                </div>
              )}

              {/* Usuário logado - mostra apenas um resumo na etapa 2 */}
              {userLogado && currentStep === 2 && (
                <div className="section-card active-step">
                  <h4 className="section-title">Confirmar Dados</h4>
                  <div className="user-info-row">
                    <span><strong>Nome:</strong> {userLogado.name}</span>
                    <span><strong>Email:</strong> {userLogado.email}</span>
                    <span><strong>Telefone:</strong> {userLogado.telefone || "Não informado"}</span>
                  </div>
                </div>
              )}

              {/* 🔥 BOTÕES DE NAVEGAÇÃO */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" className="btn-voltar-etapa" onClick={voltarEtapa} disabled={loading}>
                    ← Voltar
                  </button>
                )}
                
                {currentStep === 1 && (
                  <button type="button" className="btn-continuar" onClick={avancarEtapa} disabled={loading}>
                    {loading ? "Processando..." : "Continuar →"}
                  </button>
                )}
                
                {currentStep === 2 && (
                  <button type="button" className="btn-continuar" onClick={avancarEtapa} disabled={loading}>
                    {loading ? "Processando..." : (servico?.categoria === "termico" ? "Solicitar Visita →" : "Ver Fatura →")}
                  </button>
                )}
              </div>
            </form>
          </>
        ) : showFatura ? (
          <div className="fatura-container">
            <div className="fatura-header">
              <div className="fatura-logo">
                <h3>APP All Pest Protect</h3>
                <p>Solicitação de Serviço</p>
              </div>
            </div>
            <div className="fatura-body">
              {(!userLogado || formData.nome_cliente) && (
                <div className="fatura-row highlight">
                  <span>Contacto Cliente:</span>
                  <strong>{formData.nome_cliente || userLogado?.name} ({formData.contacto_cliente || userLogado?.telefone})</strong>
                </div>
              )}
              <div className="fatura-row">
                <span>Serviço:</span><strong>{servico?.nome}</strong>
              </div>
              <div className="fatura-row">
                <span>Endereço:</span><span>{formData.endereco_completo}, {formData.bairro}</span>
              </div>
              <div className="fatura-row">
                <span>Zona:</span><span>{formData.zona === "cidade" ? "Dentro da Cidade" : "Fora da Cidade"}</span>
              </div>
              <div className="fatura-row">
                <span>Data:</span><span>{formatarDataLocal(formData.data_agendamento)}</span>
              </div>

              {servico?.categoria !== "termico" && (
                <>
                  <div className="fatura-row">
                    <span>Compartimentos:</span><span>{formData.quantidade_compartimentos}</span>
                  </div>
                  <div className="fatura-detalhes-precos">
                    <h4>Detalhamento de Valores</h4>
                    <div className="fatura-row">
                      <span>Preço por compartimento:</span><span>{precos?.unitario} MT</span>
                    </div>
                    <div className="fatura-row">
                      <span>Subtotal:</span><span>{precos?.subtotal} MT</span>
                    </div>
                    <div className="fatura-divider"></div>
                    <div className="fatura-row total-destaque">
                      <span><strong>TOTAL A PAGAR:</strong></span>
                      <span className="valor-total"><strong>{precos?.total} MT</strong></span>
                    </div>
                  </div>
                </>
              )}
              <div className="fatura-divider"></div>
              <div className="fatura-row status-row">
                <span>Status:</span><span className="status-pendente">Pendente</span>
              </div>
            </div>
            <div className="fatura-botoes">
              <button className="btn-voltar" onClick={voltarEtapa} disabled={loading}>← Voltar e Editar</button>
              <button className="btn-confirmar" onClick={confirmarAgendamento} disabled={loading}>
                {loading ? "Confirmando..." : "✅ Confirmar e Agendar"}
              </button>
            </div>
          </div>
        ) : showPDFPreview && (
          <div className="pdf-preview-container">
            <div className="success-icon">✓</div>
            <h3>Solicitação enviada com sucesso!</h3>
            <p>Nº da solicitação: <strong>{agendamentoId}</strong></p>
            <div className="pdf-actions">
              <button className="btn-voltar" onClick={() => { setShowPDFPreview(false); navigate("/"); }}>
                ← Voltar para Início
              </button>
              <button className="btn-pdf" onClick={gerarPDF}>📄 Baixar PDF da Solicitação</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!authChecked) {
    return <div className="loading-container">A verificar autenticação...</div>;
  }

  return (
    <div className="pagina-publica-agendamento">
      {renderConteudoFormulario()}
    </div>
  );
}

export default AgendarServico;