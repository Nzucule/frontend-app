import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import EmptyState from '../../components/EmptyState';
import { useStore } from '../../context/StoreContext';
import '../../styles/Loja.css';

const PRODUCTS_PER_PAGE = 12;

export default function ShopPage() {
  const {
    activeProducts = [],
    loading,
    apiError,
    refreshStore,
  } = useStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState('recentes');
  const [availability, setAvailability] = useState('todos');
  const [retrying, setRetrying] = useState(false);

  /*
   * Quantos artigos serão mostrados inicialmente.
   */
  const [visibleCount, setVisibleCount] = useState(
    PRODUCTS_PER_PAGE,
  );

  /*
   * Mantém a pesquisa fluida mesmo com muitos artigos.
   */
  const deferredSearch = useDeferredValue(search);

  const categories = useMemo(
    () => [
      'Todas',
      ...new Set(
        activeProducts
          .map((product) => product.category)
          .filter(Boolean),
      ),
    ],
    [activeProducts],
  );

  const filtered = useMemo(() => {
    const normalized = deferredSearch
      .trim()
      .toLowerCase();

    const result = activeProducts.filter((product) => {
      const productStock = Number(product.stock || 0);

      const matchesCategory =
        category === 'Todas' ||
        product.category === category;

      const searchableText = `
        ${product.name || ''}
        ${product.description || ''}
        ${product.category || ''}
      `.toLowerCase();

      const matchesSearch =
        !normalized ||
        searchableText.includes(normalized);

      const matchesAvailability =
        availability === 'todos' ||
        (
          availability === 'disponiveis' &&
          productStock > 0
        ) ||
        (
          availability === 'esgotados' &&
          productStock <= 0
        );

      return (
        matchesCategory &&
        matchesSearch &&
        matchesAvailability
      );
    });

    return [...result].sort((a, b) => {
      if (sort === 'preco-baixo') {
        return (
          Number(a.price || 0) -
          Number(b.price || 0)
        );
      }

      if (sort === 'preco-alto') {
        return (
          Number(b.price || 0) -
          Number(a.price || 0)
        );
      }

      if (sort === 'nome') {
        return String(a.name || '').localeCompare(
          String(b.name || ''),
          'pt',
        );
      }

      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    });
  }, [
    activeProducts,
    category,
    deferredSearch,
    sort,
    availability,
  ]);

  /*
   * Só os primeiros artigos são renderizados.
   */
  const visibleProducts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const hasMoreProducts =
    visibleCount < filtered.length;

  /*
   * Quando mudar pesquisa/filtros,
   * volta a mostrar apenas os primeiros 12.
   */
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [
    category,
    deferredSearch,
    sort,
    availability,
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

  /*
   * Só bloqueia a página quando ainda
   * não temos nenhum artigo para mostrar.
   *
   * Se existirem artigos no cache,
   * eles aparecem imediatamente.
   */
  if (
    loading &&
    activeProducts.length === 0
  ) {
    return (
      <>
        <Navbar />
        <main className="shop-loading-page">
          <div className="shop-simple-loader">
            <span className="shop-simple-loader__dot" />
            <p>A preparar os artigos...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (
    apiError &&
    activeProducts.length === 0
  ) {
    return (
      <>
        <Navbar />
        <main className="shop-loading-page">
          <div className="shop-load-error">
            <h2>Não foi possível carregar os artigos</h2>
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

  return (
    <>
      <Navbar />

      <section className="section shop-page">
        <div className="container">

          {/* CABEÇALHO */}
          <div className="page-heading">
            <p className="eyebrow">Loja online</p>
            <h1>Artigos</h1>
            <p>
              Conheça os nossos artigos disponíveis
              para compra directa.
            </p>
          </div>


          {/* FILTROS */}
          <div className="catalog-toolbar">

            <label className="field field--search">
              <span>Pesquisar</span>
              <input
                type="search"
                placeholder="Pesquisar artigo..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </label>


            <label className="field">
              <span>Categoria</span>
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>


            <label className="field">
              <span>Disponibilidade</span>
              <select
                value={availability}
                onChange={(event) =>
                  setAvailability(event.target.value)
                }
              >
                <option value="todos">Todos</option>
                <option value="disponiveis">Em stock</option>
                <option value="esgotados">Stock esgotado</option>
              </select>
            </label>


            <label className="field">
              <span>Ordenar</span>
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
              >
                <option value="recentes">Mais recentes</option>
                <option value="preco-baixo">Menor preço</option>
                <option value="preco-alto">Maior preço</option>
                <option value="nome">Nome A–Z</option>
              </select>
            </label>

          </div>


          {/* RESULTADOS */}
          <div className="catalog-result-header">
            <p className="catalog-count">
              {filtered.length}{' '}
              {filtered.length === 1
                ? 'artigo encontrado'
                : 'artigos encontrados'}
            </p>
          </div>


          {/* ARTIGOS */}
          {visibleProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {hasMoreProducts && (
                <div className="catalog-load-more">
                  <button
                    type="button"
                    className="button button--secondary button--lg"
                    onClick={() =>
                      setVisibleCount(
                        (current) =>
                          current + PRODUCTS_PER_PAGE,
                      )
                    }
                  >
                    Ver mais artigos
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Nenhum artigo encontrado"
              text="Altere a pesquisa, categoria ou disponibilidade."
            />
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
