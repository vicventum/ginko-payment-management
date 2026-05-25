import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFetch } from '@/modules/_core/api/composables/use-fetch.js'
import { useOrdersStore } from '../../stores/store-orders.js'
import { fetchOrders } from '../services/service-orders.js'
import { fetchOrders as fetchOrdersProvider } from '../providers/provider-orders.js'

export function useListOrders() {
  const store = useOrdersStore()
  const { filters, pagination } = storeToRefs(store)

  const queryKey = computed(() => [
    'payment-orders',
    filters.value,
    pagination.value,
  ])

  return useFetch({
    queryKey,
    queryFn: async ({ signal }) => {
      return await fetchOrders(fetchOrdersProvider, {
        signal,
        payload: {
          search: filters.value.search,
          status: filters.value.status,
          page: pagination.value.page,
          perPage: pagination.value.perPage,
        },
      })
    },
  })
}
