import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.css";

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
import ProductsAdmin from "./pages/admin/ProductPage";
import ProductEditorPage from "./pages/admin/ProductEditorPage";

import AgendarServico from "./pages/cliente/AgendarServico.js";
import ShopPage from "./pages/cliente/ShopPage";
import ProductPage from "./pages/cliente/ProductPage";
import CartPage from "./pages/cliente/CartPage";
import CheckoutPage from "./pages/cliente/Checkoutpage";
import OrderSuccessPage from "./pages/cliente/OrderSucess";

import { StoreProvider } from "./context/StoreContext";

function App() {
  return (
    <StoreProvider>
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

          {/* ARTIGOS — LOJA (PÚBLICA) */}
          <Route path="/artigos" element={<ShopPage />} />
          <Route path="/artigo/:productId" element={<ProductPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/finalizar" element={<CheckoutPage />} />
          <Route path="/pedido-confirmado/:orderId" element={<OrderSuccessPage />} />

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

          {/* ADMIN — GESTÃO DE ARTIGOS */}
          <Route
            path="/admin/produtos"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/produtos/novo"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/produtos/:productId"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductEditorPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
