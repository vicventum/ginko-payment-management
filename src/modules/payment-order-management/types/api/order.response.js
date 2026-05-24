/**
 * @typedef {Object} PaymentOrder
 * @property {string} id
 * @property {string} provider
 * @property {number} amount
 * @property {string} currency
 * @property {string} concept
 * @property {import('./state-machine.response.js').OrderStatus} status
 * @property {string} createdAt
 */

/**
 * @typedef {'draft'|'approved'|'paid'|'rejected'} OrderStatus
 */

/**
 * @typedef {Object} OrderListResponse
 * @property {PaymentOrder[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} perPage
 */

/**
 * @typedef {Object} OrderPayload
 * @property {string} provider
 * @property {number} amount
 * @property {string} currency
 * @property {string} concept
 */

export const ORDER_STATUSES = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
}
