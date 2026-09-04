/*
 * Formata valores monetários em Metical (MZN).
 */
export function formatCurrency(value) {
  const number = Number(value || 0);

  try {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 2,
    }).format(number);
  } catch (error) {
    // Fallback caso o browser não suporte o locale pt-MZ
    return `${number.toFixed(2)} MT`;
  }
}
