import {FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'

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

}

export const ItemSpecTypeLabelArray = Array.decorate(
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

      async query(keyword) {
        return await this.fetch({
          query: keyword || ''
        })
      }
    }
)