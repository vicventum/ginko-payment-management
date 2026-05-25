<template>
  <UBadge
    v-bind="styleProps"
    :size="size"
  >
    <slot>{{ styleProps?.label ?? value }}</slot>
  </UBadge>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: String, required: true },
  styles: { type: Object, required: true },
  size: { type: String, default: 'sm' },
})

const DEFAULT_STYLE = { color: 'neutral', variant: 'subtle' }

const styleProps = computed(() => {
  return props.styles[props.value] ?? DEFAULT_STYLE
})
</script>
