import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '../utils/formatters';

/*
 * Constrói o documento PDF (factura proforma) de um pedido.
 * Devolve a instância jsPDF para quem chamar decidir
 * se quer descarregar, abrir numa nova aba ou obter o blob.
 */
export function buildOrderInvoiceDoc(order, settings = {}) {
  if (!order) {
    throw new Error('Pedido inválido para gerar a factura.');
  }

  const doc = new jsPDF();
  const storeName = settings.storeName || 'ALL PEST PROTECT';
  const orderNumber = order.orderNumber || order.order_number || order.id;

  doc.setFontSize(16);
  doc.text(storeName, 14, 18);

  doc.setFontSize(11);
  doc.text('Factura Proforma', 14, 26);
  doc.text(`Pedido: ${orderNumber}`, 14, 33);
  doc.text(
    `Data: ${new Date(order.createdAt || Date.now()).toLocaleDateString('pt-PT')}`,
    14,
    39,
  );

  doc.text(`Cliente: ${order.customer?.name || ''}`, 14, 49);
  doc.text(`Telefone: ${order.customer?.phone || ''}`, 14, 55);

  if (order.delivery?.address) {
    doc.text(
      `Entrega: ${order.delivery.address}, ${order.delivery.city || ''}`,
      14,
      61,
    );
  }

  const rows = (order.items || []).map((item) => [
    item.name,
    String(item.quantity),
    formatCurrency(item.price),
    formatCurrency(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['Artigo', 'Qtd.', 'Preço unit.', 'Total']],
    body: rows,
    headStyles: { fillColor: [11, 79, 108] },
  });

  const finalY = doc.lastAutoTable?.finalY || 80;

  doc.setFontSize(12);
  doc.text(
    `Total estimado: ${formatCurrency(order.total)}`,
    14,
    finalY + 12,
  );

  doc.setFontSize(9);
  doc.text(
    'Esta factura proforma não confirma o pagamento nem substitui a factura final da venda.',
    14,
    finalY + 22,
  );

  return doc;
}

/*
 * Gera o PDF do pedido e devolve o blob,
 * útil para enviar por e-mail ou pré-visualizar.
 */
export function generateOrderInvoicePdf(order, settings = {}) {
  const doc = buildOrderInvoiceDoc(order, settings);
  return doc.output('blob');
}
