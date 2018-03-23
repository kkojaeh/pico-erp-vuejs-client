import { wrapModal } from './default'

const userMeta = {
  title: '사용자 관리',
  authorize: 'hasRole(\'USER_MANAGER\')'
}

const groupMeta = {
  title: '그룹 관리',
  authorize: 'hasRole(\'USER_MANAGER\')'
}

const departmentMeta = {
  title: '부서 관리',
  authorize: 'hasRole(\'USER_MANAGER\')'
}
export default [{
  path: '/user',
  component: () => import('pages/user/user-list'),
  meta: userMeta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/user/user-form'), {
      onModalHide () {
        this.$router.push({path: '/user', query: this.$route.query})
      }
    }),
    meta: userMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/user/user-form'), {
      onModalHide () {
        this.$router.push({path: '/user', query: this.$route.query})
      }
    }),
    meta: userMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}, {
  path: '/group',
  component: () => import('pages/user/group-list'),
  meta: groupMeta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/user/group-form'), {
      onModalHide () {
        this.$router.push({path: '/group', query: this.$route.query})
      }
    }),
    meta: groupMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/user/group-form'), {
      onModalHide () {
        this.$router.push({path: '/group', query: this.$route.query})
      }
    }),
    meta: groupMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}, {
  path: '/department',
  component: () => import('pages/user/department-list'),
  meta: departmentMeta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/user/department-form'), {
      onModalHide () {
        this.$router.push({path: '/department', query: this.$route.query})
      }
    }),
    meta: departmentMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/user/department-form'), {
      onModalHide () {
        this.$router.push({path: '/department', query: this.$route.query})
      }
    }),
    meta: departmentMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
