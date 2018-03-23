import { wrapModal } from './default'

let meta = {
  title: '회사 관리',
  authorize: "hasRole('COMPANY_MANAGER')"
}

export default [{
  path: '/company',
  component: () => import('pages/company/company-list'),
  meta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/company/company-form'), {
      onModalHide () {
        this.$router.push({path: '/company', query: this.$route.query})
      }
    }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/company/company-form'), {
      onModalHide () {
        this.$router.push({path: '/company', query: this.$route.query})
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
