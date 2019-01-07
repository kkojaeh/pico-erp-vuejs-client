import {wrapModal} from "./default";

let awaitList = {
  title: '발주 대기 현황',
  authorize: 'hasAnyRole(\'PURCHASE_ORDER_CHARGER\', \'PURCHASE_ORDER_MANAGER\')'
}

let orderList = {
  title: '발주 현황',
  authorize: 'hasAnyRole(\'PURCHASE_ORDER_CHARGER\', \'PURCHASE_ORDER_MANAGER\')'
}

let orderForm = {
  title: '발주 내용',
  authorize: 'hasAnyRole(\'PURCHASE_ORDER_CHARGER\', \'PURCHASE_ORDER_MANAGER\')'
}

export default [{
  name: 'purchase-request-await-purchase-order-list',
  path: '/purchase-order/await-order',
  component: () => import('src/pages/purchase-order/purchase-request-await-order-list.vue'),
  meta: awaitList
}, {
  name: 'purchase-order-list',
  path: '/purchase-order/order',
  component: () => import('src/pages/purchase-order/purchase-order-list.vue'),
  meta: orderList,
  children: [{
    name: 'purchase-order-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/purchase-order/purchase-order-form.vue'), {
          onModalHide() {
            this.$router.push(
                {path: '/purchase-order/order', query: this.$route.query})
          }
        }),
    meta: orderForm,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'purchase-order-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/purchase-order/purchase-order-form.vue'), {
          onModalHide() {
            this.$router.push(
                {path: '/purchase-order/order', query: this.$route.query})
          }
        }),
    meta: orderForm,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
