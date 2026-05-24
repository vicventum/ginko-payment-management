import { ORDER_STATE_MACHINE } from '../../types/api/state-machine.response.js'

export function transitionOrderState(from, to) {
  if (!ORDER_STATE_MACHINE.canTransition(from, to)) {
    throw new Error(`Invalid transition: "${from}" -> "${to}"`)
  }
  return to
}

export function getAllowedTransitions(status) {
  return ORDER_STATE_MACHINE.getAllowedTransitions(status)
}
