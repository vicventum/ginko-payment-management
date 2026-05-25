<script setup>
import { computed } from 'vue'
import { useOrderDetail } from '@/modules/payment-order-management/api/composables/use-order-detail.js'
import { ORDER_TRANSITIONS } from '@/modules/payment-order-management/constants/index.js'
import { formatAmount, formatDate } from '@/modules/_core/utils/format.js'
import { transitionLabel, transitionColor, transitionIcon } from '@/modules/payment-order-management/utils/order.js'
import BCard from '@/modules/_core/components/b/card/b-card.vue'
import DCardHeader from '@/modules/_core/components/d/card/d-card-header.vue'
import CBadgeStatus from '@/modules/_core/components/c/badge/c-badge-status.vue'

const props = defineProps({
  orderId: { type: String, required: true },
})

defineEmits(['on-back', 'on-transition'])

const { data, isLoading, isError, error, refresh } = useOrderDetail(props.orderId)

defineExpose({ refresh })

const allowedTransitions = computed(() => {
  if (!data.value) return []
  return ORDER_TRANSITIONS[data.value.status] ?? []
})
</script>

<template>
  <div>
    <DCardHeader
      title="Detalle de orden"
      :subtitle="data?.provider"
      back
      @on-back="$emit('on-back')"
    />

    <template v-if="isLoading">
      <div class="space-y-4">
        <USkeleton class="h-8 w-48" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-20 w-full" />
      </div>
    </template>

    <UAlert
      v-else-if="isError"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      title="Error al cargar la orden"
      :description="error?.message"
    />

    <BCard v-else-if="data">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div class="min-w-0">
            <h3 class="truncate text-lg font-semibold text-highlighted">
              {{ data.provider }}
            </h3>
            <p class="text-xs text-muted">
              ID: {{ data.id }} &middot; Creada {{ formatDate(data.createdAt) }}
            </p>
          </div>
          <CBadgeStatus :status="data.status" size="lg" />
        </div>
      </template>

      <dl class="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <dt class="text-xs font-medium text-muted">Monto</dt>
          <dd class="mt-0.5 text-sm font-semibold text-highlighted">
            {{ formatAmount(data.amount, data.currency) }}
          </dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-muted">Moneda</dt>
          <dd class="mt-0.5 text-sm text-default">{{ data.currency }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-xs font-medium text-muted">Concepto</dt>
          <dd class="mt-0.5 text-sm text-default">{{ data.concept }}</dd>
        </div>
      </dl>

      <template #footer>
        <div class="flex items-center gap-2">
          <UButton icon="i-lucide-arrow-left" label="Volver" color="neutral" variant="outline" @click="$emit('on-back')" />
          <div class="flex-1" />
          <UButton
            v-for="t in allowedTransitions"
            :key="t"
            :label="transitionLabel(t)"
            :color="transitionColor(t)"
            :icon="transitionIcon(t)"
            @click="$emit('on-transition', { id: data.id, from: data.status, to: t })"
          />
        </div>
      </template>
    </BCard>
  </div>
</template>
