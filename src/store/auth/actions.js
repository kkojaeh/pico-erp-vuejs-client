import {MyModel} from 'src/model/user'
import {Menu} from 'src/model/menu'

export const signIn = async (context, user) => {
  if (user) {
    let model = await MyModel.get()
    context.commit('user', model)
    context.commit('menus', Menu.getAuthorized())
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