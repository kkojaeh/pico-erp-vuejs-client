import {load, wrapModal} from './default';

let meta = {
  title: '사용자 관리',
  auth: true,
  frame: true
};

export default {
  path: '/user',
  component: load('user/UserList'),
  meta,
  children: [{
    path: 'create',
    component: wrapModal(load('user/UserForm'), {
      onModalClose() {
        this.$router.push({path: '/user', query: this.$route.query});
      }
    }),
    meta,
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
    meta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      };
    }
  }]
};
