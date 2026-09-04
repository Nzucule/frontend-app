/*
 * Métodos de pagamento disponíveis no checkout.
 * "available: false" mostra o método como indisponível
 * (útil para activar M-Pesa/e-Mola futuramente).
 */
export const PAYMENT_METHODS = [
  {
    id: 'contact',
    name: 'A combinar por contacto',
    description: 'A nossa equipa entra em contacto para combinar o pagamento.',
    available: true,
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pagamento por M-Pesa após confirmação do pedido.',
    badge: 'Em breve',
    available: false,
  },
  {
    id: 'emola',
    name: 'e-Mola',
    description: 'Pagamento por e-Mola após confirmação do pedido.',
    badge: 'Em breve',
    available: false,
  },
];
