<script setup>
import { computed } from 'vue'
import ACardInner from '@/modules/_core/components/a/card/a-card-inner.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  back: { type: Boolean, default: false },
  variant: { type: String, default: 'main' },
})

defineEmits(['on-back'])

const titleClass = computed(() => {
  return props.variant === 'secondary'
    ? 'text-base font-semibold text-highlighted'
    : 'text-lg font-semibold text-highlighted'
})
</script>

<template>
  <ACardInner>
    <div class="flex items-center gap-3">
      <UButton
        v-if="back"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        @click="$emit('on-back')"
      />
      <div class="min-w-0 flex-1">
        <h2 :class="titleClass">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-muted">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </ACardInner>
</template>
