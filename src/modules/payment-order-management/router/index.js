export default [
  {
    path: '/payment-orders',
    name: 'payment-order-list',
    component: () => import('@/modules/payment-order-management/pages/PaymentOrderListPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-orders/create',
    name: 'payment-order-create',
    component: () => import('@/modules/payment-order-management/pages/PaymentOrderCreatePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-orders/:id',
    name: 'payment-order-detail',
    component: () => import('@/modules/payment-order-management/pages/PaymentOrderDetailPage.vue'),
    meta: { requiresAuth: true },
    props: true,
  },
]
