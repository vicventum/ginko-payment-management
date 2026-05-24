import {
  fetchOrders as providerFetchOrders,
  fetchOrderById as providerFetchOrderById,
  createOrder as providerCreateOrder,
  updateOrder as providerUpdateOrder,
  deleteOrder as providerDeleteOrder,
} from '../providers/provider-orders.js'

export async function fetchOrders(options = {}) {
  return providerFetchOrders(options)
}

export async function fetchOrderById(options = {}) {
  return providerFetchOrderById(options)
}

export async function createOrder(options = {}) {
  return providerCreateOrder(options)
}

export async function updateOrder(options = {}) {
  return providerUpdateOrder(options)
}

export async function deleteOrder(options = {}) {
  return providerDeleteOrder(options)
}
