import {wrapModal} from './default'

let requestList = {
  title: '생산 요청 현황',
  authorize: 'hasAnyRole(\'PRODUCTION_REQUESTER\', \'PRODUCTION_REQUEST_MANAGER\')'
}

let requestForm = {
  title: '생산 요청 내용',
  authorize: 'hasAnyRole(\'PRODUCTION_REQUESTER\', \'PRODUCTION_REQUEST_MANAGER\')'
}

let acceptList = {
  title: '생산 요청 접수',
  authorize: 'hasAnyRole(\'PRODUCTION_REQUEST_ACCEPTER\', \'PRODUCTION_REQUEST_MANAGER\')'
}

let acceptForm = {
  title: '생산 요청 접수',
  authorize: 'hasAnyRole(\'PRODUCTION_REQUEST_ACCEPTER\', \'PRODUCTION_REQUEST_MANAGER\')'
}

export default [{
  name: 'production-request-list',
  path: '/production-request/request',
  component: () => import('src/pages/production-request/production-request-list.vue'),
  meta: requestList,
  children: [{
    name: 'production-request-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/production-request/production-request-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-request/request',
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
    name: 'production-request-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/production-request/production-request-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-request/request',
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
  name: 'production-request-accept-list',
  path: '/production-request/await-accept',
  component: () => import('src/pages/production-request/production-request-accept-list.vue'),
  meta: acceptList,
  children: [{
    name: 'production-request-accept-form',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/production-request/production-request-accept-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-request/await-accept',
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
