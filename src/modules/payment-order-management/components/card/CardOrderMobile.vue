<template>
  <UCard
    class="cursor-pointer transition hover:bg-muted"
    @click="$emit('click', order.id)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-sm font-medium text-highlighted">
          {{ order.provider }}
        </h3>
        <p class="mt-1 truncate text-xs text-muted">
          {{ formatDate(order.createdAt) }}
        </p>
        <p class="mt-2 line-clamp-2 text-sm text-default">
          {{ order.concept }}
        </p>
      </div>

      <div class="flex shrink-0 flex-col items-end gap-2">
        <UBadge :color="statusColor(order.status)" variant="subtle" size="sm">
          {{ statusLabel(order.status) }}
        </UBadge>
        <span class="text-sm font-semibold text-highlighted">
          {{ formatAmount(order.amount, order.currency) }}
        </span>
      </div>
    </div>
  </UCard>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

function statusColor(status) {
  const map = { draft: 'warning', approved: 'info', paid: 'success', rejected: 'error' }
  return map[status] || 'neutral'
}

function statusLabel(status) {
  const map = { draft: 'Borrador', approved: 'Aprobado', paid: 'Pagado', rejected: 'Rechazado' }
  return map[status] || status
}

function formatAmount(amount, currency) {
  if (!currency) {
    return new Intl.NumberFormat('es-AR').format(amount ?? 0)
  }
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount ?? 0)
  } catch {
    return new Intl.NumberFormat('es-AR').format(amount ?? 0)
  }
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(dateStr))
}
</script>
