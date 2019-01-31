export const user = (state, payload) => {
  localStorage.setItem('AUTH/USER', JSON.stringify(payload))
  state.user = payload
}
export const menus = (state, payload) => {
  localStorage.setItem('AUTH/MENUS', JSON.stringify(payload))
  state.menus = payload
}

export const token = (state, payload) => {
  localStorage.setItem('AUTH/TOKEN', payload)
  state.token = payload
}

export const lastAccessed = (state, payload) => {
  localStorage.setItem('AUTH/LAST-ACCESSED', payload)
  state.lastAccessed = payload
}