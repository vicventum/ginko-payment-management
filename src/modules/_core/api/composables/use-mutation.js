import { ref, computed, shallowRef, onUnmounted } from 'vue'
import { useToast } from '@/modules/_core/utils/toast'

function useMutation({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
  meta = {},
} = {}) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    errorMessage,
    successMessage,
  } = meta
  const status = ref('idle')
  const data = ref(undefined)
  const error = ref(null)
  const toast = useToast()

  const abortControllerRef = shallowRef(null)

  const isIdle = computed(() => status.value === 'idle')
  const isPending = computed(() => status.value === 'pending')
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  const mutateAsync = async variables => {
    if (abortControllerRef.value) {
      abortControllerRef.value.abort()
    }

    const controller = new AbortController()
    abortControllerRef.value = controller

    status.value = 'pending'
    error.value = null

    let finalData
    let finalError

    try {
      finalData = await mutationFn({
        variables,
        signal: controller.signal,
      })

      if (abortControllerRef.value === controller) {
        data.value = finalData
        status.value = 'success'
        onSuccess?.(finalData, variables)

        if (showSuccessToast) {
          const msg =
            typeof successMessage === 'function'
              ? successMessage(finalData, variables)
              : successMessage || 'Operación realizada con éxito'
          toast.success(msg)
        }
      }

      return finalData
    } catch (err) {
      finalError = err
      if (
        err.name !== 'AbortError' &&
        abortControllerRef.value === controller
      ) {
        error.value = err
        status.value = 'error'

        if (
          showErrorToast &&
          (err.name === 'FetchError' || err instanceof Error)
        ) {
          if (err.status !== 401) {
            const msg =
              typeof errorMessage === 'function'
                ? errorMessage(err, variables)
                : errorMessage || err.message || 'Error procesando la solicitud'
            toast.error(msg)
          }
        }

        onError?.(err, variables)
        throw err
      }
    } finally {
      if (abortControllerRef.value === controller) {
        onSettled?.(finalData, finalError, variables)
      }
    }
  }

  const mutate = variables => {
    mutateAsync(variables).catch(() => {})
  }

  onUnmounted(() => {
    if (abortControllerRef.value) {
      abortControllerRef.value.abort()
    }
  })

  return {
    mutate,
    mutateAsync,
    data,
    error,
    status,
    isIdle,
    isPending,
    isSuccess,
    isError,
  }
}

export { useMutation }
