import firebase from 'firebase';
import store from './store';

const firebaseProjectId = document.querySelector(
    'meta[name=firebase-project-id]').content;
let config;
if (firebaseProjectId === 'pico-erp-dev') {
  config = {
    apiKey: 'AIzaSyBaS7v9fhkK6Nn6MBqV02ej5T3ffdDKujc',
    authDomain: 'pico-erp-dev.firebaseapp.com',
    databaseURL: 'https://pico-erp-dev.firebaseio.com',
    projectId: 'pico-erp-dev',
    storageBucket: 'pico-erp-dev.appspot.com',
    messagingSenderId: '211743559657'
  };
} else if (firebaseProjectId === 'pico-erp-prd') {
  config = {
    apiKey: 'AIzaSyBD3_7mawl1eTovCDWJEO1_0pdj4-0Z75I',
    authDomain: 'pico-erp-prd.firebaseapp.com',
    databaseURL: 'https://pico-erp-prd.firebaseio.com',
    projectId: 'pico-erp-prd',
    storageBucket: 'pico-erp-prd.appspot.com',
    messagingSenderId: '1073558054534'
  };
} else {
  throw new Error(`${firebaseProjectId} is not allowed firebase project id`);
}

export function signIn(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export function signOut() {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut().then(() => {
      store.dispatch('signOut');
      resolve();
    }).catch((e) => {
      reject(e);
    });
  });
};

let app;

export function init() {
  return new Promise((resolve, reject) => {
    if (!app) {
      app = firebase.initializeApp(config);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken(true).then(
            (token) => {
              localStorage.setItem('API_FIREBASE_TOKEN', token);
              store.commit('initialized', true);
              store.dispatch('signIn', firebase.auth().currentUser);
              resolve(true);
            });
      } else {
        store.commit('initialized', true);
        store.dispatch('signIn', null);
        resolve(false);
      }
    });
  });
};
