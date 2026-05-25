/**
 * Formatea un monto numérico con locale es-AR.
 * @param {number|null|undefined} amount
 * @param {string} [currency]
 * @returns {string}
 */
export function formatAmount(amount, currency) {
  if (!currency) {
    return new Intl.NumberFormat('es-AR').format(amount ?? 0)
  }
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount ?? 0)
  } catch {
    return new Intl.NumberFormat('es-AR').format(amount ?? 0)
  }
}

/**
 * Formatea una fecha ISO con locale es-AR.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(dateStr))
}
