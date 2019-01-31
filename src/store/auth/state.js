export default {
  user: JSON.parse(localStorage.getItem('AUTH/USER') || '{}'),
  menus: JSON.parse(localStorage.getItem('AUTH/MENUS') || '[]'),
  token: localStorage.getItem('AUTH/TOKEN') || null,
  lastAccessed: localStorage.getItem('AUTH/LAST-ACCESSED') || null
}
