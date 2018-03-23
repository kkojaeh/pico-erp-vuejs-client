import Vue from 'vue'
import VueRouter from 'vue-router'
import { Notify } from 'quasar'

import routes from './routes'
import store from '../store'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return {x: 0, y: 0}
    }
  },
  routes
})

Router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    store.commit('global/title', to.meta.title)
  }

  if (store.getters['global/initialized']) {
    const authorized = await store.dispatch('auth/authenticate',
      to.meta.authorize)
    if (authorized) {
      next()
    } else {
      const authentication = store.getters['auth/authentication']
      if (authentication.isAuthenticated()) {
        Notify.create({
          icon: 'warning',
          position: 'bottom-right',
          message: '권한이 없습니다'
        })
        if (from) {
          // 전 페이지로
          Router.push(from)
        } else {
          // 로그인 페이지로
          Router.push('/sign-in')
        }
      } else {
        // 로그인 페이지로
        Router.push('/sign-in')
      }
    }
  } else {
    store.commit('route/to', to)
    store.commit('route/next', next)
  }
})

export default Router
