import {wrapModal} from './default'

let meta = {
  title: '공정 관리',
  authorize: 'hasRole(\'PROCESS_MANAGER\')'
}

let typeMeta = {
  title: '공정 유형 관리',
  authorize: 'hasRole(\'PROCESS_TYPE_MANAGER\')'
}

let preTypeMeta = {
  title: '사전 공정 유형 관리',
  authorize: 'hasRole(\'PROCESS_TYPE_MANAGER\')'
}

export default [{
  name: 'process-list',
  path: '/process',
  component: () => import('src/pages/process/process-list.vue'),
  meta: meta,
  children: [{
    name: 'process-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/process/process-form.vue'), {
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
  component: () => import('src/pages/process/process-type-list.vue'),
  meta: typeMeta,
  children: [{
    name: 'process-type-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/process/process-type-form.vue'), {
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
    component: () => wrapModal(
        import('src/pages/process/process-type-form.vue'), {
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
}, {
  name: 'preprocess-type-list',
  path: '/preprocess-type',
  component: () => import('src/pages/process/preprocess-type-list.vue'),
  meta: preTypeMeta,
  children: [{
    name: 'preprocess-type-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/process/preprocess-type-form.vue'),
        {
      onModalHide() {
        this.$router.push({path: '/preprocess-type', query: this.$route.query})
      }
    }),
    meta: preTypeMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'preprocess-type-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/process/preprocess-type-form.vue'),
        {
      onModalHide() {
        this.$router.push({path: '/preprocess-type', query: this.$route.query})
      }
    }),
    meta: preTypeMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
