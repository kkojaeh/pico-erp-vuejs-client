import * as _ from 'lodash'
import { date } from 'quasar'
import Vue from 'vue'

const iso8601RegExp = /^(\d{4})-(\d\d)-(\d\d)([T ](\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:(\d\d))?)?)?$/
const booleanRegExp = /^(true|false)$/

const adjusters = [
  {
    matches: (definition) => {
      return definition === String || definition.type == String
    },
    adjust: (value, definition) => {
      if (value === '' || value === undefined || value === null) {
        return value
      }
      if (typeof value === 'string') {
        return value
      } else {
        return String(value)
      }
    },
    equals (oldValue, newValue) {
      return oldValue === newValue
    }
  },
  {
    matches: (definition) => {
      return definition == Date || definition.type == Date
    },
    adjust: (value, definition) => {
      if (value === undefined || value === null) {
        return value
      }
      if (typeof value == 'string') {
        if (iso8601RegExp.test(value)) {
          value = new Date(Date.parse(value))
        }
      }
      if (definition.firstTime) {
        value = date.adjustDate(value, {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        })
      } else if (definition.lastTime) {
        value = date.adjustDate(value, {
          hours: 23,
          minutes: 59,
          seconds: 59,
          milliseconds: 999
        })
      }
      return value
    },
    equals (oldValue, newValue) {
      if(typeof oldValue !== typeof newValue){
        return false
      }
      return date.isSameDate(oldValue, newValue)
    }
  },
  {
    matches: (definition) => {
      return definition == Boolean || definition.type == Boolean
    },
    adjust: (value, definition) => {
      if (value === undefined || value === null) {
        return value
      }
      if (value instanceof String) {
        if (booleanRegExp.test(value)) {
          value = value === 'true'
        }
      }
      return value
    },
    equals (oldValue, newValue) {
      return oldValue === newValue
    }
  },
  {
    matches: (definition) => {
      return _.isFunction(definition)
    },
    adjust: (value, definition, data) => {
      return definition.call(data, data)
    },
    equals (oldValue, newValue) {
      return oldValue === newValue
    },
    order: Number.MAX_SAFE_INTEGER
  }
]

export class DataAdjuster {

  constructor (data, definitions) {
    const targets = []
    _.forIn(definitions, (definition, name) => {
      var adjuster = adjusters.find(type => type.matches(definition))
      targets.push({
        name: name,
        adjuster: adjuster,
        definition: definition,
        order: adjuster.order || 0
      })
    })
    this.targets = _.sortBy(targets, ['order'])
    this.data = data
    this.adjust()
  }

  adjust () {
    const data = this.data
    this.targets.forEach(target => {
      const name = target.name
      const adjuster = target.adjuster
      const definition = target.definition
      const value = data[name]
      const adjusted = adjuster.adjust(value, definition, data)
      if (!adjuster.equals(value, adjusted)) {
        data[name] = adjusted
      }
    })
  }

}