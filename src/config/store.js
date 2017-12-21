import Vue from 'vue';
import Vuex from 'vuex';
import {FetchableArray} from 'src/model/Array';
import {api} from './axios';

Vue.use(Vuex);

class UserMenuArray extends FetchableArray {
  url = '/user/me/menus';
  axios = api;
};

export default new Vuex.Store({

  // You can use it as state property
  state: {
    currentTitle: '',
    authenticated: true,
    initialized: false,
    frameNeeded: true,
    authNeeded: true,
    user: JSON.parse(localStorage.getItem('USER') || '{}'),
    grantedMenus: JSON.parse(localStorage.getItem('GRANTED_MENUS') || '[]'),
    lastAccessRouter: {path: '/'}
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
    },
    grantedMenus(state) {
      return state.grantedMenus;
    },
    lastAccessRouter(state) {
      return state.lastAccessRouter;
    },
    initialized(state) {
      return state.initialized;
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
      localStorage.setItem('USER', JSON.stringify(payload));
      state.user = payload;
    },
    currentTitle(state, payload) {
      state.currentTitle = payload;
    },
    grantedMenus(state, payload) {
      localStorage.setItem('GRANTED_MENUS', JSON.stringify(payload));
      state.grantedMenus = payload;
    },
    lastAccessRouter(state, payload) {
      state.lastAccessRouter = payload;
    },
    initialized(state, payload) {
      state.initialized = payload;
    }
  },

  actions: {
    signIn(context, user) {
      context.commit('user', user);
      if (user) {
        context.commit('authenticated', true);
        let menu = new UserMenuArray();
        menu.fetch().then(() => context.commit('grantedMenus', menu));
      } else {
        context.commit('authenticated', false);
        context.commit('grantedMenus', []);
      }
    },
    signOut(context) {
      localStorage.removeItem('API_FIREBASE_TOKEN');
      context.commit('authenticated', false);
      context.commit('user', null);
      context.commit('grantedMenus', []);
      context.commit('lastAccessRouter', {path: '/'});
    }
  }
});
