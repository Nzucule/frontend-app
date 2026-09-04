import { buildOrderInvoiceDoc } from '../services/invoiceService';

/*
 * Gera e descarrega directamente a factura proforma
 * de um pedido no navegador do cliente.
 */
export function downloadOrderInvoice(order, settings = {}) {
  const doc = buildOrderInvoiceDoc(order, settings);
  const orderNumber = order.orderNumber || order.order_number || order.id;

  doc.save(`pedido-${orderNumber}.pdf`);
}
