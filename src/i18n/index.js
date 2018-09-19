//import {i18n} from 'quasar'
import Vue from 'vue'
import * as _ from 'lodash'

export const language = Vue.prototype.$q.i18n.getLocale()

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