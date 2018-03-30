import Quasar from 'quasar'
import * as _ from 'lodash'

export const language = Quasar.i18n.getLocale()

const mapped = {
  'ko': ['ko-kr']
}

export function languageAliases (o) {
  if (_.isObject(o)) {
    _.forIn(o, (value, key) => {
      const names = mapped[key]
      if (names) {
        names.forEach(name => {
          o[name] = value
        })
      }
    })
  }
  return o
}