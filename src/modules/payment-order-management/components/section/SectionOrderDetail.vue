<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="$emit('back')" />
      <div>
        <h2 class="text-lg font-semibold text-highlighted">Detalle de orden</h2>
        <p v-if="data" class="text-sm text-muted">{{ data.provider }}</p>
      </div>
    </div>

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

    <UCard v-else-if="data">
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
          <UBadge :color="statusColor(data.status)" variant="subtle" size="lg">
            {{ statusLabel(data.status) }}
          </UBadge>
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
          <UButton icon="i-lucide-arrow-left" label="Volver" color="neutral" variant="outline" @click="$emit('back')" />
          <div class="flex-1" />
          <UButton
            v-for="t in allowedTransitions"
            :key="t"
            :label="transitionLabel(t)"
            :color="transitionColor(t)"
            :icon="transitionIcon(t)"
            @click="$emit('transition', { id: data.id, from: data.status, to: t })"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderDetail } from '../../api/composables/use-order-detail.js'
import { ORDER_STATE_MACHINE } from '../../types/api/state-machine.response.js'

const props = defineProps({
  orderId: { type: String, required: true },
})

defineEmits(['back', 'transition'])

const { data, isLoading, isError, error, refresh } = useOrderDetail(props.orderId)

defineExpose({ refresh })

const allowedTransitions = computed(() => {
  if (!data.value) return []
  return ORDER_STATE_MACHINE.getAllowedTransitions(data.value.status)
})

function statusColor(status) {
  const map = { draft: 'warning', approved: 'info', paid: 'success', rejected: 'error' }
  return map[status] || 'neutral'
}

function statusLabel(status) {
  const map = { draft: 'Borrador', approved: 'Aprobado', paid: 'Pagado', rejected: 'Rechazado' }
  return map[status] || status
}

function transitionLabel(status) {
  const labels = { approved: 'Aprobar', paid: 'Marcar como pagado', rejected: 'Rechazar' }
  return labels[status] || status
}

function transitionColor(status) {
  const colors = { approved: 'success', paid: 'success', rejected: 'error' }
  return colors[status] || 'neutral'
}

function transitionIcon(status) {
  const icons = { approved: 'i-lucide-check', paid: 'i-lucide-check-circle', rejected: 'i-lucide-x' }
  return icons[status] || ''
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
