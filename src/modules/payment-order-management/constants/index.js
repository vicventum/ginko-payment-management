export const ORDER_STATUSES = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
}

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
