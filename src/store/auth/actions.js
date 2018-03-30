import { FetchableArray } from 'src/model/array'
import { FetchableModel } from 'src/model/model'
import { api } from 'src/plugins/axios'

class UserMenuArray extends FetchableArray {
  url = '/user/me/menus'
  axios = api
}

class UserModel extends FetchableModel {
  get axios () {
    return api
  }

  get url () {
    return '/user/me'
  };
}

export const signIn = async (context, user) => {
  if (user) {
    let model = new UserModel()
    let array = new UserMenuArray()
    await Promise.all([model.fetch(), array.fetch()])
    context.commit('user', model)
    context.commit('menus', array)
  } else {
    context.commit('user', null)
    context.commit('menus', [])
  }
}

export const signOut = async (context) => {
  context.commit('user', null)
  context.commit('menus', [])
  // context.commit('router/lastAccessed', {path: '/'});
}

const authenticator = new Function('authentication', 'authorize',
  `with(authentication){return eval(authorize)}`)

export const authenticate = async (context, authorize) => {
  if (!authorize) {
    return true
  }
  const authentication = context.getters['authentication']
  return authenticator(authentication, authorize);
}