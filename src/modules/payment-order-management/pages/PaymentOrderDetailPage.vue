<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <section class="mb-8">
      <SectionOrderDetail
        ref="detailRef"
        :order-id="id"
        @back="onBack"
        @transition="onTransition"
      />
    </section>

    <DialogConfirmTransition
      :open="confirmOpen"
      :title="confirmTitle"
      :description="confirmDescription"
      :confirm-label="confirmLabel"
      :confirm-color="confirmColor"
      :loading="transitioning"
      @update:open="confirmOpen = $event"
      @confirm="executeTransition"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { transitionOrderState } from '../api/services/service-state-machine.js'
import { ORDER_STATUSES } from '../types/api/order.response.js'
import { useUpdateOrder } from '../api/composables/use-update-order.js'
import SectionOrderDetail from '../components/section/SectionOrderDetail.vue'
import DialogConfirmTransition from '../components/dialog/DialogConfirmTransition.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const detailRef = ref(null)
const confirmOpen = ref(false)

const pendingTransition = ref(null)

const transitionLabels = {
  [ORDER_STATUSES.APPROVED]: 'Aprobar',
  [ORDER_STATUSES.PAID]: 'Marcar como pagado',
  [ORDER_STATUSES.REJECTED]: 'Rechazar',
}

const transitionColors = {
  [ORDER_STATUSES.APPROVED]: 'success',
  [ORDER_STATUSES.PAID]: 'success',
  [ORDER_STATUSES.REJECTED]: 'error',
}

const statusSuccessLabels = {
  [ORDER_STATUSES.APPROVED]: 'aprobada',
  [ORDER_STATUSES.PAID]: 'pagada',
  [ORDER_STATUSES.REJECTED]: 'rechazada',
}

const confirmTitle = computed(() => {
  if (!pendingTransition.value) return ''
  return `¿${transitionLabels[pendingTransition.value.to] || pendingTransition.value.to}?`
})

const confirmDescription = computed(() => {
  if (!pendingTransition.value) return ''
  return `La orden pasará de "${pendingTransition.value.from}" a "${pendingTransition.value.to}".`
})

const confirmLabel = computed(() => {
  if (!pendingTransition.value) return 'Confirmar'
  return transitionLabels[pendingTransition.value.to] || 'Confirmar'
})

const confirmColor = computed(() => {
  if (!pendingTransition.value) return 'primary'
  return transitionColors[pendingTransition.value.to] || 'primary'
})

function onBack() {
  router.push({ name: 'payment-order-list' })
}

function onTransition({ id: orderId, from, to }) {
  pendingTransition.value = { from, to }
  confirmOpen.value = true
}

const afterTransition = () => {
  confirmOpen.value = false
  pendingTransition.value = null
  detailRef.value?.refresh()
}

const { mutateAsync, isPending: transitioning } = useUpdateOrder({
  onSuccess: (data, variables) => {
    afterTransition()
  },
  meta: {
    showSuccessToast: true,
    successMessage: (data, variables) =>
      `La orden fue ${statusSuccessLabels[variables.status] || variables.status} con éxito.`,
  },
})

async function executeTransition() {
  if (!pendingTransition.value) return

  try {
    const newStatus = transitionOrderState(
      pendingTransition.value.from,
      pendingTransition.value.to,
    )
    await mutateAsync({ id: props.id, status: newStatus })
  } catch {
    // Error toast ya manejado por useMutation
  }
}
</script>
