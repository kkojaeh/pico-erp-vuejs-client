import { wrapModal } from './default'

let meta = {
  title: '견적 관리',
  authorize: 'hasRole(\'QUOTATION_MANAGER\')'
}

export default [{
  path: '/quotation',
  component: () => import('pages/quotation/quotation-list'),
  meta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/quotation/quotation-form'), {
      onModalHide () {
        this.$router.push({path: '/quotation', query: this.$route.query})
      }
    }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/quotation/quotation-form'), {
      onModalHide () {
        this.$router.push({path: '/quotation', query: this.$route.query})
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
