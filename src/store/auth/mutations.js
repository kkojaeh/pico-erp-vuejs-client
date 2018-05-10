export const user = (state, payload) => {
  localStorage.setItem('AUTH/USER', JSON.stringify(payload))
  state.user = payload
  ga('set', 'userId', payload.email);
}
export const menus = (state, payload) => {
  localStorage.setItem('AUTH/MENUS', JSON.stringify(payload))
  state.menus = payload
}

export const token = (state, payload) => {
  localStorage.setItem('AUTH/TOKEN', payload)
  state.token = payload
}