import { ORDER_STATUS_STYLES, TRANSITION_LABELS, TRANSITION_COLORS, TRANSITION_ICONS } from '@/modules/payment-order-management/constants/index.js'

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
