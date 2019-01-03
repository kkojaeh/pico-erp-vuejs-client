let awaitList = {
  title: '발주 대기 현황',
  authorize: 'hasAnyRole(\'PURCHASE_ORDER_CHARGER\', \'PURCHASE_ORDER_MANAGER\')'
}

export default [{
  name: 'await-purchase-order-list',
  path: '/purchase-order/await-order',
  component: () => import('src/pages/purchase-order/await-purchase-order-list.vue'),
  meta: awaitList
}]
