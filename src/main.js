import Vue from 'vue';
import Quasar from 'quasar';
import router from './router';
import store from './store';
import {config as firebaseConfig} from './firebase';
import firebase from 'firebase';
import install from './install';

install();

router.beforeEach((to, from, next) => {
  store.commit('authNeeded', to.meta.auth);
  store.commit('frameNeeded', to.meta.frame);
  if (to.meta.title) {
    store.commit('currentTitle', to.meta.title);
  }
  next();
});

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    store,
    el: '#q-app',
    router,
    render: (h) => h(require('./App')),
    created() {
      firebase.initializeApp(firebaseConfig);
      firebase.auth().onAuthStateChanged((user) => {
        this.$store.commit('user', firebase.auth().currentUser);
        if (user) {
          user.getIdToken(true).then(
              (token) => localStorage.setItem('API_FIREBASE_TOKEN', token));
          this.$store.commit('authenticated', true);
        } else {
          this.$store.commit('authenticated', false);
          if (this.$store.getters.authNeeded &&
              !this.$store.getters.authenticated) {
            this.$router.push('/sign-in');
          }
        }
      });
    }
  });
});
