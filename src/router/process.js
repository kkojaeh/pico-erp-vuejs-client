import { wrapModal } from './default'

let meta = {
  title: '공정 관리',
  authorize: 'hasRole(\'PROCESS_MANAGER\')'
}

let typeMeta = {
  title: '공정 유형 관리',
  authorize: 'hasRole(\'PROCESS_TYPE_MANAGER\')'
}

export default [{
  path: '/process-type',
  component: () => import('pages/process/process-type-list'),
  meta: typeMeta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/process/process-type-form'), {
      onModalHide () {
        this.$router.push({path: '/process-type', query: this.$route.query})
      }
    }),
    meta: typeMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/process/process-type-form'), {
      onModalHide () {
        this.$router.push({path: '/process-type', query: this.$route.query})
      }
    }),
    meta: typeMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
