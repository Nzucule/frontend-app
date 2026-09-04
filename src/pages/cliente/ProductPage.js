import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useParams,
} from 'react-router-dom';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { createProductPlaceholder } from '../../utils/imagePlaceholder';
import '../../styles/Loja.css';

export default function ProductPage() {
  const { productId } = useParams();

  const {
    activeProducts = [],
    cartItems = [],
    addToCart,
    loading,
    apiError,
    refreshStore,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [retrying, setRetrying] = useState(false);

  const product = activeProducts.find(
    (entry) =>
      String(entry.id) === String(productId),
  );

  const stock = Number(product?.stock || 0);

  const outOfStock = stock <= 0;

  const cartItem = cartItems.find(
    (item) =>
      String(item.productId) === String(product?.id),
  );

  const quantityInCart = Number(
    cartItem?.quantity || 0,
  );

  const remainingStock = Math.max(
    0,
    stock - quantityInCart,
  );

  const related = useMemo(() => {
    if (!product) return [];

    return activeProducts
      .filter(
        (entry) =>
          String(entry.id) !== String(product.id) &&
          entry.category === product.category,
      )
      .slice(0, 4);
  }, [activeProducts, product]);

  useEffect(() => {
    setQuantity(1);
    setErrorMessage('');
  }, [productId]);

  useEffect(() => {
    if (!product) {
      return;
    }

    if (outOfStock) {
      setQuantity(0);
      return;
    }

    if (remainingStock <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((currentQuantity) =>
      Math.min(
        remainingStock,
        Math.max(1, currentQuantity),
      ),
    );
  }, [
    product,
    outOfStock,
    remainingStock,
  ]);

  async function handleRetry() {
    if (retrying) return;

    setRetrying(true);

    try {
      await refreshStore();
    } finally {
      setRetrying(false);
    }
  }

  if (loading && !product) {
    return (
      <>
        <Navbar />
        <main className="product-loading-page">
          <div className="product-simple-loader">
            <span className="product-simple-loader__dot" />
            <p>A carregar...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (apiError && !product) {
    return (
      <>
        <Navbar />
        <main className="product-loading-page">
          <div className="product-load-error">
            <h2>Não foi possível carregar o artigo</h2>
            <p>Verifique a ligação e tente novamente.</p>
            <button
              type="button"
              className="button button--primary"
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying
                ? 'A carregar...'
                : 'Tentar novamente'}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <section className="section">
          <div className="container page-heading">
            <p className="eyebrow">Artigos</p>
            <h1>Artigo não encontrado</h1>
            <Link
              to="/artigos"
              className="button button--primary"
            >
              Ver outros artigos
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  function handleQuantityChange(event) {
    setErrorMessage('');

    if (
      outOfStock ||
      remainingStock <= 0
    ) {
      return;
    }

    const enteredValue = Number(
      event.target.value,
    );

    if (!Number.isFinite(enteredValue)) {
      setQuantity(1);
      return;
    }

    const validQuantity = Math.min(
      remainingStock,
      Math.max(
        1,
        Math.floor(enteredValue),
      ),
    );

    setQuantity(validQuantity);
  }

  function handleAdd() {
    setErrorMessage('');

    if (outOfStock) {
      setErrorMessage(
        'Este artigo está temporariamente sem stock.',
      );
      return;
    }

    if (remainingStock <= 0) {
      setErrorMessage(
        'Todo o stock disponível deste artigo já está no carrinho.',
      );
      return;
    }

    if (quantity < 1) {
      setErrorMessage(
        'Seleccione pelo menos uma unidade.',
      );
      return;
    }

    if (quantity > remainingStock) {
      setErrorMessage(
        remainingStock === 1
          ? 'Só pode adicionar mais 1 unidade deste artigo.'
          : `Só pode adicionar mais ${remainingStock} unidades deste artigo.`,
      );
      return;
    }

    const result = addToCart(
      product.id,
      quantity,
    );

    const success =
      typeof result === 'object'
        ? result?.success
        : Boolean(result);

    const message =
      typeof result === 'object'
        ? result?.message
        : '';

    if (!success) {
      setErrorMessage(
        message ||
          'Não foi possível adicionar o artigo ao carrinho.',
      );
      return;
    }

    setErrorMessage('');
  }

  return (
    <>
      <Navbar />

      <section className="section product-detail">
        <div className="container">

          <div className="breadcrumb">
            <Link to="/artigos">Artigos</Link>
            <span aria-hidden="true">{' / '}</span>
            <span>{product.name}</span>
          </div>


          <div className="product-detail__grid">

            <div className="product-detail__image">
              <img
                src={
                  product.image ||
                  createProductPlaceholder(product.name)
                }
                alt={product.name}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="800"
                height="600"
                className={
                  outOfStock
                    ? 'product-image--out'
                    : ''
                }
              />
              {outOfStock && (
                <span className="product-detail__stock-badge">
                  Stock esgotado
                </span>
              )}
            </div>


            <div className="product-detail__content">

              <p className="eyebrow">
                Artigos
                {product.category
                  ? ` • ${product.category}`
                  : ''}
              </p>

              <h1>{product.name}</h1>

              <div className="product-price product-price--large">
                <strong>
                  {formatCurrency(product.price)}
                </strong>

                {Number(product.oldPrice) >
                  Number(product.price) && (
                  <del>
                    {formatCurrency(product.oldPrice)}
                  </del>
                )}
              </div>

              <p className="product-detail__description">
                {product.description}
              </p>

              {!!product.features?.length && (
                <ul className="feature-list">
                  {product.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
              )}

              <p
                className={`stock-note ${
                  outOfStock ||
                  remainingStock <= 0
                    ? 'stock-note--out'
                    : ''
                }`}
              >
                {outOfStock
                  ? 'Artigo temporariamente sem stock'
                  : remainingStock <= 0
                    ? 'Todas as unidades disponíveis já estão no carrinho'
                    : remainingStock === 1
                      ? 'Resta apenas 1 unidade disponível'
                      : remainingStock <= 3
                        ? `Restam apenas ${remainingStock} unidades disponíveis`
                        : `${remainingStock} unidades disponíveis`}
              </p>

              {quantityInCart > 0 && (
                <p className="cart-stock-note">
                  Já tem <strong>{quantityInCart}</strong>{' '}
                  {quantityInCart === 1 ? 'unidade' : 'unidades'}{' '}
                  deste artigo no carrinho.
                </p>
              )}

              <div className="purchase-row">
                <label className="quantity-field">
                  <span>Quantidade</span>
                  <input
                    type="number"
                    min="1"
                    max={
                      remainingStock > 0
                        ? remainingStock
                        : 1
                    }
                    step="1"
                    value={quantity}
                    disabled={
                      outOfStock ||
                      remainingStock <= 0
                    }
                    onChange={handleQuantityChange}
                  />
                </label>

                <button
                  type="button"
                  className="button button--primary product-add-button"
                  onClick={handleAdd}
                  disabled={
                    outOfStock ||
                    remainingStock <= 0
                  }
                >
                  {outOfStock
                    ? 'Artigo indisponível'
                    : 'Adicionar ao carrinho'}
                </button>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="stock-validation-message"
                >
                  <span
                    className="stock-validation-message__icon"
                    aria-hidden="true"
                  >
                    !
                  </span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="payment-notice">
                <strong>Pagamento</strong>
                <p>
                  O pedido será confirmado directamente
                  pela nossa equipa.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {!!related.length && (
        <section className="section section--soft">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Artigos</p>
                <h2>Também pode gostar</h2>
              </div>
            </div>

            <div className="product-grid">
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
