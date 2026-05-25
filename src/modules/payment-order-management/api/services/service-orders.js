const fetchOrders = async (provider, options) => {
  const { signal = null, payload } = options
  return await provider({ signal, payload })
}

const fetchOrderById = async (provider, options) => {
  const { signal = null, payload } = options
  return await provider({ signal, payload })
}

const createOrder = async (provider, options) => {
  const { signal = null, payload } = options
  return await provider({ signal, payload })
}

const updateOrder = async (provider, options) => {
  const { signal = null, payload } = options
  return await provider({ signal, payload })
}

const deleteOrder = async (provider, options) => {
  const { signal = null, payload } = options
  return await provider({ signal, payload })
}

export { fetchOrders, fetchOrderById, createOrder, updateOrder, deleteOrder }
