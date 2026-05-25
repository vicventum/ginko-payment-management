<script setup>
import ToastHandler from '@/modules/_core/components/ToastHandler.vue'
import LHeader from '@/modules/_core/components/l/l-header.vue'
import LFooter from '@/modules/_core/components/l/l-footer.vue'
</script>

<template>
  <UApp>
    <div class="flex flex-col min-h-screen">
      <LHeader />
      <main class="flex-1">
        <router-view />
      </main>
      <LFooter />
    </div>
    <ToastHandler />
  </UApp>
</template>
