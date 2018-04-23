import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { LabelModel } from 'src/model/shared'
import { api } from 'src/plugins/axios'

export class ItemSpecTypeModel extends Model {

  static async get (id, cacheable) {
    if (!id) {
      return new ItemSpecTypeModel()
    }
    const response = await api.get(`/item/spec-types/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemSpecTypeModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/item/spec-types/${id}`)
  }

}

export class ItemSpecTypeLabelArray extends FetchableArray {
  url = '/item/spec-type-query-labels?${$QS}'
  axios = api
  model = LabelModel

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}