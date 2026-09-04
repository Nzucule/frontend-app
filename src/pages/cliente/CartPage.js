import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { createProductPlaceholder } from '../../utils/imagePlaceholder';
import '../../styles/Loja.css';

export default function CartPage() {
  const {
    cartItems,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    settings,
  } = useStore();

  if (!cartItems.length) {
    return (
      <>
        <Navbar />
        <section className="section cart-page-section">
          <div className="container">
            <EmptyState
              title="O carrinho está vazio"
              text="Adicione artigos para preparar a sua encomenda."
              action={<Link to="/artigos"><Button>Ver artigos</Button></Link>}
            />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const deliveryFee = cartSubtotal >= Number(settings.freeDeliveryFrom)
    ? 0
    : Number(settings.deliveryFee);

  return (
    <>
      <Navbar />
      <section className="section cart-page-section">
        <div className="container">
          <div className="page-heading cart-page-heading">
            <p className="eyebrow">A sua selecção</p>
            <h1>O seu carrinho</h1>
            <p>Confirme os artigos e as quantidades antes de finalizar a encomenda.</p>
          </div>

          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map(({ product, quantity }) => (
                <article className="cart-item" key={product.id}>
                  <Link to={`/artigo/${product.id}`} className="cart-item__image-link">
                    <img
                      src={product.image || createProductPlaceholder(product.name)}
                      alt={product.name}
                      className="cart-item__image"
                    />
                  </Link>

                  <div className="cart-item__info">
                    <p className="eyebrow">{product.category}</p>
                    <Link to={`/artigo/${product.id}`}><h3>{product.name}</h3></Link>
                    <strong className="cart-item__unit-price">{formatCurrency(product.price)}</strong>
                    <small>{product.stock} unidade(s) disponíveis</small>
                  </div>

                  <div className="cart-quantity" aria-label={`Quantidade de ${product.name}`}>
                    <span>Quantidade</span>
                    <div className="cart-quantity__controls">
                      <button
                        type="button"
                        aria-label="Diminuir quantidade"
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(event) => updateCartQuantity(product.id, Number(event.target.value))}
                      />
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        disabled={quantity >= Number(product.stock)}
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item__total">
                    <small>Total do artigo</small>
                    <strong>{formatCurrency(product.price * quantity)}</strong>
                    <button type="button" onClick={() => removeFromCart(product.id)}>
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="order-summary">
              <p className="eyebrow">Resumo da compra</p>
              <h2>Resumo</h2>
              <div><span>Subtotal</span><strong>{formatCurrency(cartSubtotal)}</strong></div>
              <div>
                <span>Entrega estimada</span>
                <strong>{deliveryFee ? formatCurrency(deliveryFee) : 'Grátis'}</strong>
              </div>
              <p className="summary-note">
                A taxa final e a zona de entrega serão confirmadas pela nossa equipa.
              </p>
              <div className="order-summary__total">
                <span>Total estimado</span>
                <strong>{formatCurrency(cartSubtotal + deliveryFee)}</strong>
              </div>
              <Link to="/finalizar">
                <Button size="lg" className="full-width">Finalizar encomenda</Button>
              </Link>
              <Link className="continue-link" to="/artigos">← Continuar a comprar</Link>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
