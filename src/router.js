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

  routes: [
    {
      path: '/',
      component: load('Dashboard'),
      name: 'Dashboard',
      meta: {auth: true, frame: true}
    },

    {
      path: '/sign-in',
      component: load('SignIn'),
      name: '로그인',
      meta: {auth: false, frame: false}
    },

    {
      path: '/user',
      component: load('user/UserList'),
      name: '사용자 관리',
      meta: {auth: true, frame: true},
      children: [{
        path: 'form/:id', component: load('UserForm')
      }]
    },

    // Always leave this last one
    {path: '*', component: load('Error404'), meta: {auth: false, frame: false}} // Not found
  ]

});
