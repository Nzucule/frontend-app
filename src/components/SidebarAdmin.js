import { Link } from "react-router-dom";
import "../styles/SidebarAdmin.css";
import LogoutButton from "../components/LogoutButton";

export default function SidebarAdmin({ mobileOpen, setMobileMenuOpen }) {
  return (
    <>
      {/* OVERLAY FORA DO SIDEBAR */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">APP Pest Protect</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/servicos">🔬 Serviços</Link>
          <Link to="/admin/agendamentos">📅 Agendamentos</Link>
          <Link to="/admin/clientes">👥 Clientes</Link>
          <Link to="/admin/tecnicos">👨‍🔬 Técnicos</Link>
          <Link to="/admin/relatorios">📄 Relatórios</Link>
          <Link to="/admin/configuracoes">⚙️ Configurações</Link>

          <div className="sidebar-divider"></div>

          <LogoutButton />
        </nav>

        <div className="sidebar-footer">
          <p>© 2026 APP Pest Protect</p>
        </div>
      </aside>
    </>
  );
}