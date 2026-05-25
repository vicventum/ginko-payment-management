<script setup>
import { useRouter } from 'vue-router'
import SectionCreateOrder from '@/modules/payment-order-management/components/section/SectionCreateOrder.vue'

const router = useRouter()

function handleCreated() {
  router.push({ name: 'payment-order-list' })
}

function handleCancel() {
  router.push({ name: 'payment-order-list' })
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <section class="mb-8">
      <SectionCreateOrder
        @on-created="handleCreated"
        @on-cancel="handleCancel"
      />
    </section>
  </div>
</template>
