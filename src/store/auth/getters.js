import { Authentication } from 'src/plugins/auth'

export const user = (state) => {
  return state.user
}
export const menus = (state) => {
  return state.menus
}
export const authentication = (state) => {
  return state.user ? new Authentication(state.user, state.user.roles)
    : new Authentication(null, [])
}

