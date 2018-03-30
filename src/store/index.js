import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import global from './global'
import route from './route'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    global,
    route
  }
})

export default store
