<template>
  <UApp>
    <router-view />
    <ToastHandler />
  </UApp>
</template>

<script setup>
import ToastHandler from '@/modules/_core/components/ToastHandler.vue'
</script>

<style>
/* Global styles if any */
</style>