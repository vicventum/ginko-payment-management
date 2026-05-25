<template>
  <div class="p-4" :class="class">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  class: { type: String, default: '' },
})
</script>
