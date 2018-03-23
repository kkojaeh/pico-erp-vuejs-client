import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './auth'
import global from './global'
import route from './route'

const store = new Vuex.Store({
  modules: {
    auth,
    global,
    route
  }
})

export default store
