<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <section class="mb-8">
      <SectionCreateOrder
        @created="onCreated"
        @cancel="onCancel"
      />
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SectionCreateOrder from '@/modules/payment-order-management/components/section/SectionCreateOrder.vue'

const router = useRouter()

function onCreated() {
  router.push({ name: 'payment-order-list' })
}

function onCancel() {
  router.push({ name: 'payment-order-list' })
}
</script>
