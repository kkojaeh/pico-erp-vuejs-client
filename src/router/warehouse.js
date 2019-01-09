import {wrapModal} from './default'

const transactionRequest = {
  title: '입/출고 요청',
  authorize: 'hasAnyRole(\'WAREHOUSE_MANAGER\', \'WAREHOUSE_TRANSACTION_REQUESTER\')'
}

export default [{
  name: 'warehouse-location-form',
  path: '/warehouse-location',
  component: () => import('src/pages/warehouse/location-form.vue'),
  meta: {
    title: '창고 장소 관리',
    authorize: 'hasAnyRole(\'WAREHOUSE_MANAGER\')'
  },
  props: (route) => {
    return {}
  }
}, {
  name: 'warehouse-transaction-request-list',
  path: '/warehouse-transaction-request',
  component: () => import('src/pages/warehouse/transaction-request-list.vue'),
  meta: transactionRequest,
  props: (route) => {
    return {}
  },
  children: [{
    path: 'create',
    component: () => wrapModal(
        import('src/pages/warehouse/transaction-request-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push({
                path: '/warehouse-transaction-request',
                query: this.$route.query
              })
            })
          }
        }),
    meta: transactionRequest,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/warehouse/transaction-request-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push({
                path: '/warehouse-transaction-request',
                query: this.$route.query
              })
            })
          }
        }),
    meta: transactionRequest,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]

/*
export default [{
  path: '/bom',
  component: () => import('src/pages/bom/bom-list'),
  meta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('src/pages/bom/bom-form'), {
      onModalHide () {
        this.$router.push({path: '/bom', query: this.$route.query})
      }
    }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/bom/bom-form'), {
      onModalHide () {
        this.$router.push({path: '/bom', query: this.$route.query})
      }
    }),
    meta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]

*/