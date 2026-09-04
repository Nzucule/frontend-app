import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { createProductPlaceholder } from '../utils/imagePlaceholder';

export default function ProductCard({ product }) {
  if (!product) return null;

  const stock = Number(product.stock || 0);
  const outOfStock = stock <= 0;

  const hasDiscount =
    Number(product.oldPrice) > Number(product.price);

  return (
    <Link
      to={`/artigo/${product.id}`}
      className={`product-card ${outOfStock ? 'product-card--out' : ''}`}
    >
      <div className="product-card__image">
        <img
          src={product.image || createProductPlaceholder(product.name)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="400"
          height="300"
        />

        {outOfStock && (
          <span className="product-card__badge product-card__badge--out">
            Esgotado
          </span>
        )}

        {!outOfStock && product.featured && (
          <span className="product-card__badge">Destaque</span>
        )}
      </div>

      <div className="product-card__content">
        {product.category && (
          <p className="eyebrow">{product.category}</p>
        )}

        <h3>{product.name}</h3>

        <div className="product-price">
          <strong>{formatCurrency(product.price)}</strong>

          {hasDiscount && (
            <del>{formatCurrency(product.oldPrice)}</del>
          )}
        </div>
      </div>
    </Link>
  );
}
