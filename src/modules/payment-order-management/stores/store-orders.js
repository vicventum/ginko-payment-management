import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', () => {
  const selectedOrderId = ref(null)
  const filters = ref({
    search: '',
    status: null,
  })
  const pagination = ref({
    page: 1,
    perPage: 10,
  })
  const sort = ref({
    field: 'createdAt',
    direction: 'desc',
  })

  const selectedOrder = computed(() => selectedOrderId.value)

  function selectOrder(id) {
    selectedOrderId.value = id
  }

  function clearSelection() {
    selectedOrderId.value = null
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1
  }

  function resetFilters() {
    filters.value = { search: '', status: null }
    pagination.value.page = 1
  }

  function setPage(page) {
    pagination.value.page = page
  }

  function setPerPage(perPage) {
    pagination.value.perPage = perPage
    pagination.value.page = 1
  }

  function setSort(field) {
    if (sort.value.field === field) {
      sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value.field = field
      sort.value.direction = 'desc'
    }
  }

  function resetPagination() {
    pagination.value = { page: 1, perPage: 10 }
  }

  function $reset() {
    clearSelection()
    resetFilters()
    resetPagination()
    sort.value = { field: 'createdAt', direction: 'desc' }
  }

  return {
    selectedOrderId,
    selectedOrder,
    filters,
    pagination,
    sort,
    selectOrder,
    clearSelection,
    setFilters,
    resetFilters,
    setPage,
    setPerPage,
    setSort,
    $reset,
  }
})
