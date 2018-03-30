export const user = (state, payload) => {
  localStorage.setItem('AUTH/USER', JSON.stringify(payload))
  state.user = payload
}
export const menus = (state, payload) => {
  localStorage.setItem('AUTH/MENUS', JSON.stringify(payload))
  state.menus = payload
}