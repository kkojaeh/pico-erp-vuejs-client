import Vue from 'vue'
import VueRouter from 'vue-router'
import {Notify} from 'quasar'
import {authenticate} from 'src/plugins/auth'

import store from '../store'

import userRoutes from './user'
import companyRoutes from './company'
import exampleRoutes from './example'
import projectRoutes from './project'
import quotationRoutes from './quotation'
import processRoutes from './process'
import itemRoutes from './item'
import bomRoutes from './bom'
import orderAcceptanceRoutes from './order-acceptance'
import workDayRoutes from './work-schedule'
import facilityRoutes from './facility'
import warehouseRoutes from './warehouse'
import puchaseRequestRoutes from './purchase-request'

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
  routes: [
    {
      path: '/',
      component: () => import('src/layouts/default'),
      children: [
        {
          name: 'index',
          path: '',
          component: () => import('src/pages/index'),
          meta: {
            title: 'Index',
            authorize: 'isAuthenticated()',
            helpLink: 'https://kkojaeh.github.io/pico-erp-docs/#/guide/'
          }
        },
        ...userRoutes,
        ...companyRoutes,
        ...quotationRoutes,
        ...projectRoutes,
        ...processRoutes,
        ...itemRoutes,
        ...bomRoutes,
        ...orderAcceptanceRoutes,
        ...exampleRoutes,
        ...workDayRoutes,
        ...facilityRoutes,
        ...warehouseRoutes,
        ...puchaseRequestRoutes
      ]
    },
    {
      name: 'sign-in',
      path: '/sign-in',
      component: () => import('src/pages/sign-in.vue'),
      meta: {
        title: '로그인',
        authorize: 'permitAll'
      }
    },
    {
      name: 'email',
      path: '/email',
      component: () => import('src/pages/email.vue'),
      meta: {
        authorize: 'permitAll'
      }
    },

    { // Always leave this as last one
      name: '404',
      path: '*',
      component: () => import('src/pages/404.vue')
    }
  ]

})

Router.beforeEach(async (to, from, next) => {
  store.commit('global/title', to.meta.title)
  store.commit('global/helpLink', to.meta.helpLink)

  if (store.getters['global/initialized']) {
    const authorized = authenticate(to.meta.authorize)
    if (authorized) {
      next()
    } else {
      const authentication = store.getters['auth/authentication']
      if (authentication.isAuthenticated()) {
        Notify.create({
          icon: 'warning',
          position: 'top-right',
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
