import { ref, computed } from 'vue'
import { useFetch } from '@/modules/_core/api/composables/use-fetch.js'
import { fetchOrderById } from '../providers/provider-orders.js'

export function useOrderDetail(id) {
  const refreshKey = ref(0)

  const queryKey = computed(() => ['payment-order', id, refreshKey.value])

  const queryFn = () => fetchOrderById({ id })

  const result = useFetch({ queryKey, queryFn, enabled: !!id })

  function refresh() {
    refreshKey.value++
  }

  return { ...result, refresh }
}
