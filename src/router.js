import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// jscs:disable
function load(component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`);
}

// jscs:enable

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [{
    path: '/',
    component: load('Dashboard'),
    meta: {
      title: 'Dashboard',
      auth: true,
      frame: true
    }
  }, {
    path: '/sign-in',
    component: load('SignIn'),
    meta: {
      title: '로그인',
      auth: false,
      frame: false
    }
  }, {
    path: '/user',
    component: load('user/UserList'),
    meta: {
      title: '사용자 관리',
      auth: true,
      frame: true
    },
    children: [{
      path: 'create',
      component: load('user/UserForm'),
      meta: {
        title: '사용자 관리',
        auth: true,
        frame: true
      },
      props: {
        action: 'create',
        closable: true
      }
    }, {
      path: 'show/:id',
      component: load('user/UserForm'),
      meta: {
        title: '사용자 관리',
        auth: true,
        frame: true
      },
      props: (route) => {
        return {
          id: route.params.id,
          action: 'show',
          closable: true
        };
      }
    }]
  },
    {
      // Not found
      path: '*',
      component: load('Error404'),
      meta: {
        auth: false,
        frame: false
      }
    }
  ]

})
;
