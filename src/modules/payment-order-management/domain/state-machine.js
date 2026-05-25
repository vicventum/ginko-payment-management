export const ORDER_TRANSITIONS = {
  draft: ['approved', 'rejected'],
  approved: ['paid'],
  paid: [],
  rejected: [],
}
