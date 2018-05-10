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
  name: 'process-list',
  path: '/process',
  component: () => import('pages/process/process-list'),
  meta: meta,
  children: [{
    name: 'process-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('pages/process/process-form'), {
      onModalHide () {
        this.$router.push({path: '/process', query: this.$route.query})
      }
    }),
    meta: meta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}, {
  name: 'process-type-list',
  path: '/process-type',
  component: () => import('pages/process/process-type-list'),
  meta: typeMeta,
  children: [{
    name: 'process-type-form-create',
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
    name: 'process-type-form-show',
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
