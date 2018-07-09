import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {SpringPaginationArray} from '../array'

export class ProcessModel extends Model {

  get defaults() {
    return {
      difficulty: 'NORMAL'
    }
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProcessModel()
    }
    const response = await api.get(
        `/process/processes/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/processes/${id}`)
  }

  static async getByItemId(itemId, cacheable) {
    if (!itemId) {
      return new ProcessModel()
    }
    const response = await api.get(
        `/process/items/${itemId}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async existsByItemId(itemId) {
    return await exists(api, `/process/items/${itemId}`)
  }

  get phantom() {
    return !this.id
  }

  async save() {
    if(this.phantom) {
      this.id = uuid()
      const response = await api.post('/process/processes', this)
      this.assign(response.data)
    }else{
      await api.put(`/process/processes/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(`/process/processes/${this.id}`)
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 3, maximum: 100}
      },
      difficulty: {
        presence: true
      },
      typeId: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProcessPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/process/processes?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProcessModel
      }
    }
)
