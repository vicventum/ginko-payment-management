<script setup>
import { computed } from 'vue'

const props = defineProps({
  class: { type: String, default: '' },
  variant: { type: String, default: 'outline' },
  ui: { type: Object, default: () => ({}) },
})

const mergedUi = computed(() => ({
  body: { padding: 'p-0 sm:p-0' },
  ...props.ui,
}))
</script>

<template>
  <UCard
    :ui="mergedUi"
    :variant="variant"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>
