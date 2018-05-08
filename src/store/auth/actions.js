import { FetchableArray } from 'src/model/array'
import { Model } from 'src/model/model'
import { api } from 'src/plugins/axios'

class UserMenuArray extends FetchableArray {
  url = '/user/me/menus'
  axios = api
}

class UserModel extends Model {

  static async get () {
    const response = await api.get('/user/me')
    return new UserModel(response.data)
  }
}

export const signIn = async (context, user) => {
  if (user) {
    let model = await UserModel.get()
    let array = new UserMenuArray()
    await array.fetch()
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