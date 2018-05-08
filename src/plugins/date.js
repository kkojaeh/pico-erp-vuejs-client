import { date } from 'quasar'
import moment from 'moment'

export const dateFormat = 'YYYY-MM-DD'
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

function formatDate (value, dateFormat) {
  if (typeof value == 'string') {
    value = new Date(Date.parse(value))
  }
  if (!isNaN(value)) {
    return date.formatDate(value, dateFormat || dateTimeFormat)
  }
}

function formatDateAgo (value) {
  if (typeof value == 'string') {
    value = new Date(Date.parse(value))
  }
  if (!isNaN(value)) {
    return moment(value).fromNow()
  }
}

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {

  Vue.prototype.$date = {
    format: formatDate,
    ago: formatDateAgo
  }
}
