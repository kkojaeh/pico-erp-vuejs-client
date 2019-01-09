import {wrapModal} from './default'

let meta = {
  title: '주문 접수 관리',
  authorize: 'hasRole(\'ORDER_ACCEPTANCE_MANAGER\')'
}

export default [{
  name: 'order-acceptance-list',
  path: '/order-acceptance',
  component: () => import('src/pages/order-acceptance/order-acceptance-list.vue'),
  meta,
  children: [{
    name: 'order-acceptance-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/order-acceptance/order-acceptance-form.vue'), {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/order-acceptance', query: this.$route.query})
            })
          }
        }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'order-acceptance-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/order-acceptance/order-acceptance-form.vue'), {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/order-acceptance', query: this.$route.query})
            })
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
