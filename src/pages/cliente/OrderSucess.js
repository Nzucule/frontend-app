import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../styles/Loja.css';
import { useEffect, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
} from 'react-router-dom';

import Button from '../../components/Button';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { whatsappUrl } from '../../utils/contact';
import { downloadOrderInvoice } from '../../utils/invoice';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();

  const {
    settings,
    fetchOrder,
  } = useStore();

  const [order, setOrder] = useState(
    () => location.state?.order || null,
  );

  const [loading, setLoading] = useState(!order);
  const [loadError, setLoadError] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');

  useEffect(() => {
    if (order) {
      return undefined;
    }

    let active = true;

    async function loadOrder() {
      try {
        setLoading(true);
        setLoadError('');

        const loadedOrder = await fetchOrder(orderId);

        if (active) {
          setOrder(loadedOrder || null);
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);

        if (active) {
          setLoadError(
            'Não foi possível carregar os dados do pedido.',
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [order, orderId, fetchOrder]);

  function handleDownloadInvoice() {
    try {
      setInvoiceError('');
      setInvoiceLoading(true);

      downloadOrderInvoice(order, settings);
    } catch (error) {
      console.error('Erro ao gerar factura:', error);

      setInvoiceError(
        error?.message ||
          'Não foi possível gerar a factura. Tente novamente.',
      );
    } finally {
      setInvoiceLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="order-result-page">
          <section className="section">
            <div className="container order-result-state">
              <span className="order-result-loader" />

              <h1>A carregar pedido…</h1>

              <p>
                Estamos a preparar os dados da sua encomenda.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="order-result-page">
          <section className="section">
            <div className="container order-result-state">
              <div className="order-result-state__icon">
                !
              </div>

              <h1>Pedido não encontrado</h1>

              <p>
                {loadError ||
                  'Não foi possível localizar esta encomenda.'}
              </p>

              <Link
                to="/"
                className="button button--primary button--lg"
              >
                Voltar ao início
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const orderNumber =
    order.orderNumber ||
    order.order_number ||
    order.id;

  const customerName =
    order.customer?.name ||
    order.customerName ||
    'Cliente';

  const message = [
    'Olá.',
    `Acabei de fazer o pedido ${orderNumber},`,
    `no valor estimado de ${formatCurrency(order.total)}.`,
  ].join(' ');

  const whatsappLink = whatsappUrl(
    settings?.whatsapp,
    message,
  );

  return (
    <>
      <Navbar />
      <main className="order-success-page">
      <section className="section order-success-section">
        <div className="container">
          <article className="order-success-card">
            <div className="order-success-card__status">
              <div className="order-success-card__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              <div>
                <p className="eyebrow">
                  Pedido recebido
                </p>

                <span>
                  Aguardando confirmação da loja
                </span>
              </div>
            </div>

            <header className="order-success-card__header">
              <h1>
                Obrigado, {customerName}.
              </h1>

              <p>
                A sua encomenda foi registada com sucesso.
                A loja entrará em contacto para confirmar a
                disponibilidade, a entrega e o pagamento.
              </p>
            </header>

            <div className="order-success-details">
              <article>
                <span>Número do pedido</span>
                <strong>{orderNumber}</strong>
              </article>

              <article>
                <span>Total estimado</span>
                <strong>
                  {formatCurrency(order.total)}
                </strong>
              </article>

              <article>
                <span>Estado</span>
                <strong className="order-success-status">
                  Recebido
                </strong>
              </article>
            </div>

            <div className="order-success-invoice">
              <div className="order-success-invoice__icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 2h9l3 3v17H6Z" />
                  <path d="M14 2v4h4" />
                  <path d="M9 11h6M9 15h6M9 19h4" />
                </svg>
              </div>

              <div className="order-success-invoice__content">
                <strong>Factura proforma disponível</strong>

                <p>
                  Baixe o resumo completo da encomenda em
                  formato PDF, incluindo os produtos, quantidades
                  e o valor estimado.
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                className="order-success-invoice__button"
                onClick={handleDownloadInvoice}
                disabled={invoiceLoading}
              >
                {invoiceLoading
                  ? 'A gerar…'
                  : 'Baixar factura'}
              </Button>
            </div>

            {invoiceError && (
              <div
                className="order-success-error"
                role="alert"
              >
                {invoiceError}
              </div>
            )}

            <div className="order-success-actions">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="button button--primary button--lg"
              >
                Confirmar no WhatsApp
              </a>

              <Link
                to="/artigos"
                className="button button--secondary button--lg"
              >
                Continuar a comprar
              </Link>
            </div>

            <p className="order-success-card__note">
              Guarde o número do pedido para futuras consultas.
              A factura proforma não confirma o pagamento nem
              substitui a factura final da venda.
            </p>
          </article>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}