import { FetchableArray } from 'src/model/array'
import { exists, Model } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class ProcessInfoTypeModel extends Model {

  get defaults () {
    return {}
  }

  static async get (id, cacheable) {
    if (!id) {
      return new ProcessInfoTypeModel()
    }
    const response = await api.get(
      `/process/process-info-types/${id}${cacheable ? '' : '?cb='
        + Date.now()}`)
    return new ProcessInfoTypeModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/process/process-info-types/${id}`)
  }

}

export class ProcessInfoTypeLabelArray extends FetchableArray {
  url = '/process/process-info-type-query-labels?${$QS}'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}