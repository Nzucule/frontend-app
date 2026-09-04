import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container empty-state">
        <div className="empty-state__icon">404</div>
        <h1>Página não encontrada</h1>
        <p>O endereço pode estar incorrecto ou a página já não existe.</p>
        <Link to="/"><Button>Voltar ao início</Button></Link>
      </div>
    </section>
  );
}
