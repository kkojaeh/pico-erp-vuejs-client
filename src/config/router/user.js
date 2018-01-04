import {load, wrapModal} from './default';

let userMeta = {
  title: '사용자 관리',
  auth: true,
  frame: true
};

let groupMeta = {
  title: '그룹 관리',
  auth: true,
  frame: true
};

export default [{
  path: '/user',
  component: load('user/UserList'),
  meta: userMeta,
  children: [{
    path: 'create',
    component: wrapModal(load('user/UserForm'), {
      onModalClose() {
        this.$router.push({path: '/user', query: this.$route.query});
      }
    }),
    meta: userMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: wrapModal(load('user/UserForm'), {
      onModalClose() {
        this.$router.push({path: '/user', query: this.$route.query});
      }
    }),
    meta: userMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      };
    }
  }]
}, {
  path: '/group',
  component: load('user/GroupList'),
  meta: groupMeta,
  children: [{
    path: 'create',
    component: wrapModal(load('user/GroupForm'), {
      onModalClose() {
        this.$router.push({path: '/group', query: this.$route.query});
      }
    }),
    meta: groupMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: wrapModal(load('user/GroupForm'), {
      onModalClose() {
        this.$router.push({path: '/group', query: this.$route.query});
      }
    }),
    meta: groupMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      };
    }
  }]
}];
