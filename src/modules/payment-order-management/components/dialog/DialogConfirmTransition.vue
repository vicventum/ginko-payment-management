<template>
  <UModal
    :open="open"
    :title="title"
    :description="description"
    :ui="{ footer: 'justify-end' }"
    @update:open="v => $emit('update:open', v)"
  >
    <template #footer>
      <UButton :label="cancelLabel" color="neutral" variant="outline" :disabled="loading" @click="onCancel" />
      <UButton :label="confirmLabel" :color="confirmColor" :loading="loading" @click="onConfirm" />
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirmar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  confirmColor: { type: String, default: 'primary' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'confirm'])

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('update:open', false)
}
</script>
