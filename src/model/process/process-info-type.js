import {FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'

const propertyOrders = {
  'width': 1,
  'height': 2,
  'remark': Number.MAX_VALUE
}

export class ProcessInfoTypeModel extends Model {

  get defaults() {
    return {}
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProcessInfoTypeModel()
    }
    const response = await api.get(
        `/process/process-info-types/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProcessInfoTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/process-info-types/${id}`)
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

export const ProcessInfoTypeLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/process-info-type-query-labels?${$QS}'
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