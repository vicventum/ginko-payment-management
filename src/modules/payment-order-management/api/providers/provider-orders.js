import { clientFetch } from '@/modules/_core/api/clients/client-fetch.js'

const MOCK_PATH = '/mock/orders.json'
const STORAGE_KEY = 'ginko-orders'

/** @type {import('../../types/api/order.response.js').PaymentOrder[]|null} */
let _orders = null
/** @type {Promise<import('../../types/api/order.response.js').PaymentOrder[]>|null} */
let _loading = null

// ── Persistencia localStorage ──────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist() {
  if (!_orders) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_orders))
  } catch {
    // storage quota excedido o privacidad — falla silencioso
  }
}

async function resolve(signal) {
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

/**
 * @param {object} [options]
 * @param {string} [options.search]
 * @param {string} [options.status]
 * @param {number} [options.page=1]
 * @param {number} [options.perPage=10]
 * @param {object} [options.signal] - AbortSignal for cancellation
 * @returns {Promise<import('../../types/api/order.response.js').OrderListResponse>}
 */
export function fetchOrders({ search, status, page = 1, perPage = 10, signal } = {}) {
  return resolve(signal).then(all => {
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
  })
}

/**
 * @param {object} options
 * @param {string} options.id
 * @param {object} [options.signal] - AbortSignal for cancellation
 * @returns {Promise<import('../../types/api/order.response.js').PaymentOrder>}
 */
export function fetchOrderById({ id, signal } = {}) {
  return resolve(signal).then(all => {
    const order = all.find(o => o.id === id)
    if (!order) throw new Error(`Order ${id} not found`)
    // Shallow copy: evita que Vue 3 no detecte cambios por misma referencia
    // (updateOrder muta el objeto con Object.assign, si devolvemos la misma ref
    //  data.value = result no dispara reactividad porque es ===)
    return { ...order }
  })
}

/**
 * @param {object} options
 * @param {import('../../types/api/order.response.js').OrderPayload} options.payload
 * @param {object} [options.signal] - AbortSignal for cancellation
 * @returns {Promise<import('../../types/api/order.response.js').PaymentOrder>}
 */
export function createOrder({ payload, signal } = {}) {
  return resolve(signal).then(all => {
    const order = {
      id: crypto.randomUUID(),
      ...payload,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }
    all.unshift(order)
    persist()
    return order
  })
}

/**
 * @param {object} options
 * @param {string} options.id
 * @param {Partial<import('../../types/api/order.response.js').OrderPayload>} options.payload
 * @param {object} [options.signal] - AbortSignal for cancellation
 * @returns {Promise<import('../../types/api/order.response.js').PaymentOrder>}
 */
export function updateOrder({ id, payload, signal } = {}) {
  return resolve(signal).then(all => {
    const idx = all.findIndex(o => o.id === id)
    if (idx === -1) throw new Error(`Order ${id} not found`)
    Object.assign(all[idx], payload)
    persist()
    // Shallow copy para reactividad de Vue (misma razón que fetchOrderById)
    return { ...all[idx] }
  })
}

/**
 * @param {object} options
 * @param {string} options.id
 * @param {object} [options.signal] - AbortSignal for cancellation
 * @returns {Promise<void>}
 */
export function deleteOrder({ id, signal } = {}) {
  return resolve(signal).then(all => {
    const idx = all.findIndex(o => o.id === id)
    if (idx === -1) throw new Error(`Order ${id} not found`)
    all.splice(idx, 1)
    persist()
  })
}