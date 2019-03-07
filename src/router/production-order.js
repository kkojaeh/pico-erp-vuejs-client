import {wrapModal} from './default'

let requestList = {
  title: '생산 지시 현황',
  authorize: 'hasAnyRole(\'PRODUCTION_ORDERER\', \'PRODUCTION_ORDER_MANAGER\')'
}

let requestForm = {
  title: '생산 지시 내용',
  authorize: 'hasAnyRole(\'PRODUCTION_ORDERER\', \'PRODUCTION_ORDER_MANAGER\')'
}

let acceptList = {
  title: '생산 지시 접수',
  authorize: 'hasAnyRole(\'OUTSOURCING_REQUEST_ACCEPTER\', \'PRODUCTION_ODER_MANAGER\')'
}

let acceptForm = {
  title: '생산 지시 접수',
  authorize: 'hasAnyRole(\'PRODUCTION_ORDER_ACCEPTER\', \'PRODUCTION_ORDER_MANAGER\')'
}

export default [{
  name: 'production-order-list',
  path: '/production-order/order',
  component: () => import('src/pages/production-order/production-order-list.vue'),
  meta: requestList,
  children: [{
    name: 'production-order-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/production-order/production-order-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-order/order',
                    query: this.$route.query
                  })
            })
          }
        }),
    meta: requestForm,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'production-order-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/production-order/production-order-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-order/order',
                    query: this.$route.query
                  })
            })
          }
        }),
    meta: requestForm,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}, {
  name: 'production-order-accept-list',
  path: '/production-order/await-accept',
  component: () => import('src/pages/production-order/production-order-accept-list.vue'),
  meta: acceptList,
  children: [{
    name: 'production-order-accept-form',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/production-order/production-order-accept-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-order/await-accept',
                    query: this.$route.query
                  })
            })
          }
        }),
    meta: acceptForm,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
