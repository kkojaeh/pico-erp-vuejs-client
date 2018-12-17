import {FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from "../shared";

export class ProcessPreparationTypeModel extends Model {

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
      return new ProcessPreparationTypeModel()
    }
    const response = await api.get(
        `/process/preparation-types/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProcessPreparationTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/preparation-types/${id}`)
  }

}

export const ProcessPreparationTypeArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/preparation-types'
      }

      get axios() {
        return api
      }

      get model() {
        return ProcessPreparationTypeModel
      }
    }
)

export const ProcessPreparationTypeLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/preparation-type-query-labels?${$QS}'
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