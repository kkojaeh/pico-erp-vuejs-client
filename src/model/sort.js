import qs from 'qs'
import * as _ from 'lodash'

export default class Sort {
  constructor (field, dir = 'ASC') {
    if (!field) {
      throw new Error('field is null')
    }
    this.field = field
    this.dir = dir.toUpperCase()
  }

  static toQueryString (sorts) {
    return qs.stringify(sorts.map((s) => {
      let o = {}
      o[s.field] = s.dir
      return o
    }), {
      arrayFormat: 'repeat'
    })
  }

  static parseQueryString (queryString) {
    let parsed = qs.parse(queryString)
    return _.values(parsed).map((o) => {
      let sort
      _.forIn(o, (value, key) => {
        sort = new Sort(key, value)
      })
      return sort
    }).filter(s => !s)
  }

  static createSort (field, dir) {
    return new Sort(field, dir)
  }

  getField () {
    return this.field
  }

  getDir () {
    return this.dir
  }
}
