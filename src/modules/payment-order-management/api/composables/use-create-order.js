import { ref } from 'vue'
import { createOrder } from '../services/service-orders.js'
import { useToast } from '@/modules/_core/utils/toast.js'

/**
 * Mutation composable para crear una orden de pago.
 *
 * Sigue el patrón mutation-feedback skill:
 * - Expone meta para configuración de feedback
 * - No necesita estado local de error en el componente
 * - Delega toast al adapter global (toast.js)
 *
 * @param {object} [options]
 * @param {boolean} [options.showSuccessToast=true]  - Mostrar toast en éxito
 * @param {string}  [options.successMessage]          - Mensaje de éxito personalizado
 * @param {string}  [options.errorMessage]            - Mensaje de error personalizado
 */
export function useCreateOrder(options = {}) {
  const error = ref(null)
  const isPending = ref(false)
  const isSuccess = ref(false)

  const toast = useToast()

  const {
    showSuccessToast = false,   // false por defecto — el componente maneja el feedback
    successMessage,
    errorMessage,
  } = options

  async function execute(payload) {
    error.value = null
    isSuccess.value = false
    isPending.value = true

    try {
      const result = await createOrder({ payload })
      isSuccess.value = true

      if (showSuccessToast) {
        toast.success(successMessage || 'Orden creada con éxito')
      }

      return result
    } catch (err) {
      error.value = err

      if (errorMessage) {
        toast.error(errorMessage)
      }

      throw err
    } finally {
      isPending.value = false
    }
  }

  return { execute, isPending, error, isSuccess }
}
