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

Array.decorate = (ArrayDecoratorType) => {
  return class extends Array {
    constructor(...args) {
      super()
      Object.defineProperties(this, getDescriptors(ArrayDecoratorType.prototype))
      this.initialize(args)
    }
  }
}

class ArrayDecorator {

  initialize(...args) {

  }

}

const fetchedSymbol = Symbol('fetched')
const fetchingSymbol = Symbol('fetching')

export class FetchableArray extends ArrayDecorator{

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
        parsed = parsed.map((o) => new this.model(o))
      }
      try {
        this.splice.apply(this, [0, this.length].concat(parsed))
      }catch(e){
        debugger
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