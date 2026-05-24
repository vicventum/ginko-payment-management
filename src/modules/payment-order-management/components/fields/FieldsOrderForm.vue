<template>
  <div class="space-y-4">
    <UFormField name="provider" label="Proveedor" required>
      <UInput v-model="state.provider" placeholder="Nombre del proveedor" class="w-full" />
    </UFormField>

    <UFieldGroup>
      <UFormField name="amount" label="Monto" required class="flex-1">
        <UInputNumber v-model="state.amount" placeholder="0.00" :min="0" class="w-full" />
      </UFormField>

      <UFormField name="currency" label="Moneda" required class="w-32">
        <USelect v-model="state.currency" :items="['ARS', 'USD']" placeholder="Moneda" />
      </UFormField>
    </UFieldGroup>

    <UFormField name="concept" label="Concepto" required>
      <UTextarea
        v-model="state.concept"
        placeholder="Describir el concepto del pago"
        :rows="3"
        autoresize
        :maxrows="6"
        class="w-full"
      />
      <p class="mt-1 text-right text-xs text-muted">
        {{ (state.concept || '').length }} / 250
      </p>
    </UFormField>
  </div>
</template>

<script setup>
const state = defineModel({ required: true })
</script>
