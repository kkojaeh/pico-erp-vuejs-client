import {wrapModal} from './default'

let requestList = {
  title: '구매 요청 현황',
  authorize: 'hasAnyRole(\'PURCHASE_REQUESTER\', \'PURCHASE_REQUEST_MANAGER\')'
}

let requestForm = {
  title: '구매 요청 내용',
  authorize: 'hasAnyRole(\'PURCHASE_REQUESTER\', \'PURCHASE_REQUEST_MANAGER\')'
}

let acceptList = {
  title: '구매 요청 접수',
  authorize: 'hasAnyRole(\'PURCHASE_REQUEST_ACCEPTER\', \'PURCHASE_REQUEST_MANAGER\')'
}

let acceptForm = {
  title: '구매 요청 접수',
  authorize: 'hasAnyRole(\'PURCHASE_REQUEST_ACCEPTER\', \'PURCHASE_REQUEST_MANAGER\')'
}

export default [{
  name: 'purchase-request-list',
  path: '/purchase-request/request',
  component: () => import('src/pages/purchase-request/purchase-request-list.vue'),
  meta: requestList,
  children: [{
    name: 'purchase-request-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/purchase-request/purchase-request-form.vue'), {
          onModalHide() {
            this.$router.push(
                {path: '/purchase-request/request', query: this.$route.query})
          }
        }),
    meta: requestForm,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'purchase-request-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/purchase-request/purchase-request-form.vue'), {
          onModalHide() {
            this.$router.push(
                {path: '/purchase-request/request', query: this.$route.query})
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
  name: 'purchase-request-accept-list',
  path: '/purchase-request/await-accept',
  component: () => import('src/pages/purchase-request/purchase-request-accept-list.vue'),
  meta: acceptList,
  children: [{
    name: 'purchase-request-accept-form',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/purchase-request/purchase-request-accept-form.vue'), {
          onModalHide() {
            this.$router.push(
                {
                  path: '/purchase-request/await-accept',
                  query: this.$route.query
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
