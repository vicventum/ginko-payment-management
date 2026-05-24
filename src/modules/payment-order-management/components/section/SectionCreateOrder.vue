<template>
  <div>
    <div class="mb-6 flex items-center gap-3">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="$emit('cancel')" />
      <div>
        <h2 class="text-lg font-semibold text-highlighted">Nueva orden de pago</h2>
        <p class="text-sm text-muted">Completá los datos para crear una nueva orden</p>
      </div>
    </div>

    <UCard>
      <FormCreateOrder @created="onCreated" @cancel="$emit('cancel')" />
    </UCard>
  </div>
</template>

<script setup>
import FormCreateOrder from '../form/FormCreateOrder.vue'

const emit = defineEmits(['created', 'cancel'])

function onCreated(payload) {
  emit('created', payload)
}
</script>
