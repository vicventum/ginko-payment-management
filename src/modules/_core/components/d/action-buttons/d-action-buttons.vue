<template>
  <div
    :class="[
      'flex gap-3',
      block ? 'flex-col' : 'items-center justify-end',
    ]"
  >
    <UButton
      :label="secondaryLabel"
      :icon="secondaryIcon"
      color="neutral"
      variant="outline"
      :disabled="loading"
      @click="$emit('secondary')"
    />
    <UButton
      :label="primaryLabel"
      :icon="primaryIcon"
      :color="primaryColor"
      :loading="loading"
      :disabled="disabled || loading"
      @click="$emit('primary')"
    />
  </div>
</template>

<script setup>
defineProps({
  primaryLabel: { type: String, default: 'Guardar' },
  primaryIcon: { type: String, default: '' },
  primaryColor: { type: String, default: 'primary' },
  secondaryLabel: { type: String, default: 'Cancelar' },
  secondaryIcon: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  reverse: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
})

defineEmits(['primary', 'secondary'])
</script>
