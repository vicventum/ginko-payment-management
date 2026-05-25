<script setup>
import ToastHandler from '@/modules/_core/components/ToastHandler.vue'
import DefaultLayout from '@/modules/_core/layouts/DefaultLayout.vue'
</script>

<template>
  <UApp>
    <DefaultLayout>
      <router-view />
    </DefaultLayout>
    <ToastHandler />
  </UApp>
</template>
