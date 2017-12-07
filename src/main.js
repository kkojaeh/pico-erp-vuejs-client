// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar, * as All from 'quasar'
import router from './router'
import store from './store'
import axios from './axios'
import { config as firebaseConfig } from './firebase'
import firebase from 'firebase'
import Vuelidate from 'vuelidate'
import AgGrid from './ag-grid/AgGrid.vue'
import AgGridColumn from './ag-grid/AgGridColumn.vue'
import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/ag-theme-material.css'

Vue.use(Quasar, {
  components: All,
  directives: All
})
Vue.use(axios)
Vue.use(Vuelidate)
Vue.component('ag-grid', AgGrid)
Vue.component('ag-grid-column', AgGridColumn)
Vue.config.productionTip = false

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

router.beforeEach((to, from, next) => {
  if (to.path === '/sign-in') {
    store.commit('setAuthNeeded', false)
    store.commit('setFrameNeeded', false)
  }
  else {
    store.commit('setAuthNeeded', true)
    store.commit('setFrameNeeded', true)
  }
  next()
})

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    store,
    el: '#q-app',
    router,
    render: h => h(require('./App')),
    created () {
      firebase.initializeApp(firebaseConfig)
      firebase.auth().onAuthStateChanged((user) => {
        this.$store.commit('setUser', firebase.auth().currentUser)
        if (user) {
          // this.$router.push('/success')
        }
        else {
          if (this.$store.getters.isAuthNeeded) {
            this.$router.push('/sign-in')
          }
        }
      })
    }
  })
})
