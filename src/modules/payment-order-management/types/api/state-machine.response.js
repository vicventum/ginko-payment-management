import { ORDER_STATUSES } from '@/modules/payment-order-management/types/api/order.response.js'

/**
 * @typedef {'draft'|'approved'|'paid'|'rejected'} OrderStatus
 */

/**
 * @typedef {Object} StateTransition
 * @property {OrderStatus} from
 * @property {OrderStatus} to
 * @property {string} event
 * @property {string} timestamp
 */

/**
 * @typedef {Object} StateMachineResponse
 * @property {string} id
 * @property {string} orderId
 * @property {OrderStatus} currentState
 * @property {StateTransition[]} transitions
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} StateTransitionPayload
 * @property {import('./order.response.js').OrderStatus} from
 * @property {import('./order.response.js').OrderStatus} to
 * @property {string} [reason]
 */

export const ORDER_STATE_MACHINE = {
  transitions: {
    [ORDER_STATUSES.DRAFT]: [ORDER_STATUSES.APPROVED, ORDER_STATUSES.REJECTED],
    [ORDER_STATUSES.APPROVED]: [ORDER_STATUSES.PAID],
    [ORDER_STATUSES.PAID]: [],
    [ORDER_STATUSES.REJECTED]: [],
  },

  /**
   * @param {OrderStatus} from
   * @param {OrderStatus} to
   * @returns {boolean}
   */
  canTransition(from, to) {
    const allowed = this.transitions[from]
    return allowed ? allowed.includes(to) : false
  },

  /**
   * @param {OrderStatus} status
   * @returns {OrderStatus[]}
   */
  getAllowedTransitions(status) {
    return this.transitions[status] ?? []
  },
}
