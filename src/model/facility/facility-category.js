import {FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'

export class FacilityCategoryModel extends Model {

  get defaults() {
    return {}
  }

  static async get(id, cacheable) {
    if (!id) {
      return new FacilityCategoryModel()
    }
    const response = await api.get(
        `/facility/categories/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new FacilityCategoryModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/facility/categories/${id}`)
  }

}

export const FacilityCategoryLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/facility/facility-category-labels?${$QS}'
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