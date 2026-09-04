import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { useStore } from '../../context/StoreContext';
import { PAYMENT_METHODS } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/Loja.css';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  city: 'Maputo',
  address: '',
  reference: '',
  notes: '',
  marketingConsent: false,
};

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, settings, placeOrder } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState('contact');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!cartItems.length) return <Navigate to="/carrinho" replace />;

  const deliveryFee = cartSubtotal >= Number(settings.freeDeliveryFrom) ? 0 : Number(settings.deliveryFee);
  const total = cartSubtotal + deliveryFee;

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Preencha o nome, telefone e endereço de entrega.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await placeOrder({
        customer: { name: form.name, phone: form.phone, email: form.email, marketingConsent: form.marketingConsent },
        delivery: { city: form.city, address: form.address, reference: form.reference },
        notes: form.notes,
        paymentMethod,
      });
      navigate(`/pedido-confirmado/${order.id}`, { state: { order } });
    } catch (err) {
      setError(err.message || 'Não foi possível concluir o pedido.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <section className="section">
        <div className="container">
          <div className="page-heading">
            <p className="eyebrow">Último passo</p>
            <h1>Finalizar encomenda</h1>
            <p>Os dados serão usados para confirmar o pedido e organizar a entrega.</p>
          </div>
          <form className="checkout-layout" onSubmit={submit}>
            <div className="checkout-form">
              <section className="form-card">
                <h2>Dados do cliente</h2>
                <div className="form-grid">
                  <label className="field field--wide"><span>Nome completo *</span><input name="name" value={form.name} onChange={updateField} /></label>
                  <label className="field"><span>Telefone *</span><input name="phone" value={form.phone} onChange={updateField} placeholder="84 000 0000" /></label>
                  <label className="field"><span>E-mail</span><input type="email" name="email" value={form.email} onChange={updateField} /></label>
                  <label className="check-row field--wide"><input type="checkbox" name="marketingConsent" checked={form.marketingConsent} onChange={updateField} /><span><strong>Quero receber novidades e promoções</strong><small>Pode cancelar a qualquer momento através dos e-mails.</small></span></label>
                </div>
              </section>

              <section className="form-card">
                <h2>Entrega</h2>
                <div className="form-grid">
                  <label className="field"><span>Cidade</span><input name="city" value={form.city} onChange={updateField} /></label>
                  <label className="field field--wide"><span>Endereço *</span><input name="address" value={form.address} onChange={updateField} placeholder="Bairro, avenida, número" /></label>
                  <label className="field field--wide"><span>Ponto de referência</span><input name="reference" value={form.reference} onChange={updateField} /></label>
                  <label className="field field--wide"><span>Observações</span><textarea name="notes" rows="4" value={form.notes} onChange={updateField} /></label>
                </div>
              </section>

              <section className="form-card">
                <h2>Pagamento</h2>
                <div className="payment-options">
                  {PAYMENT_METHODS.map((method) => (
                    <label className={`payment-option ${!method.available ? 'payment-option--disabled' : ''}`} key={method.id}>
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        disabled={!method.available}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                      />
                      <span>
                        <strong>{method.name}</strong>
                        <small>{method.description}</small>
                      </span>
                      {method.badge && <em>{method.badge}</em>}
                    </label>
                  ))}
                </div>
              </section>
              {error && <div className="alert alert--error">{error}</div>}
            </div>

            <aside className="order-summary checkout-summary">
              <h2>O seu pedido</h2>
              {cartItems.map(({ product, quantity }) => (
                <div className="checkout-line" key={product.id}>
                  <span>{quantity} × {product.name}</span>
                  <strong>{formatCurrency(product.price * quantity)}</strong>
                </div>
              ))}
              <hr />
              <div><span>Subtotal</span><strong>{formatCurrency(cartSubtotal)}</strong></div>
              <div><span>Entrega estimada</span><strong>{deliveryFee ? formatCurrency(deliveryFee) : 'Grátis'}</strong></div>
              <div className="order-summary__total"><span>Total estimado</span><strong>{formatCurrency(total)}</strong></div>
              <Button type="submit" size="lg" className="full-width" disabled={submitting}>
                {submitting ? 'A concluir…' : 'Enviar encomenda'}
              </Button>
              <p className="summary-note">Ao enviar, o pagamento ainda não é cobrado. A nossa equipa entrará em contacto para confirmar.</p>
            </aside>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
