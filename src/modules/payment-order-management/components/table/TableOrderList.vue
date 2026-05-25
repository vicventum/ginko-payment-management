<script setup>
import { formatAmount, formatDate } from '@/modules/_core/utils/format.js'
import CBadgeStatus from '@/modules/_core/components/c/badge/c-badge-status.vue'
import CardOrderMobile from '@/modules/payment-order-management/components/card/CardOrderMobile.vue'

defineProps({
  rows: { type: Array, required: true },
  total: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  perPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  isLoading: { type: Boolean, default: false },
  isError: { type: Boolean, default: false },
  error: { type: Object, default: null },
})

defineEmits(['on-view-order', 'on-create-order', 'on-refetch', 'update:page'])

const columns = [
  { accessorKey: 'provider', header: 'Proveedor' },
  { accessorKey: 'amount', header: 'Monto' },
  { accessorKey: 'currency', header: 'Moneda' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'createdAt', header: 'Fecha' },
  { id: 'actions' },
]
</script>

<template>
  <div v-auto-animate>
    <template v-if="isLoading">
      <div class="space-y-3 p-4">
        <USkeleton v-for="n in 5" :key="n" class="h-10 w-full" />
      </div>
    </template>

    <UAlert
      v-else-if="isError"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      title="Error al cargar las órdenes"
      :description="error?.message"
    >
      <template #actions>
        <UButton label="Reintentar" color="error" variant="outline" size="sm" @click="$emit('on-refetch')" />
      </template>
    </UAlert>

    <UEmpty
      v-else-if="rows.length === 0"
      icon="i-lucide-inbox"
      title="Sin órdenes"
      description="No se encontraron órdenes de pago con los filtros actuales."
    >
      <template #actions>
        <UButton label="Crear primera orden" icon="i-lucide-plus" @click="$emit('on-create-order')" />
      </template>
    </UEmpty>

    <div v-else>
      <div class="hidden lg:block">
        <UTable
          :data="rows"
          :columns="columns"
          :ui="{ tr: 'animate-[fadeIn_0.25s_ease-out]' }"
        >
          <template #amount-cell="{ row }">
            <span class="font-medium text-highlighted">
              {{ formatAmount(row.original.amount, row.original.currency) }}
            </span>
          </template>

          <template #currency-cell="{ row }">
            <UBadge :label="row.original.currency" color="neutral" variant="subtle" size="sm" />
          </template>

          <template #status-cell="{ row }">
            <CBadgeStatus :status="row.original.status" size="sm" />
          </template>

          <template #createdAt-cell="{ row }">
            <span class="text-xs text-muted">{{ formatDate(row.original.createdAt) }}</span>
          </template>

          <template #actions-cell="{ row }">
            <UButton
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="$emit('on-view-order', row.original.id)"
            />
          </template>
        </UTable>
      </div>

      <div class="block lg:hidden">
        <div v-auto-animate class="grid gap-3 sm:grid-cols-2">
          <CardOrderMobile
            v-for="order in rows"
            :key="order.id"
            :order="order"
            @on-click="$emit('on-view-order', $event)"
          />
        </div>
      </div>
    </div>
  </div>

  <template v-if="totalPages > 0">
    <div class="flex items-center justify-between pt-4">
      <p class="text-xs text-muted">
        {{ total }} orden{{ total !== 1 ? 'es' : '' }}
        &middot; Página {{ currentPage }} de {{ totalPages }}
      </p>
      <UPagination
        :page="currentPage"
        :total="total"
        :items-per-page="perPage"
        @update:page="$emit('update:page', $event)"
      />
    </div>
  </template>
</template>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
