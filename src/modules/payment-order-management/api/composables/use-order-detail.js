import { ref, computed } from 'vue'
import { useFetch } from '@/modules/_core/api/composables/use-fetch.js'
import { fetchOrderById } from '@/modules/payment-order-management/api/services/service-orders.js'
import { fetchOrderById as fetchOrderByIdProvider } from '@/modules/payment-order-management/api/providers/provider-orders.js'

export function useOrderDetail(id) {
  const refreshKey = ref(0)

  const queryKey = computed(() => ['payment-order', id, refreshKey.value])

  const result = useFetch({
    queryKey,
    queryFn: async ({ signal }) => {
      return await fetchOrderById(fetchOrderByIdProvider, {
        signal,
        payload: { id },
      })
    },
    enabled: !!id,
  })

  function refresh() {
    refreshKey.value++
  }

  return { ...result, refresh }
}
