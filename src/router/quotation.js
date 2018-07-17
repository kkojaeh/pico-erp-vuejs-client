import { wrapModal } from './default'

let meta = {
  title: '견적 관리',
  authorize: 'hasRole(\'QUOTATION_MANAGER\')',
  helpLink: 'https://kkojaeh.github.io/pico-erp-docs/#/guide/quotation/'
}

export default [{
  name: 'quotation-list',
  path: '/quotation',
  component: () => import('pages/quotation/quotation-list'),
  meta,
  children: [{
    name: 'quotation-form-create',
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
    name: 'quotation-form-show',
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
