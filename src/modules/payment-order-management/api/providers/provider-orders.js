import { clientFetch } from '@/modules/_core/api/clients/client-fetch.js'

const MOCK_PATH = '/mock/orders.json'
const STORAGE_KEY = 'ginko-orders'

/** @type {Array|null} */
let _orders = null
/** @type {Promise<Array>|null} */
let _loading = null

// ── Persistencia localStorage ──────────────────────────────────────────

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persist = () => {
  if (!_orders) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_orders))
  } catch {
    // storage quota excedido o privacidad — falla silencioso
  }
}

const resolve = async (signal) => {
  if (_orders) return _orders
  if (_loading) return _loading

  // 1. localStorage first — órdenes persisten entre recargas
  const stored = loadFromStorage()
  if (stored) {
    _orders = stored
    return _orders
  }

  // 2. Fallback al mock estático
  _loading = clientFetch(MOCK_PATH, { signal })
    .then(data => {
      _orders = Array.isArray(data) ? data : (data.data || [])
      persist() // ← primera persistencia para próxima recarga
      return _orders
    })
    .finally(() => { _loading = null })
  return _loading
}

const fetchOrders = async ({ signal, payload } = {}) => {
  const { search, status, page = 1, perPage = 10 } = payload || {}
  const all = await resolve(signal)

  let filtered = all

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      o => o.provider.toLowerCase().includes(q) || o.concept.toLowerCase().includes(q)
    )
  }

  if (status) {
    filtered = filtered.filter(o => o.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * perPage

  return { data: filtered.slice(start, start + perPage), total, page, perPage }
}

const fetchOrderById = async ({ signal, payload } = {}) => {
  const { id } = payload || {}
  const all = await resolve(signal)
  const order = all.find(o => o.id === id)
  if (!order) throw new Error(`Order ${id} not found`)

  // Shallow copy: evita que Vue 3 no detecte cambios por misma referencia
  // (updateOrder muta el objeto con Object.assign, si devolvemos la misma ref
  //  data.value = result no dispara reactividad porque es ===)
  return { ...order }
}

const createOrder = async ({ signal, payload } = {}) => {
  const all = await resolve(signal)
  const order = {
    id: crypto.randomUUID(),
    ...payload,
    status: 'draft',
    createdAt: new Date().toISOString(),
  }
  all.unshift(order)
  persist()
  return order
}

const updateOrder = async ({ signal, payload } = {}) => {
  const { id, ...data } = payload || {}
  const all = await resolve(signal)
  const idx = all.findIndex(o => o.id === id)
  if (idx === -1) throw new Error(`Order ${id} not found`)
  Object.assign(all[idx], data)
  persist()
  // Shallow copy para reactividad de Vue (misma razón que fetchOrderById)
  return { ...all[idx] }
}

const deleteOrder = async ({ signal, payload } = {}) => {
  const { id } = payload || {}
  const all = await resolve(signal)
  const idx = all.findIndex(o => o.id === id)
  if (idx === -1) throw new Error(`Order ${id} not found`)
  all.splice(idx, 1)
  persist()
}

export { fetchOrders, fetchOrderById, createOrder, updateOrder, deleteOrder }
