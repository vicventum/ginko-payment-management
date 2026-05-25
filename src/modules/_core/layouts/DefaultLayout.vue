<script setup>
import LHeader from '@/modules/_core/components/l/l-header.vue'
import LFooter from '@/modules/_core/components/l/l-footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <LHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LFooter />
  </div>
</template>
