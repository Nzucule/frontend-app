/*
 * Constrói um link do WhatsApp com mensagem pré-preenchida.
 */
export function whatsappUrl(phone, message = '') {
  const digits = String(phone || '').replace(/\D/g, '');

  if (!digits) {
    return '#';
  }

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${digits}?text=${encodedMessage}`;
}
