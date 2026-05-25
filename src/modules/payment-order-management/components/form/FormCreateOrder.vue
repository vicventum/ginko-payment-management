<template>
  <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
    <FieldsOrderForm v-model="state" />

    <div v-if="error" class="rounded-lg bg-error/10 p-3 text-sm text-error">
      {{ error.message || 'Error al crear la orden' }}
    </div>

    <div class="flex items-center justify-end gap-3">
      <UButton label="Cancelar" color="neutral" variant="outline" :disabled="isPending" @click="$emit('cancel')" />
      <UButton type="submit" label="Crear orden" :loading="isPending" :disabled="isFormInvalid || isPending" icon="i-lucide-plus" />
    </div>
  </UForm>
</template>

<script setup>
import * as z from 'zod'
import { reactive, computed } from 'vue'
import { useCreateOrder } from '../../api/composables/use-create-order.js'
import FieldsOrderForm from '../fields/FieldsOrderForm.vue'

const emit = defineEmits(['created', 'cancel'])

const schema = z.object({
  provider: z.string().min(1, 'El proveedor es obligatorio'),
  amount: z.number({ invalid_type_error: 'El monto debe ser un número' })
    .positive('El monto debe ser mayor a 0'),
  currency: z.string().min(1, 'Seleccioná una moneda'),
  concept: z.string()
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(250, 'El concepto no puede superar los 250 caracteres'),
})

const state = reactive({
  provider: '',
  amount: null,
  currency: 'ARS',
  concept: '',
})

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

async function onSubmit(event) {
  try {
    await mutateAsync(event.data)
    emit('created', event.data)
    state.provider = ''
    state.amount = null
    state.currency = 'ARS'
    state.concept = ''
  } catch {
    // Error toast ya manejado por useMutation
  }
}
</script>
