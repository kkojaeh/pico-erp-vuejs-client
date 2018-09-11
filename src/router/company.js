import {wrapModal} from './default'

let meta = {
  title: '회사 관리',
  authorize: 'hasRole(\'COMPANY_MANAGER\')'
}

export default [{
  name: 'company-list',
  path: '/company',
  component: () => import('src/pages/company/company-list'),
  meta,
  children: [{
    name: 'company-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/company/company-form'), {
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
    name: 'company-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/company/company-form'), {
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
