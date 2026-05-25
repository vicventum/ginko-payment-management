<template>
  <BModal
    v-model:open="isOpen"
    :title="title"
    :description="description"
    :text="text"
    :confirm-label="confirmLabel"
    :cancel-label="cancelLabel"
    :state="state"
    :schema="schema"
    :loading="loading"
    confirm-color="error"
    :block="true"
    @confirm="emit('confirm')"
    @update:open="emit('update:open', $event)"
  >
    <slot v-if="!text" />
  </BModal>
</template>

<script setup>
import BModal from '@/modules/_core/components/b/modal/b-modal.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  text: { type: String, default: '' },
  state: { type: Object, default: null },
  schema: { type: Object, default: null },
  confirmLabel: { type: String, default: 'Eliminar' },
  cancelLabel: { type: String, default: 'Cancelar' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'update:open'])

const isOpen = defineModel('open', { default: false })
</script>
