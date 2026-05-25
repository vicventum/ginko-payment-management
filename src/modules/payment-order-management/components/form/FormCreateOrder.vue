<script setup>
import { reactive, computed } from 'vue'
import { useCreateOrder } from '@/modules/payment-order-management/api/composables/use-create-order.js'
import { createOrderSchema } from '@/modules/payment-order-management/schemas/order.schema.js'
import FieldsOrderForm from '@/modules/payment-order-management/components/fields/FieldsOrderForm.vue'

const emit = defineEmits(['on-created', 'on-cancel'])

const state = reactive({
  provider: '',
  amount: null,
  currency: 'COP',
  concept: '',
})

const schema = createOrderSchema

const { mutateAsync, isPending, error } = useCreateOrder({
  meta: {
    showSuccessToast: true,
    successMessage: (data, variables) => `La orden para "${variables.provider}" fue creada con éxito`,
    errorMessage: 'No se pudo crear la orden',
  },
})

/** @type {import('vue').ComputedRef<boolean>} */
const isFormInvalid = computed(() => {
  const result = schema.safeParse(state)
  return !result.success
})

async function handleSubmit(event) {
  try {
    await mutateAsync(event.data)
    emit('on-created', event.data)
    state.provider = ''
    state.amount = null
    state.currency = 'COP'
    state.concept = ''
  } catch {
    // Error toast ya manejado por useMutation
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="handleSubmit">
    <FieldsOrderForm v-model="state" />

    <div v-if="error" class="rounded-lg bg-error/10 p-3 text-sm text-error">
      {{ error.message || 'Error al crear la orden' }}
    </div>

    <div class="flex items-center justify-end gap-3">
      <UButton label="Cancelar" color="neutral" variant="outline" :disabled="isPending" @click="$emit('on-cancel')" />
      <UButton type="submit" label="Crear orden" :loading="isPending" :disabled="isFormInvalid || isPending" icon="i-lucide-plus" />
    </div>
  </UForm>
</template>
