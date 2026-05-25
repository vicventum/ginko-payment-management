<script setup>
defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div class="p-4" :class="class">
    <slot />
  </div>
</template>
