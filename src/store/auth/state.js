export default {
  user: JSON.parse(localStorage.getItem('AUTH/USER') || '{}'),
  menus: JSON.parse(localStorage.getItem('AUTH/MENUS') || '[]')
}
