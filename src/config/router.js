import Vue from 'vue';
// import {QModal} from 'quasar';
import VueRouter from 'vue-router';
import {load} from './router/default';
import user from './router/user';
import company from './router/company';

Vue.use(VueRouter);

let routes = [{
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
}];

routes.push(user);

routes.push(company);

// 절대 마지막에 있어야 함
routes.push({
  // Not found
  path: '*',
  component: load('Error404'),
  meta: {
    auth: false,
    frame: false
  }
});

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

  routes

});
