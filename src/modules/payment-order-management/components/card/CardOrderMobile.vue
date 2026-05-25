<script setup>
import { formatAmount, formatDate } from '@/modules/_core/utils/format.js'
import CBadgeStatus from '@/modules/_core/components/c/badge/c-badge-status.vue'

defineProps({
  order: {
    type: Object,
    required: true,
  },
})

defineEmits(['on-click'])
</script>

<template>
  <UCard
    class="cursor-pointer transition hover:bg-muted"
    @click="$emit('on-click', order.id)"
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
        <CBadgeStatus :status="order.status" size="sm" />
        <span class="text-sm font-semibold text-highlighted">
          {{ formatAmount(order.amount, order.currency) }}
        </span>
      </div>
    </div>
  </UCard>
</template>
