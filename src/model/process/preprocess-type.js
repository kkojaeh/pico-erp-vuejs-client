import {FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from "../shared";

export class PreprocessTypeModel extends Model {

  get defaults() {
    return {
      baseCost: 0
    }
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new PreprocessTypeModel()
    }
    const response = await api.get(
        `/process/preprocess-types/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new PreprocessTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/preprocess-types/${id}`)
  }

}

export const PreprocessTypeArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/preprocess-types'
      }

      get axios() {
        return api
      }

      get model() {
        return PreprocessTypeModel
      }
    }
)

export const PreprocessTypeLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/preprocess-type-query-labels?${$QS}'
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