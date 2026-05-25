import { useMutation } from '@/modules/_core/api/composables/use-mutation.js'
import { createOrder } from '@/modules/payment-order-management/api/services/service-orders.js'
import { createOrder as createOrderProvider } from '@/modules/payment-order-management/api/providers/provider-orders.js'

export function useCreateOrder(options = {}) {
  return useMutation({
    mutationFn: async ({ variables, signal }) => {
      return await createOrder(createOrderProvider, { signal, payload: variables })
    },
    ...options,
  })
}
