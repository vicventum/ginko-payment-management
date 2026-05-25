export const ORDER_STATUS_STYLES = {
  draft: { color: 'warning', label: 'Borrador' },
  approved: { color: 'info', label: 'Aprobado' },
  paid: { color: 'success', label: 'Pagado' },
  rejected: { color: 'error', label: 'Rechazado' },
}

export const TRANSITION_LABELS = {
  approved: 'Aprobar',
  paid: 'Marcar como pagado',
  rejected: 'Rechazar',
}

export const TRANSITION_COLORS = {
  approved: 'success',
  paid: 'success',
  rejected: 'error',
}

export const TRANSITION_ICONS = {
  approved: 'i-lucide-check',
  paid: 'i-lucide-check-circle',
  rejected: 'i-lucide-x',
}

export const TRANSITION_SUCCESS_LABELS = {
  approved: 'aprobada',
  paid: 'pagada',
  rejected: 'rechazada',
}

/** @param {string} status */
export function statusColor(status) {
  return ORDER_STATUS_STYLES[status]?.color || 'neutral'
}

/** @param {string} status */
export function statusLabel(status) {
  return ORDER_STATUS_STYLES[status]?.label || status
}

/** @param {string} status */
export function transitionLabel(status) {
  return TRANSITION_LABELS[status] || status
}

/** @param {string} status */
export function transitionColor(status) {
  return TRANSITION_COLORS[status] || 'primary'
}

/** @param {string} status */
export function transitionIcon(status) {
  return TRANSITION_ICONS[status] || ''
}
