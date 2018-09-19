import firebase from 'firebase/app'
import 'firebase/auth'
import * as _ from 'lodash'
import store from 'src/store'
import {Loading} from 'quasar'
import qs from 'qs'

const firebaseApiKey = document.querySelector(
  'meta[name=firebase-api-key]').content
const firebasePersistence = document.querySelector(
  'meta[name=firebase-persistence]').content

let firebaseApp

export async function signIn (email, password) {
  await firebase.auth().setPersistence(firebasePersistence)
  return await firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function signOut () {
  await firebase.auth().signOut()
  store.commit('auth/token', null)
  await store.dispatch('auth/signOut')
}

export function init () {
  Loading.show({
    delay: 0
  })
  return new Promise((resolve, reject) => {
    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp({
        apiKey: firebaseApiKey
      })
      firebase.auth().useDeviceLanguage()
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken(true).then(
          async (token) => {
            store.commit('auth/token', token)
            store.commit('global/initialized', true)
            await store.dispatch('auth/signIn', firebase.auth().currentUser)
            Loading.hide()
            resolve()
          })
      } else {
        store.commit('global/initialized', true)
        store.dispatch('auth/signIn', null)
        Loading.hide()
        resolve()
      }
    })
  })
}

export async function resetPassword (email) {
  return await firebase.auth().sendPasswordResetEmail(email, {})
}

export async function verifyAndConfirmPasswordReset (password) {
  const actionCode = qs.parse(location.search).oobCode
  await firebaseApp.auth().verifyPasswordResetCode(actionCode)
  await firebaseApp.auth().confirmPasswordReset(actionCode, password)
}

export function authorizedUrl(url) {
  const authorizedQs = store.getters['auth/tokenParameterName'] + '='
      + store.getters['auth/token']
  return url + (_.includes(url, '?') ? '&' : '?') + authorizedQs;
}

const authenticator = new Function('authentication', 'authorize',
  `with(authentication){return eval(authorize)}`)

export const authenticate = (authorize) => {
  if (!authorize) {
    return true
  }
  const authentication = store.getters['auth/authentication']
  return authenticator(authentication, authorize)
}

export default ({Vue, store}) => {

  Vue.prototype.$auth = {
    signIn,
    signOut,
    init,
    resetPassword
  }

  Vue.mixin({
    beforeCreate: function () {
      const options = this.$options
      const authorized = options.authorized
      if (authorized) {
        const $authorized = {}
        _.forIn(authorized,
          (value, key) => $authorized[key] = authenticate(value))
        if (!options.computed) {
          options.computed = {}
        }
        if (options.computed.$authorized) {
          return
        }
        options.computed.$authorized = function () {
          return $authorized
        }
      }
    }
  })

}

/**

 hasRole([role])  Returns true if the current principal has the specified role.
 hasAnyRole([role1,role2])  Returns true
 if the current principal has any of the supplied roles (given as a comma-separated list of strings)
 principal  Allows direct access to the principal object representing the current user
 authentication  Allows direct access to the current Authentication object obtained from the SecurityContext
 permitAll  Always evaluates to true
 denyAll  Always evaluates to false
 isAnonymous()  Returns true if the current principal is an anonymous user
 isRememberMe()  Returns true if the current principal is a remember-me user
 isAuthenticated()  Returns true if the user is not anonymous
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

