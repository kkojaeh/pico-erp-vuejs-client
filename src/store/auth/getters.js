import {Authentication} from 'src/plugins/auth'

export const user = (state) => {
  return state.user
}
export const menus = (state) => {
  return state.menus
}
export const token = (state) => {
  return state.token
}
export const tokenHeaderName = (state) => {
  return 'X-Firebase-Auth'
}

export const tokenParameterName = (state) => {
  return '_firebase_auth'
}

export const authentication = (state) => {
  return state.user ? new Authentication(state.user, state.user.wholeRoles)
    : new Authentication(null, [])
}

export const lastAccessed = (state) => {
  return state.lastAccessed
}

