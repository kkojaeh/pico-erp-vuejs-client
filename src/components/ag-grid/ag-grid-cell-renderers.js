import { date } from 'quasar'

export function dateCellRenderer (params) {
  if (params.value) {
    return date.formatDate(params.value, 'YYYY-MM-DD')
  }
  return null
}

export function dateTimeCellRenderer (params) {
  if (params.value) {
    return date.formatDate(params.value, 'YYYY-MM-DD HH:mm:ss')
  }
  return null
}
