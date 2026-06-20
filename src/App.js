import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register.js";
import Login from "./pages/Login";
import Sobre from "./pages/Sobre.js";
import Contactos from "./pages/Contactos.js";
import ServicoDetalhes from "./pages/ServicoDetalhes";
import TodosServicos from "./pages/TodosServicos";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ServicosAdmin from "./pages/admin/ServicosAdmin";
import ClientesAdmin from "./pages/admin/ClientesAdmin";
import AgendamentosAdmin from "./pages/admin/AgendamentosAdmin"; 
import TecnicosAdmin from "./pages/admin/TecnicosAdmin"; 
import RelatoriosAdmin from "./pages/admin/RelatoriosAdmin"; 
import ConfiguracoesAdmin from "./pages/admin/ConfiguracoesAdmin"; 

import AgendarServico from "./pages/cliente/AgendarServico.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* PÁGINAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contactos" element={<Contactos />} />
        <Route path="/servico/:id" element={<ServicoDetalhes />} />
        <Route path="/servicos" element={<TodosServicos />} />
        
        {/* ROTA DE AGENDAMENTO PÚBLICA (Sem barreiras de login) */}
        <Route path="/agendar" element={<AgendarServico />} />

        {/* ROTAS DO ADMIN (Protegidas) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/servicos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ServicosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agendamentos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AgendamentosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ClientesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tecnicos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TecnicosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/relatorios"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RelatoriosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/configuracoes"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ConfiguracoesAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;