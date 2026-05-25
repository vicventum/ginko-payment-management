<template>
  <div class="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] flex-col gap-2 sm:w-96">
    <TransitionGroup name="toast">
      <UAlert
        v-for="t in store.toasts"
        :key="t.id"
        :icon="t.icon"
        :title="t.title"
        :description="t.description"
        :color="t.color"
        variant="solid"
        closable
        class="shadow-lg"
        @close="store.remove(t.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '@/modules/_core/stores/store-toast.js'

const store = useToastStore()
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(1.5rem);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(1.5rem);
}
</style>
