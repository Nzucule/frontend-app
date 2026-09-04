import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import api from '../api';
import { defaultSettings } from '../data/defaultData';

const StoreContext = createContext();

const CART_STORAGE_KEY = 'app-artigos-cart';
const ORDERS_STORAGE_KEY = 'app-artigos-pedidos';

/*
 * IMPORTANTE — CONTRATO COM O BACKEND (/produtos)
 * ------------------------------------------------
 * Este contexto fala com a API em "/produtos" seguindo a MESMA
 * convenção de nomes já usada em "/servicos" (nome, descricao,
 * preco, categoria, imagem, imagem_url). Se o teu backend Laravel
 * ainda não tiver esta tabela/rota, cria os campos abaixo, ou
 * ajusta a função normalizeProduct()/saveProduct() para os nomes
 * reais que o teu backend usar.
 *
 * Campos esperados por artigo (request multipart em saveProduct):
 *   nome, descricao, preco, preco_anterior, stock, categoria,
 *   destaque (0/1), activo (0/1), notificar_clientes (0/1),
 *   caracteristicas (JSON em string), imagem (ficheiro)
 *
 * Campos esperados na resposta do GET /produtos (por artigo):
 *   id, nome, descricao, preco, preco_anterior, stock, categoria,
 *   destaque, activo, imagem_url, created_at
 */
function normalizeProduct(raw) {
  if (!raw) return null;

  let features = [];

  if (Array.isArray(raw.caracteristicas)) {
    features = raw.caracteristicas;
  } else if (typeof raw.caracteristicas === 'string' && raw.caracteristicas) {
    try {
      const parsed = JSON.parse(raw.caracteristicas);
      features = Array.isArray(parsed) ? parsed : raw.caracteristicas.split('\n').filter(Boolean);
    } catch {
      features = raw.caracteristicas.split('\n').filter(Boolean);
    }
  } else if (Array.isArray(raw.features)) {
    features = raw.features;
  }

  return {
    id: raw.id,
    name: raw.nome ?? raw.name ?? '',
    category: raw.categoria ?? raw.category ?? '',
    price: Number(raw.preco ?? raw.price ?? 0),
    oldPrice: Number(raw.preco_anterior ?? raw.oldPrice ?? 0),
    stock: Number(raw.stock ?? 0),
    description: raw.descricao ?? raw.description ?? '',
    features,
    image: raw.imagem_url ?? raw.image ?? '',
    featured: Boolean(raw.destaque ?? raw.featured),
    active:
      raw.activo !== undefined
        ? Boolean(Number(raw.activo))
        : raw.active !== undefined
          ? Boolean(raw.active)
          : true,
    notifyCustomers: Boolean(raw.notificar_clientes ?? raw.notifyCustomers),
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  };
}

/*
 * Converte a imagem (guardada como data-URL depois de
 * optimizada em ProductEditorPage.js) num ficheiro,
 * para poder ser enviada como multipart/form-data.
 */
