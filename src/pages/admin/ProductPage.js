import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';
import HeaderAdmin from '../../components/HeaderAdmin';
import Button from '../../components/Button';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { createProductPlaceholder } from '../../utils/imagePlaceholder';
import '../../styles/DashboardAdmin.css';
import '../../styles/admin/produtos.css';

export default function ProductsPage() {
  const { products, deleteProduct, toggleProduct } = useStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchSearch = !normalized || `${product.name} ${product.category}`.toLowerCase().includes(normalized);
      const matchStatus = status === 'todos' || (status === 'activos' ? product.active : !product.active);
      return matchSearch && matchStatus;
    });
  }, [products, search, status]);

  async function handleDelete(product) {
    if (window.confirm(`Eliminar definitivamente o produto “${product.name}”?`)) {
      await deleteProduct(product.id);
    }
  }

  return (
    <div className="dashboard">
      <SidebarAdmin
        mobileOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="main-content">
        <HeaderAdmin
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <div className="admin-page-heading">
          <div><p className="eyebrow">Catálogo</p><h1>Artigos</h1><p>Adicione fotografias, preços, stock e descrições.</p></div>
          <Link to="/admin/produtos/novo"><Button>Novo artigo</Button></Link>
        </div>

        <section className="admin-card">
          <div className="admin-filters">
            <label className="field"><span>Pesquisar</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome ou categoria" /></label>
            <label className="field"><span>Estado</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="todos">Todos</option><option value="activos">Activos</option><option value="inactivos">Inactivos</option></select></label>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Artigo</th><th>Categoria</th><th>Preço</th><th>Stock</th><th>Estado</th><th>Acções</th></tr></thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td><div className="table-product"><img src={product.image || createProductPlaceholder(product.name)} alt="" /><div><strong>{product.name}</strong>{product.featured && <small>Destaque</small>}</div></div></td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td><span className={`stock-pill ${product.stock === 0 ? 'stock-pill--out' : ''}`}>{product.stock}</span></td>
                    <td><button className={`toggle ${product.active ? 'toggle--on' : ''}`} onClick={() => toggleProduct(product.id)}><span />{product.active ? 'Activo' : 'Inactivo'}</button></td>
                    <td><div className="table-actions"><Link to={`/admin/produtos/${product.id}`}>Editar</Link><button onClick={() => handleDelete(product)}>Eliminar</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <p className="muted center-text">Nenhum artigo encontrado.</p>}
        </section>
      </div>
    </div>
  );
}
