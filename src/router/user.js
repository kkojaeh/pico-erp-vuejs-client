import {wrapModal} from './default'

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

const meMeta = {
  title: '나의 계정',
  authorize: 'isAuthenticated()'
}
export default [{
  name: 'user-list',
  path: '/user',
  component: () => import('src/pages/user/user-list.vue'),
  meta: userMeta,
  children: [{
    name: 'user-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/user/user-form.vue'), {
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
    name: 'user-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/user/user-form.vue'), {
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
  name: 'group-list',
  path: '/group',
  component: () => import('src/pages/user/group-list.vue'),
  meta: groupMeta,
  children: [{
    name: 'group-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/user/group-form.vue'), {
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
    name: 'group-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/user/group-form.vue'), {
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
  name: 'department-list',
  path: '/department',
  component: () => import('src/pages/user/department-list.vue'),
  meta: departmentMeta,
  children: [{
    name: 'department-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/user/department-form.vue'), {
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
    name: 'department-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/user/department-form.vue'), {
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
}, {
  name: 'my-form',
  path: '/my',
  component: () => import('src/pages/user/my-form.vue'),
  meta: meMeta
}]