function dataUrlToFile(dataUrl, filename = 'artigo.webp') {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return null;
  }

  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/webp';

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
}

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [cart, setCart] = useState(loadCartFromStorage);
  const [settings] = useState(defaultSettings);

  const refreshStore = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    try {
      const res = await api.get('/produtos');
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setProducts(list.map(normalizeProduct).filter(Boolean));
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
      setApiError(
        error?.response?.data?.message ||
          'Não foi possível carregar os artigos.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStore();
  }, [refreshStore]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const activeProducts = useMemo(
    () => products.filter((product) => product.active),
    [products],
  );

  const cartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = products.find(
          (item) => String(item.id) === String(entry.productId),
        );

        if (!product) return null;

        return {
          productId: product.id,
          quantity: entry.quantity,
          product,
        };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  function addToCart(productId, quantity = 1) {
    const product = products.find(
      (item) => String(item.id) === String(productId),
    );

    if (!product) {
      return { success: false, message: 'Artigo não encontrado.' };
    }

    const stock = Number(product.stock || 0);
    const existing = cart.find(
      (item) => String(item.productId) === String(productId),
    );

    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + quantity;

    if (nextQty > stock) {
      return {
        success: false,
        message: 'Quantidade acima do stock disponível.',
      };
    }

    setCart((current) => {
      if (existing) {
        return current.map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, quantity: nextQty }
            : item,
        );
      }

      return [...current, { productId, quantity }];
    });

    return { success: true };
  }

  function updateCartQuantity(productId, quantity) {
    setCart((current) => {
      if (quantity <= 0) {
        return current.filter(
          (item) => String(item.productId) !== String(productId),
        );
      }

      return current.map((item) =>
        String(item.productId) === String(productId)
          ? { ...item, quantity }
          : item,
      );
    });
  }

  function removeFromCart(productId) {
    setCart((current) =>
      current.filter(
        (item) => String(item.productId) !== String(productId),
      ),
    );
  }

  function clearCart() {
    setCart([]);
  }

  /*
   * ADMIN — criar ou actualizar artigo.
   * Segue o mesmo padrão de "/servicos": POST para criar,
   * POST com "?_method=PUT" para actualizar (Laravel).
   */
  async function saveProduct(data) {
    const formData = new FormData();

    formData.append('nome', data.name);
    formData.append('descricao', data.description);
    formData.append('preco', data.price);
    formData.append('preco_anterior', data.oldPrice || 0);
    formData.append('stock', data.stock);
    formData.append('categoria', data.category);
    formData.append('destaque', data.featured ? 1 : 0);
    formData.append('activo', data.active ? 1 : 0);
    formData.append('notificar_clientes', data.notifyCustomers ? 1 : 0);
    formData.append('caracteristicas', JSON.stringify(data.features || []));

    const imageFile = dataUrlToFile(
      data.image,
      `${(data.name || 'artigo').toLowerCase().replace(/\s+/g, '-')}.webp`,
    );

    if (imageFile) {
      formData.append('imagem', imageFile);
    }

    if (data.id) {
      await api.post(`/produtos/${data.id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await api.post('/produtos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    await refreshStore();
  }

  async function deleteProduct(id) {
    await api.delete(`/produtos/${id}`);
    await refreshStore();
  }

  async function toggleProduct(id) {
    const product = products.find((item) => String(item.id) === String(id));
    if (!product) return;

    const formData = new FormData();
    formData.append('activo', product.active ? 0 : 1);

    await api.post(`/produtos/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    await refreshStore();
  }

  /*
   * Pedidos — tenta enviar para "/pedidos". Se essa rota ainda
   * não existir no backend, o pedido é guardado localmente
   * (localStorage) para o fluxo de compra continuar a funcionar
   * durante os testes. Assim que existir a rota real, os pedidos
   * passam a ser criados no backend automaticamente.
   */
  async function placeOrder(orderData) {
    const items = cartItems.map(({ product, quantity }) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    }));

    const deliveryFee =
      cartSubtotal >= Number(settings.freeDeliveryFrom)
        ? 0
        : Number(settings.deliveryFee);

    const orderPayload = {
      ...orderData,
      items,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartSubtotal + deliveryFee,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.post('/pedidos', orderPayload);
      const order = { id: res.data.id, ...orderPayload, ...res.data };

      clearCart();

      return order;
    } catch (error) {
      console.warn(
        'Endpoint /pedidos indisponível, a guardar o pedido localmente:',
        error?.message,
      );

      const localId = `local-${Date.now()}`;
      const order = { id: localId, ...orderPayload };

      try {
        const stored = JSON.parse(
          localStorage.getItem(ORDERS_STORAGE_KEY) || '{}',
        );

        stored[localId] = order;

        localStorage.setItem(
          ORDERS_STORAGE_KEY,
          JSON.stringify(stored),
        );
      } catch (storageError) {
        console.error(
          'Não foi possível guardar o pedido localmente:',
          storageError,
        );
      }

      clearCart();

      return order;
    }
  }

  async function fetchOrder(orderId) {
    try {
      const res = await api.get(`/pedidos/${orderId}`);
      return res.data;
    } catch {
      try {
        const stored = JSON.parse(
          localStorage.getItem(ORDERS_STORAGE_KEY) || '{}',
        );

        return stored[orderId] || null;
      } catch {
        return null;
      }
    }
  }

  const value = {
    products,
    activeProducts,
    loading,
    apiError,
    refreshStore,
    saveProduct,
    deleteProduct,
    toggleProduct,
    cartItems,
    cartSubtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    fetchOrder,
    settings,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      'useStore deve ser usado dentro de um <StoreProvider>.',
    );
  }

  return context;
}
