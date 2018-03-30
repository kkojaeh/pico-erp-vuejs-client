export const preAuthorize = (context, user) => {
  context.commit('auth/user', user)
  if (user) {
    let menu = new UserMenuArray()
    menu.fetch().then(() => context.commit('auth/menus', menu))
  } else {
    context.commit('auth/menus', [])
  }
}