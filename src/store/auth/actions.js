import { FetchableArray } from 'src/model/array'
import { Model } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { MyModel, MyMenuArray } from 'src/model/user'

export const signIn = async (context, user) => {
  if (user) {
    let model = await MyModel.get()
    let array = new MyMenuArray()
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