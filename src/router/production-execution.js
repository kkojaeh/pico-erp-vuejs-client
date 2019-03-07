import {wrapModal} from "./default";

let awaitList = {
  title: '생산 진행 대기 현황',
  authorize: 'hasAnyRole(\'PRODUCTION_EXECUTOR\', \'PRODUCTION_EXECUTE_MANAGER\')'
}

let listByOrder = {
  title: '생산 진행',
  authorize: 'hasAnyRole(\'PRODUCTION_EXECUTOR\', \'PRODUCTION_EXECUTE_MANAGER\')'
}

export default [{
  name: 'production-order-await-production-execution-list',
  path: '/production-execution/await-execution',
  component: () => import('src/pages/production-execution/production-order-await-execution-list.vue'),
  meta: awaitList
}, {
  name: 'production-order-production-execution-list',
  path: '/production-execution/order/:id',
  component: () => import('src/pages/production-execution/production-order-production-execution-list.vue'),
  meta: listByOrder,
  props: (route) => {
    return {
      id: route.params.id
    }
  }
}]


