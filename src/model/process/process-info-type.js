import {FetchableArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'

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

      async query(keyword) {
        return await this.fetch({
          query: keyword || ''
        })
      }
    }
)