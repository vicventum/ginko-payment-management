<template>
  <BBadge
    :value="status"
    :styles="STATUS_STYLES"
    :size="size"
  />
</template>

<script setup>
import BBadge from '@/modules/_core/components/b/badge/b-badge.vue'

defineProps({
  status: { type: String, required: true },
  size: { type: String, default: 'sm' },
})

const STATUS_STYLES = {
  draft: { color: 'warning', label: 'Borrador' },
  approved: { color: 'info', label: 'Aprobado' },
  paid: { color: 'success', label: 'Pagado' },
  rejected: { color: 'error', label: 'Rechazado' },
}
</script>
