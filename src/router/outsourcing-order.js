import {wrapModal} from "./default";

let awaitList = {
  title: '외주발주 대기 현황',
  authorize: 'hasAnyRole(\'OUTSOURCING_ORDER_CHARGER\', \'OUTSOURCING_ORDER_MANAGER\')'
}

let orderList = {
  title: '외주발주 현황',
  authorize: 'hasAnyRole(\'OUTSOURCING_ORDER_CHARGER\', \'OUTSOURCING_ORDER_MANAGER\')'
}

let orderForm = {
  title: '외주발주 내용',
  authorize: 'hasAnyRole(\'OUTSOURCING_ORDER_CHARGER\', \'OUTSOURCING_ORDER_MANAGER\')'
}

export default [{
  name: 'outsourcing-request-await-outsourcing-order-list',
  path: '/outsourcing-order/await-order',
  component: () => import('src/pages/outsourcing-order/outsourcing-request-await-order-list.vue'),
  meta: awaitList
}, {
  name: 'outsourcing-order-list',
  path: '/outsourcing-order/order',
  component: () => import('src/pages/outsourcing-order/outsourcing-order-list.vue'),
  meta: orderList,
  children: [{
    name: 'outsourcing-order-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/outsourcing-order/outsourcing-order-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/outsourcing-order/order', query: this.$route.query})
            })
          }
        }),
    meta: orderForm,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'outsourcing-order-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/outsourcing-order/outsourcing-order-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/outsourcing-order/order', query: this.$route.query})
            })
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
