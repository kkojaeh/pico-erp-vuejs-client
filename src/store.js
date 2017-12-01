import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  // You can use it as state property
  state: {
    isAuthenticated: false,
    frameNeeded: true
  },

  // You can use it as a state getter function (probably the best solution)
  getters: {
    isAuthenticated (state) {
      return state.isAuthenticated
    },
    isFrameNeeded (state) {
      return state.frameNeeded
    }
  },

  // Mutation for when you use it as state property
  mutations: {
    setAuthenticated (state, payload) {
      state.isAuthenticated = payload
    },
    setFrameNeeded (state, payload) {
      state.frameNeeded = payload
    }
  },

  actions: {}
})
