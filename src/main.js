import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-material.css';
import 'quasar-extras/material-icons';
import Vue from 'vue';
import Quasar, * as All from 'quasar';
import router from './router';
import store from './store';
import axios from './axios';
import {config as firebaseConfig} from './firebase';
import firebase from 'firebase';
import Vuelidate from 'vuelidate';
import AgGrid from './ag-grid/AgGrid.vue';
import AgGridColumn from './ag-grid/AgGridColumn.vue';
import FilterSign from '@/common/FilterSign.vue';
import ListView from '@/common/ListView.vue';
// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`);
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

Vue.use(Quasar, {
  components: All,
  directives: All
});

Vue.use(axios);
Vue.use(Vuelidate);
Vue.component('ag-grid', AgGrid);
Vue.component('ag-grid-column', AgGridColumn);
Vue.component('c-filter-sign', FilterSign);
Vue.component('c-list-view', ListView);
Vue.config.productionTip = false;

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font');
}

// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

router.beforeEach((to, from, next) => {
  store.commit('authNeeded', to.meta.auth);
  store.commit('frameNeeded', to.meta.frame);
  store.commit('currentTitle', to.name);
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
          user.getIdToken().then(
              (token) => localStorage.setItem('API_FIREBASE_TOKEN', token));
          this.$store.commit('authenticated', true);
          // this.$router.push('/success')
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
