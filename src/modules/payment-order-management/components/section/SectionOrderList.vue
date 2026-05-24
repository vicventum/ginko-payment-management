<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-highlighted">Órdenes de pago</h2>
        <p class="text-sm text-muted">Gestioná las órdenes de pago del sistema</p>
      </div>
      <UButton label="Nueva orden" icon="i-lucide-plus" @click="$emit('create-order')" />
    </div>

    <UCard>
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
              <UBadge :color="statusColor(row.original.status)" variant="subtle" size="sm">
                {{ statusLabel(row.original.status) }}
              </UBadge>
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
    </UCard>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListOrders } from '../../api/composables/use-list-orders.js'
import { useOrdersStore } from '../../stores/store-orders.js'
import { storeToRefs } from 'pinia'
import CardOrderMobile from '../card/CardOrderMobile.vue'

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
  // URL → Store: al montar, leer query params y aplicar al store
  const q = route.query
  const urlSearch = typeof q.search === 'string' ? q.search : ''
  const urlStatus = typeof q.status === 'string' ? q.status : null

  if (urlSearch || urlStatus) {
    store.setFilters({ search: urlSearch, status: urlStatus })
    search.value = urlSearch
    statusFilter.value = urlStatus
  }
})

// Store → URL: cuando cambian los filtros del store, actualizar la URL
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

function statusColor(status) {
  const map = { draft: 'warning', approved: 'info', paid: 'success', rejected: 'error' }
  return map[status] || 'neutral'
}

function statusLabel(status) {
  const map = { draft: 'Borrador', approved: 'Aprobado', paid: 'Pagado', rejected: 'Rechazado' }
  return map[status] || status
}

function formatAmount(amount, currency) {
  if (!currency) {
    return new Intl.NumberFormat('es-AR').format(amount ?? 0)
  }
  try {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount ?? 0)
  } catch {
    return new Intl.NumberFormat('es-AR').format(amount ?? 0)
  }
}

function formatDate(dateStr) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(dateStr))
}
</script>
