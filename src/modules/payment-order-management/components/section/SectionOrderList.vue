<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListOrders } from '@/modules/payment-order-management/api/composables/use-list-orders.js'
import { useOrdersStore } from '@/modules/payment-order-management/stores/store-orders.js'
import { storeToRefs } from 'pinia'
import BCard from '@/modules/_core/components/b/card/b-card.vue'
import DCardHeader from '@/modules/_core/components/d/card/d-card-header.vue'
import TableOrderList from '@/modules/payment-order-management/components/table/TableOrderList.vue'

const emit = defineEmits(['on-view-order', 'on-create-order'])

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

const rows = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.total ?? 0)
const currentPage = computed(() => pagination.value.page)
const perPage = computed(() => pagination.value.perPage)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage.value)))

// ── Sincronizacion URL ↔ Store ──────────────────────────────────────

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

function handleSearchChange(val) {
  store.setFilters({ search: val })
}

function handleStatusChange(val) {
  store.setFilters({ status: val })
}

function handlePageChange(page) {
  store.setPage(page)
}

watch(() => filters.value.search, (val) => {
  search.value = val
})

watch(() => filters.value.status, (val) => {
  statusFilter.value = val
})
</script>

<template>
  <div>
    <DCardHeader
      title="Órdenes de pago"
      subtitle="Gestiona las órdenes de pago del sistema"
    >
      <template #actions>
        <UButton label="Nueva orden" icon="i-lucide-plus" @click="$emit('on-create-order')" />
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
            @update:model-value="handleSearchChange"
          />
          <div class="flex items-center gap-2">
            <USelect
              :model-value="statusFilter"
              :items="statusOptions"
              placeholder="Filtrar por estado"
              class="w-44"
              @update:model-value="handleStatusChange"
            />
          </div>
        </div>
      </template>

      <TableOrderList
        :rows="rows"
        :total="total"
        :current-page="currentPage"
        :per-page="perPage"
        :total-pages="totalPages"
        :is-loading="isLoading"
        :is-error="isError"
        :error="error"
        @on-view-order="$emit('on-view-order', $event)"
        @on-create-order="$emit('on-create-order')"
        @on-refetch="refetch"
        @update:page="handlePageChange"
      />
    </BCard>
  </div>
</template>
