import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'

const propertyOrders = {
  'width': 1,
  'height': 2,
  'grammage': 3,
  'incisionCount': 4
}

export class ItemSpecTypeModel extends Model {

  static async get(id, cacheable) {
    if (!id) {
      return new ItemSpecTypeModel()
    }
    const response = await api.get(
        `/item/spec-types/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemSpecTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/item/spec-types/${id}`)
  }

  getMetadata() {
    const numbers = ['integer']
    const data = JSON.parse(this.metadata)
    _.forIn(data.properties, (value, key) => {
      if (propertyOrders[key]) {
        value.propertyOrder = propertyOrders[key]
      }
      if (numbers.includes(value.type)) {
        if (_.isArray(value.enum)) {
          value.enum = value.enum.map(Number)
        }
      }
    })
    return data
  }

}

export const ItemSpecTypeLabelArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/item/spec-type-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async fetch(keyword) {
        return await super.fetch({
          query: keyword || ''
        })
      }
    }
)