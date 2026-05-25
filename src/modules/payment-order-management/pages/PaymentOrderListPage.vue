<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <section class="mb-8">
      <SectionOrderList
        @create-order="onCreate"
        @view-order="onView"
      />
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SectionOrderList from '@/modules/payment-order-management/components/section/SectionOrderList.vue'

const router = useRouter()

function onCreate() {
  router.push({ name: 'payment-order-create' })
}

function onView(id) {
  router.push({ name: 'payment-order-detail', params: { id } })
}
</script>
