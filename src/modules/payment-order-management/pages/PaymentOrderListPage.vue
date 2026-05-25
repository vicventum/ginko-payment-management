<script setup>
import { useRouter } from 'vue-router'
import SectionOrderList from '@/modules/payment-order-management/components/section/SectionOrderList.vue'

const router = useRouter()

function handleCreate() {
  router.push({ name: 'payment-order-create' })
}

function handleView(id) {
  router.push({ name: 'payment-order-detail', params: { id } })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <section class="mb-8">
      <SectionOrderList
        @on-create-order="handleCreate"
        @on-view-order="handleView"
      />
    </section>
  </div>
</template>
