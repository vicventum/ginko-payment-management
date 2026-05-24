import { ref, computed, watch, onUnmounted, shallowRef, toValue, isRef, unref } from 'vue'
import { useToast } from '@/modules/_core/utils/toast'

const queryCache = new Map()

/**
 * Composable de fetch con caché, control de carreras y staleTime.
 *
 * @param {object} [options]
 * @param {any} options.queryKey  - Clave única para identificar/cachear la query (acepta ref o getter)
 * @param {Function} options.queryFn - Función fetch que recibe `{ signal }` (acepta ref o getter)
 * @param {boolean} [options.enabled=true] - Si `false`, no ejecuta la query
 * @param {number} [options.staleTime=0]  - Tiempo en ms antes de considerar obsoleto el caché
 * @param {object} [options.meta={}]      - Configuración de feedback
 * @param {boolean} [options.meta.showErrorToast=true]
 * @param {Function|string} [options.meta.errorMessage]
 */
function useFetch({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 0,
  meta = {},
} = {}) {
  const toast = useToast()
  const { showErrorToast = true, errorMessage } = meta

  // ── Hash reactivo de la queryKey ──────────────────────────────────────
  const queryHash = computed(() => JSON.stringify(toValue(queryKey)))

  // ── Control de carreras (Race Conditions) ─────────────────────────────
  const abortControllerRef = shallowRef(null)

  // ── Estado reactivo ───────────────────────────────────────────────────
  const data = ref(undefined)
  const error = ref(null)
  const status = ref('pending')
  const isFetching = ref(false)

  // ── Helpers ───────────────────────────────────────────────────────────
  function checkCache(hash) {
    const cached = queryCache.get(hash)
    if (cached && Date.now() - cached.timestamp < toValue(staleTime)) {
      data.value = cached.data
      error.value = null
      status.value = 'success'
      return true
    }
    return false
  }

  // ── Ejecutor de fetch ─────────────────────────────────────────────────
  async function executeFetch() {
    // Cancela cualquier petición prevista todavía en curso
    if (abortControllerRef.value) {
      abortControllerRef.value.abort()
    }

    const controller = new AbortController()
    abortControllerRef.value = controller

    isFetching.value = true

    try {
      // toValue unwraps refs/computed, but also calls plain functions as getters.
      // queryFn is a function, not a getter — so we unwrap refs first if needed,
      // but use the function directly to avoid premature invocation.
      const fn = isRef(queryFn) ? unref(queryFn) : queryFn
      const result = await fn({ signal: controller.signal })

      // Si esta petición ya no es la actual (otra la reemplazó), descartamos
      if (abortControllerRef.value !== controller) return result

      data.value = result
      error.value = null
      status.value = 'success'
      queryCache.set(queryHash.value, { data: result, timestamp: Date.now() })

      return result
    } catch (err) {
      if (abortControllerRef.value !== controller) return

      if (err.name !== 'AbortError') {
        data.value = undefined
        error.value = err
        status.value = 'error'

        if (
          showErrorToast
          && (err.name === 'FetchError' || err instanceof Error)
        ) {
          if (err.status !== 401) {
            const msg = typeof errorMessage === 'function'
              ? errorMessage(err, toValue(queryKey))
              : errorMessage || err.message || 'Error al obtener los datos'

            toast.error(msg)
          }
        }
      }
    } finally {
      // Solo apaga isFetching si esta sigue siendo la petición vigente
      if (abortControllerRef.value === controller) {
        isFetching.value = false
      }
    }
  }

  // ── Watcher: reacciona a cambios en queryKey, enabled, staleTime ──────
  watch(
    [
      queryHash,
      () => toValue(enabled),
      () => toValue(staleTime),
    ],
    ([newHash, isEnabled], _, onCleanup) => {
      if (!isEnabled) return

      if (!checkCache(newHash)) {
        executeFetch()
      }

      onCleanup(() => {
        if (abortControllerRef.value) {
          abortControllerRef.value.abort()
        }
      })
    },
    { immediate: true },
  )

  // ── Cleanup al desmontar ──────────────────────────────────────────────
  onUnmounted(() => {
    if (abortControllerRef.value) {
      abortControllerRef.value.abort()
    }
  })

  // ── Refetch manual ────────────────────────────────────────────────────
  function refetch() {
    return executeFetch()
  }

  // ── Getters computados ────────────────────────────────────────────────
  const isLoading = computed(() => status.value === 'pending' && isFetching.value)
  const isSuccess = computed(() => status.value === 'success')
  const isError = computed(() => status.value === 'error')

  return {
    data,
    error,
    status,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  }
}

export { useFetch }
