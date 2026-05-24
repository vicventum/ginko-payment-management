import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function add({ title, description, color = 'primary', icon, timeout = 4000 } = {}) {
    const id = Date.now() + Math.random()
    const entry = { id, title, description, color, icon, closing: false }
    toasts.value.push(entry)

    if (timeout > 0) {
      const timerId = setTimeout(() => doRemove(id), timeout)
      // store timer so we can cancel if user closes early
      entry._timer = timerId
    }

    return id
  }

  function doRemove(id) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx === -1) return
    toasts.value[idx].closing = true
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 300)
  }

  function remove(id) {
    const entry = toasts.value.find(t => t.id === id)
    if (entry?._timer) clearTimeout(entry._timer)
    doRemove(id)
  }

  function success(title, description) {
    return add({ title, description, color: 'success', icon: 'i-lucide-check-circle' })
  }

  function error(title, description) {
    return add({ title, description, color: 'error', icon: 'i-lucide-alert-circle' })
  }

  function warning(title, description) {
    return add({ title, description, color: 'warning', icon: 'i-lucide-alert-triangle' })
  }

  function info(title, description) {
    return add({ title, description, color: 'info', icon: 'i-lucide-info' })
  }

  return { toasts, add, remove, success, error, warning, info }
})
