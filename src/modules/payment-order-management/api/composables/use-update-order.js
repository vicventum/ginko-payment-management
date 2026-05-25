import { useMutation } from '@/modules/_core/api/composables/use-mutation.js'
import { updateOrder } from '@/modules/payment-order-management/api/services/service-orders.js'
import { updateOrder as updateOrderProvider } from '@/modules/payment-order-management/api/providers/provider-orders.js'

export function useUpdateOrder(options = {}) {
  return useMutation({
    mutationFn: async ({ variables, signal }) => {
      return await updateOrder(updateOrderProvider, { signal, payload: variables })
    },
    ...options,
  })
}
