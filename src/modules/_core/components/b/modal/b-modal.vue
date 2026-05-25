<template>
  <UModal
    v-model:open="isOpen"
    :title="title"
    :description="description"
    :class="['w-lg', props.class]"
  >
    <template #header>
      <slot v-if="$slots.header" name="header" />
    </template>

    <template #body>
      <component
        :is="state ? UForm : 'section'"
        v-bind="formProps"
        @submit="handleSubmit"
      >
        <p v-if="text">
          {{ text }}
        </p>
        <slot v-else />
      </component>
    </template>

    <template v-if="hasFooter" #footer>
      <slot v-if="$slots.footer" name="footer" />
      <DActionButtons
        v-else
        :primary-label="confirmLabel"
        :primary-color="confirmColor"
        :secondary-label="cancelLabel"
        :loading="loading"
        :disabled="disabled"
        :block="block"
        :class="['flex w-full justify-end gap-x-2', classButtons]"
        @primary="handleConfirm"
        @secondary="handleCancel"
      />
    </template>
  </UModal>
</template>

<script setup>
import { computed } from 'vue'
import DActionButtons from '@/modules/_core/components/d/action-buttons/d-action-buttons.vue'

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  text: { type: String, default: '' },
  state: { type: Object, default: null },
  schema: { type: Object, default: null },
  confirmLabel: { type: String, default: 'Guardar' },
  confirmColor: { type: String, default: 'primary' },
  cancelLabel: { type: String, default: 'Cancelar' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  hasFooter: { type: Boolean, default: true },
  classButtons: { type: String, default: '' },
  class: { type: String, default: '' },
})

const emit = defineEmits(['confirm', 'update:open'])

const isOpen = defineModel('open', { default: false })

const formProps = computed(() => {
  if (!props.state) return {}
  return { state: props.state, schema: props.schema }
})

function handleSubmit() {
  emit('confirm')
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  isOpen.value = false
  emit('update:open', false)
}
</script>
