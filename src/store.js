import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  // You can use it as state property
  state: {
    currentTitle: '',
    authenticated: false,
    frameNeeded: true,
    authNeeded: true,
    user: null
  },

  // You can use it as a state getter function (probably the best solution)
  getters: {
    authNeeded(state) {
      return state.authNeeded;
    },
    authenticated(state) {
      return state.authenticated;
    },
    frameNeeded(state) {
      return state.frameNeeded;
    },
    user(state) {
      return state.user;
    },
    currentTitle(state) {
      return state.currentTitle;
    }
  },

  // Mutation for when you use it as state property
  mutations: {
    authNeeded(state, payload) {
      state.authNeeded = payload;
    },
    authenticated(state, payload) {
      state.authenticated = payload;
    },
    frameNeeded(state, payload) {
      state.frameNeeded = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    currentTitle(state, payload) {
      state.currentTitle = payload;
    }
  },

  actions: {}
});
