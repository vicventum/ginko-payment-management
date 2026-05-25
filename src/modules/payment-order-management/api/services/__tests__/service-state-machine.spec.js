import { describe, it, expect } from 'vitest'
import {
  transitionOrderState,
  getAllowedTransitions,
} from '@/modules/payment-order-management/api/services/service-state-machine.js'

describe('transitionOrderState', () => {
  it('draft -> approved', () => {
    expect(transitionOrderState('draft', 'approved')).toBe('approved')
  })

  it('draft -> rejected', () => {
    expect(transitionOrderState('draft', 'rejected')).toBe('rejected')
  })

  it('approved -> paid', () => {
    expect(transitionOrderState('approved', 'paid')).toBe('paid')
  })

  it('throws when jumping draft -> paid (skips approval)', () => {
    expect(() => transitionOrderState('draft', 'paid')).toThrow(
      'Invalid transition: "draft" -> "paid"',
    )
  })

  it('throws for any transition from a terminal state (paid)', () => {
    expect(() => transitionOrderState('paid', 'approved')).toThrow()
    expect(() => transitionOrderState('paid', 'rejected')).toThrow()
    expect(() => transitionOrderState('paid', 'draft')).toThrow()
  })

  it('throws for any transition from a terminal state (rejected)', () => {
    expect(() => transitionOrderState('rejected', 'draft')).toThrow()
    expect(() => transitionOrderState('rejected', 'approved')).toThrow()
    expect(() => transitionOrderState('rejected', 'paid')).toThrow()
  })

  it('throws when from or to is an unknown status', () => {
    expect(() => transitionOrderState('unknown', 'draft')).toThrow()
    expect(() => transitionOrderState('draft', 'unknown')).toThrow()
  })

  it('throws when from or to is null or undefined', () => {
    expect(() => transitionOrderState(null, 'draft')).toThrow()
    expect(() => transitionOrderState(undefined, 'draft')).toThrow()
    expect(() => transitionOrderState('draft', null)).toThrow()
    expect(() => transitionOrderState('draft', undefined)).toThrow()
  })
})

describe('getAllowedTransitions', () => {
  it('draft -> [approved, rejected]', () => {
    expect(getAllowedTransitions('draft')).toEqual(['approved', 'rejected'])
  })

  it('approved -> [paid]', () => {
    expect(getAllowedTransitions('approved')).toEqual(['paid'])
  })

  it('paid -> [] (terminal)', () => {
    expect(getAllowedTransitions('paid')).toEqual([])
  })

  it('rejected -> [] (terminal)', () => {
    expect(getAllowedTransitions('rejected')).toEqual([])
  })

  it('unknown status -> []', () => {
    expect(getAllowedTransitions('nonexistent')).toEqual([])
  })

  it('null or undefined -> []', () => {
    expect(getAllowedTransitions(null)).toEqual([])
    expect(getAllowedTransitions(undefined)).toEqual([])
  })
})
