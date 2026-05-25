import { useToastStore } from '@/modules/_core/stores/store-toast.js'

/**
 * Composable global de toast notification.
 * Wrapper sobre el Pinia store para mantener la misma API que antes.
 *
 * @returns {{ success, error, warning, info, add, remove }}
 */
export function useToast() {
  const store = useToastStore()

  return {
    success: (title, description) => store.success(title, description),
    error: (title, description) => store.error(title, description),
    warning: (title, description) => store.warning(title, description),
    info: (title, description) => store.info(title, description),
    add: (opts) => store.add(opts),
    remove: (id) => store.remove(id),
  }
}
