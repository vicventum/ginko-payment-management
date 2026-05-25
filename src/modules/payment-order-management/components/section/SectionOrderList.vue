<template>
  <div>
    <DCardHeader
      title="Órdenes de pago"
      subtitle="Gestioná las órdenes de pago del sistema"
    >
      <template #actions>
        <UButton label="Nueva orden" icon="i-lucide-plus" @click="$emit('create-order')" />
      </template>
    </DCardHeader>

    <BCard>
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Buscar por proveedor o concepto..."
            class="w-full sm:max-w-xs"
            @update:model-value="onSearchChange"
          />
          <div class="flex items-center gap-2">
            <USelect
              :model-value="statusFilter"
              :items="statusOptions"
              placeholder="Filtrar por estado"
              class="w-44"
              @update:model-value="onStatusChange"
            />
          </div>
        </div>
      </template>

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
          <UButton label="Reintentar" color="error" variant="outline" size="sm" @click="refetch" />
        </template>
      </UAlert>

      <template v-else-if="rows.length === 0">
        <UEmpty
          icon="i-lucide-inbox"
          title="Sin órdenes"
          description="No se encontraron órdenes de pago con los filtros actuales."
        >
          <template #actions>
            <UButton label="Crear primera orden" icon="i-lucide-plus" @click="$emit('create-order')" />
          </template>
        </UEmpty>
      </template>

      <template v-else>
        <div class="hidden lg:block">
          <UTable :data="rows" :columns="columns">
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
                @click="$emit('view-order', row.original.id)"
              />
            </template>
          </UTable>
        </div>

        <div class="block lg:hidden">
          <div class="grid gap-3 sm:grid-cols-2">
            <CardOrderMobile
              v-for="order in rows"
              :key="order.id"
              :order="order"
              @click="$emit('view-order', $event)"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-xs text-muted">
            {{ total }} orden{{ total !== 1 ? 'es' : '' }}
            &middot; Página {{ currentPage }} de {{ totalPages }}
          </p>
          <UPagination
            v-if="totalPages > 0"
            :page="currentPage"
            :total="total"
            :items-per-page="perPage"
            @update:page="onPageChange"
          />
        </div>
      </template>
    </BCard>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListOrders } from '@/modules/payment-order-management/api/composables/use-list-orders.js'
import { useOrdersStore } from '@/modules/payment-order-management/stores/store-orders.js'
import { storeToRefs } from 'pinia'
import { formatAmount, formatDate } from '@/modules/_core/utils/format.js'
import BCard from '@/modules/_core/components/b/card/b-card.vue'
import DCardHeader from '@/modules/_core/components/d/card/d-card-header.vue'
import CBadgeStatus from '@/modules/_core/components/c/badge/c-badge-status.vue'
import CardOrderMobile from '@/modules/payment-order-management/components/card/CardOrderMobile.vue'

const emit = defineEmits(['view-order', 'create-order'])

const route = useRoute()
const router = useRouter()

const store = useOrdersStore()
const { filters, pagination } = storeToRefs(store)

const { data, isLoading, isError, error, refetch } = useListOrders()

const search = ref(filters.value.search)
const statusFilter = ref(filters.value.status)

const statusOptions = [
  { label: 'Todos los estados', value: null },
  { label: 'Borrador', value: 'draft' },
  { label: 'Aprobado', value: 'approved' },
  { label: 'Pagado', value: 'paid' },
  { label: 'Rechazado', value: 'rejected' },
]

const columns = [
  { accessorKey: 'provider', header: 'Proveedor' },
  { accessorKey: 'amount', header: 'Monto' },
  { accessorKey: 'currency', header: 'Moneda' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'createdAt', header: 'Fecha' },
  { id: 'actions' },
]

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.total ?? 0)
const currentPage = computed(() => pagination.value.page)
const perPage = computed(() => pagination.value.perPage)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))

// ── Sincronización URL ↔ Store ──────────────────────────────────────

onMounted(() => {
  const q = route.query
  const urlSearch = typeof q.search === 'string' ? q.search : ''
  const urlStatus = typeof q.status === 'string' ? q.status : null

  if (urlSearch || urlStatus) {
    store.setFilters({ search: urlSearch, status: urlStatus })
    search.value = urlSearch
    statusFilter.value = urlStatus
  }
})

watch(filters, (val) => {
  const query = {}
  if (val.search) query.search = val.search
  if (val.status) query.status = val.status

  router.replace({ query })
}, { deep: true })

function onSearchChange(val) {
  store.setFilters({ search: val })
}

function onStatusChange(val) {
  store.setFilters({ status: val })
}

function onPageChange(page) {
  store.setPage(page)
}

watch(() => filters.value.search, (val) => {
  search.value = val
})

watch(() => filters.value.status, (val) => {
  statusFilter.value = val
})
</script>
