import {wrapModal} from './default'

let requestList = {
  title: '외주 요청 현황',
  authorize: 'hasAnyRole(\'OUTSOURCING_REQUESTER\', \'OUTSOURCING_REQUEST_MANAGER\')'
}

let requestForm = {
  title: '외주 요청 내용',
  authorize: 'hasAnyRole(\'OUTSOURCING_REQUESTER\', \'OUTSOURCING_REQUEST_MANAGER\')'
}

let acceptList = {
  title: '외주 요청 접수',
  authorize: 'hasAnyRole(\'OUTSOURCING_REQUEST_ACCEPTER\', \'OUTSOURCING_REQUEST_MANAGER\')'
}

let acceptForm = {
  title: '외주 요청 접수',
  authorize: 'hasAnyRole(\'OUTSOURCING_REQUEST_ACCEPTER\', \'OUTSOURCING_REQUEST_MANAGER\')'
}

export default [{
  name: 'outsourcing-request-list',
  path: '/outsourcing-request/request',
  component: () => import('src/pages/outsourcing-request/outsourcing-request-list.vue'),
  meta: requestList,
  children: [{
    name: 'outsourcing-request-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/outsourcing-request/outsourcing-request-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/outsourcing-request/request',
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
    name: 'outsourcing-request-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/outsourcing-request/outsourcing-request-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/outsourcing-request/request',
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
  name: 'outsourcing-request-accept-list',
  path: '/outsourcing-request/await-accept',
  component: () => import('src/pages/outsourcing-request/outsourcing-request-accept-list.vue'),
  meta: acceptList,
  children: [{
    name: 'outsourcing-request-accept-form',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/outsourcing-request/outsourcing-request-accept-form.vue'),
        {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/outsourcing-request/await-accept',
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
