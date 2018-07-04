import * as _ from 'lodash'
import { date } from 'quasar'

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
      if (typeof oldValue !== typeof newValue) {
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

const PostCode = window.daum.Postcode

export class AddressSelector {
  constructor(){
    this.width = 500
    this.height = 600
    this.popupName = 'address-selector'
    this.autoClose = true
  }

  select(keyword){
    return new Promise((resolve, reject) => {
      let p = new PostCode({
        oncomplete: (data) => {
          resolve({
            'postalCode': data.zonecode,
            'street': data.roadAddress
          })
        }
      })
      // open({q: '검색어', left: '팝업위치 x값', top: '팝업위치 y값', popupName: '팝업이름', autoClose: '자동닫힘유무'})
      p.open({
        q: keyword,
        popupName: 'address-input-popup',
        left: (window.screen.width / 2) - (this.width / 2),
        top: (window.screen.height / 2) - (this.height / 2),
        autoClose: this.autoClose
      })
    })
  }
}