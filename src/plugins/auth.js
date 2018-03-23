import firebase from 'firebase'
import * as _ from 'lodash'
import store from 'src/store'

const firebaseProjectId = document.querySelector(
  'meta[name=firebase-project-id]').content
let config
if (firebaseProjectId === 'pico-erp-dev') {
  config = {
    apiKey: 'AIzaSyBaS7v9fhkK6Nn6MBqV02ej5T3ffdDKujc',
    authDomain: 'pico-erp-dev.firebaseapp.com',
    databaseURL: 'https://pico-erp-dev.firebaseio.com',
    projectId: 'pico-erp-dev',
    storageBucket: 'pico-erp-dev.appspot.com',
    messagingSenderId: '211743559657'
  }
} else if (firebaseProjectId === 'pico-erp-prd') {
  config = {
    apiKey: 'AIzaSyBD3_7mawl1eTovCDWJEO1_0pdj4-0Z75I',
    authDomain: 'pico-erp-prd.firebaseapp.com',
    databaseURL: 'https://pico-erp-prd.firebaseio.com',
    projectId: 'pico-erp-prd',
    storageBucket: 'pico-erp-prd.appspot.com',
    messagingSenderId: '1073558054534'
  }
} else {
  throw new Error(`${firebaseProjectId} is not allowed firebase project id`)
}

let filebaseApp


export function signIn (email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function signOut () {
  await firebase.auth().signOut()
  localStorage.removeItem('API_FIREBASE_TOKEN')
  await store.dispatch('auth/signOut')
}

export function init () {
  return new Promise((resolve, reject) => {
    if (!filebaseApp) {
      filebaseApp = firebase.initializeApp(config)
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken(true).then(
          (token) => {
            localStorage.setItem('API_FIREBASE_TOKEN', token)
            store.commit('global/initialized', true)
            store.dispatch('auth/signIn', firebase.auth().currentUser)
            resolve()
          })
      } else {
        store.commit('global/initialized', true)
        store.dispatch('auth/signIn', null)
        resolve()
      }
    })
  })
}

export default ({Vue}) => {

  Vue.prototype.$auth = {
    signIn,
    signOut,
    init
  }

}

/**

 hasRole([role])	Returns true if the current principal has the specified role.
 hasAnyRole([role1,role2])	Returns true
 if the current principal has any of the supplied roles (given as a comma-separated list of strings)
 principal	Allows direct access to the principal object representing the current user
 authentication	Allows direct access to the current Authentication object obtained from the SecurityContext
 permitAll	Always evaluates to true
 denyAll	Always evaluates to false
 isAnonymous()	Returns true if the current principal is an anonymous user
 isRememberMe()	Returns true if the current principal is a remember-me user
 isAuthenticated()	Returns true if the user is not anonymous
 isFullyAuthenticated()

 */
export class Authentication {

  constructor (principal, roles) {
    this.principal = principal
    this.roles = roles || []
    this.permitAll = true
    this.denyAll = false
  }

  hasRole () {
    return [...arguments].filter(role => !_.includes(this.roles, role)).length
      == 0
  }

  hasAnyRole (roles) {
    return [...arguments].filter((role) => _.includes(this.roles, role)).length
      > 0
  }

  isAnonymous () {
    return this.principal == null
  }

  isAuthenticated () {
    return !!this.principal
  }
}

