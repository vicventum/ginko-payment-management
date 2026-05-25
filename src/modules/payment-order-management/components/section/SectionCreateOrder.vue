<script setup>
import BCard from '@/modules/_core/components/b/card/b-card.vue'
import DCardHeader from '@/modules/_core/components/d/card/d-card-header.vue'
import FormCreateOrder from '@/modules/payment-order-management/components/form/FormCreateOrder.vue'

const emit = defineEmits(['on-created', 'on-cancel'])

function handleCreated(payload) {
  emit('on-created', payload)
}
</script>

<template>
  <div>
    <DCardHeader
      title="Nueva orden de pago"
      subtitle="Completa los datos para crear una nueva orden"
      back
      @on-back="$emit('on-cancel')"
    />

    <BCard>
      <FormCreateOrder @on-created="handleCreated" @on-cancel="$emit('on-cancel')" />
    </BCard>
  </div>
</template>
