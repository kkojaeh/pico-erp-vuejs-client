import * as _ from 'lodash'
import Vue from 'vue'
import validate from 'validate.js'
import {date} from 'quasar'
import uuidv4 from 'uuid/v4'

const snapshotSymbol = Symbol('snapshot')

export class Model {

  constructor(data) {
    _.assign(this, data)
    this.snapshot()
    _.defaults(this, this.defaults)
    this.$errors = this.defaultErrors
  }

  get defaults() {
    return {}
  }

  get defaultErrors() {
    return {}
  }

  async $validate(constraints) {
    try {
      this.$errors = this.defaultErrors
      await validate.async(this, constraints, validate.globalOptions)
      return true
    } catch (e) {
      if (!_.isError(e)) {
        const errors = {}
        _.keys(e).forEach((key) => {
          _.set(errors, key, e[key].join('\n'))
        })
        console.log(errors)
        _.keys(errors).forEach((key) => {
          Vue.set(this.$errors, key, errors[key])
        })
        return false
      }
    }
  }

  snapshot() {
    this[snapshotSymbol] = _.assign({}, this)
  }

  hasChanged(property) {
    const snapshot = this[snapshotSymbol]
    if (property) {
      return !this.equals(snapshot[property], this[property])
    }
    return !_.keys(snapshot).reduce(
        (acc, key) => acc && this.equals(snapshot[key], this[key]), true)
  }

  equals(a, b) {
    return _.isEqual(a, b)
  }

  assign(data) {
    _.assign(this, data)
  }
}

export async function exists(axios, url, data) {
  try {
    let response = await axios.get(url, {
      data: data,
      preventDefault: true
    })
    return !!response.data
  } catch (e) {
    if (e.response.status == 404) {
      return false
    } else {
      e.resumePreventDefault()
      throw e
    }
  }
}

export function uuid() {
  return uuidv4()
}