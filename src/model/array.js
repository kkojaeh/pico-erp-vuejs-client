import * as _ from 'lodash'
import qs from 'qs'

/* eslint-disable */

function getDescriptors(prototype, descriptors = {}) {
  if (prototype == Object.prototype) {
    return descriptors
  } else {
    const owns = Object.getOwnPropertyDescriptors(prototype)
    _.forIn(owns, (value, key) => {
      if (!descriptors[key]) {
        descriptors[key] = value
      }
    })
    return getDescriptors(Object.getPrototypeOf(prototype), descriptors)
  }
}

Array.decorate = (...types) => {
  return class extends Array {
    constructor(...args) {
      super()
      types.forEach(type => {
        Object.defineProperties(this, getDescriptors(type.prototype))
        this.initialize.apply(this, args)
      })
    }
  }
}

class ArrayDecorator {

  initialize(...args) {

  }

}

const fetchedSymbol = Symbol('fetched')
const fetchingSymbol = Symbol('fetching')

export class CollectionArray extends ArrayDecorator {
  clear() {
    this.splice(0, this.length)
  }

  remove(element) {
    const index = this.indexOf(element)
    if (index > -1) {
      return this.splice(index, 1)
    }
    throw new Error('not found element')
  }
}

export class FetchableArray extends ArrayDecorator {

  get axis() {
    throw new Error('not implemented')
  }

  get url() {
    throw new Error('not implemented')
  }

  get model() {
  }

  get fetched() {
    return this[fetchedSymbol]
  }

  set fetched(value) {
    this[fetchedSymbol] = value
  }

  get fetching() {
    return this[fetchingSymbol]
  }

  set fetching(value) {
    this[fetchingSymbol] = value
  }

  initialize(...args) {
    this.fetched = false
    this.fetching = false
  }

  async fetch(data) {
    this.fetching = true
    let result = await this.axios.get(this.resolveUrl(this.url, data),
        {data: data})
    let parsed = this.parse(result)
    if (parsed) {
      if (this.model) {
        parsed = parsed.map(o => new this.model(o))
      }
      try {
        this.splice.apply(this, [0, this.length].concat(parsed))
      } catch (e) {
      }
    }
    this.fetching = false
    this.fetched = true
    return parsed
  }

  resolveUrl(url, data) {
    if (data) {
      data = _.assign({}, data)
      data.$QS = qs.stringify(data)
    }
    return _.template(url)(data)
  }

  parse(response) {
    return response.data
  }

}

export class ValidatableArray extends ArrayDecorator {

  applyEach(element) {
  }

  isValidateTarget(element) {
    return element.phantom || element.hasChanged()
  }

  async validateElement(element) {
    return await element.validate()
  }

  async validate() {
    this.forEach(this.applyEach.bind(this))
    const results = await Promise.all(
        this.filter(this.isValidateTarget.bind(this))
        .map(this.validateElement.bind(this))
    )
    // 결과가 false 인 유효하지 않은 값이 없다면 모두 유효함
    return results.filter(valid => valid == false).length == 0
  }

}

const removedSymbol = Symbol('removed')

export class SavableArray extends ArrayDecorator {

  initialize() {
    this[removedSymbol] = []
  }

  applyEach(element) {
  }

  isSaveTarget(element) {
    return element.phantom || element.hasChanged()
  }

  isRemoveTarget(element) {
    return !element.phantom
  }

  async saveElement(element) {
    return await element.save()
  }

  async removeElement(element) {
    return await element.delete()
  }

  hasChanged() {
    return this.filter(this.isSaveTarget.bind(this)).length
        + this[removedSymbol].length > 0
  }

  async save() {
    this.forEach(this.applyEach.bind(this))
    const saveTargets = this.filter(this.isSaveTarget.bind(this))
    for (let i = 0; i < saveTargets.length; i++) {
      const target = saveTargets[i]
      await this.saveElement(target)
    }
    const removeTargets = this[removedSymbol]
    for (let i = 0; i < removeTargets.length; i++) {
      const target = removeTargets[i]
      await this.removeElement(target)
    }
    this[removedSymbol] = []
  }

  remove(element) {
    const index = this.indexOf(element)
    if (index > -1) {
      element = this.splice(index, 1)[0]
    } else {
      throw new Error('not found element')
    }
    if (this.isRemoveTarget(element)) {
      this[removedSymbol].push(element)
    }
    return element
  }

  clear() {
    this.splice(0, this.length)
    this[removedSymbol] = []
  }

}

const totalSymbol = Symbol('total')
const sizeSymbol = Symbol('size')
const pageSymbol = Symbol('page')
const sortersSymbol = Symbol('sorters')

export class PaginationArray extends FetchableArray {

  initialize(...args) {
    super.initialize(args)
    this.total = 0
    this.size = 20
    this.page = 1
    this.sorters = null
  }

  get total() {
    return this[totalSymbol]
  }

  set total(value) {
    this[totalSymbol] = value
  }

  get size() {
    return this[sizeSymbol]
  }

  set size(value) {
    this[sizeSymbol] = value
  }

  get page() {
    return this[pageSymbol]
  }

  set page(value) {
    this[pageSymbol] = value
  }

  get sorters() {
    return this[sortersSymbol]
  }

  set sorters(value) {
    this[sortersSymbol] = value
  }

}

export class SpringPaginationArray extends PaginationArray {

  resolveUrl(url, data) {

    let query = {
      size: this.size,
      page: this.page - 1
    }
    _.keys(data).forEach((key) => {
      let value = data[key]
      if (value !== undefined && value !== null && value !== '') {
        query[key] = value
      }
    })
    if (this.sorters) {
      query.sort = this.sorters.map(
          (s) => s.getField() + ',' + s.getDir().toLowerCase())
    }
    if (query) {
      query.$QS = qs.stringify(query, {arrayFormat: 'repeat'})
    }

    // array 를 query string 으로 생성시 옵션을 반복으로 사용
    return _.template(url)(query)
  }

  parse(response) {
    if (response) {
      let data = response.data
      this.total = data.totalElements
      this.size = data.size
      this.page = data.number + 1
      return data.content
    }
  }
}

/* eslint-enable */