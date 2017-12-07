import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  // You can use it as state property
  state: {
    isAuthenticated: false,
    frameNeeded: true,
    authNeeded: true,
    user: null
  },

  // You can use it as a state getter function (probably the best solution)
  getters: {
    isAuthNeeded (state) {
      return state.authNeeded
    },
    isAuthenticated (state) {
      return state.isAuthenticated
    },
    isFrameNeeded (state) {
      return state.frameNeeded
    },
    getUser (state) {
      return state.user
    }
  },

  // Mutation for when you use it as state property
  mutations: {
    setAuthNeeded (state, payload) {
      state.authNeeded = payload
    },
    setAuthenticated (state, payload) {
      state.isAuthenticated = payload
    },
    setFrameNeeded (state, payload) {
      state.frameNeeded = payload
    },
    setUser (state, payload) {
      state.user = payload
    }
  },

  actions: {}
})
