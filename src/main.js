import Vue from 'vue';
import Quasar from 'quasar';
import router from './config/router';
import store from './config/store';
import install from './config/install';
import * as auth from './config/auth';

install();

let routeNext;
let routeTo;

router.beforeEach((to, from, next) => {
  store.commit('authNeeded', to.meta.auth);
  store.commit('frameNeeded', to.meta.frame);
  if (to.meta.title) {
    store.commit('currentTitle', to.meta.title);
  }
  if (store.getters.initialized) {
    next();
  } else {
    routeNext = next;
    routeTo = to;
  }
});

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    store,
    el: '#q-app',
    router,
    created() {
      auth.init().then(() => {
        if (store.getters.authNeeded &&
            !store.getters.authenticated) {
          store.commit('lastAccessRouter', routeTo);
          router.push('/sign-in');
          return;
        }
        routeNext();
      });
    },
    render: (h) => h(require('./App'))
  });
});
