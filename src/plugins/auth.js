import firebase from 'firebase'
import * as _ from 'lodash'
import store from 'src/store'
import {firebaseConfig} from 'src/plugins/config'

let filebaseApp

export function signIn (email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export async function signOut () {
  await firebase.auth().signOut()
  store.commit('auth/token', null)
  await store.dispatch('auth/signOut')
}

export function init () {
  return new Promise((resolve, reject) => {
    if (!filebaseApp) {
      filebaseApp = firebase.initializeApp(firebaseConfig)
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken(true).then(
          (token) => {
            store.commit('auth/token', token)
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
    init
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

