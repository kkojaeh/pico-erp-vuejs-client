import { exists, Model, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { SpringPaginationArray } from '../array'

export class ProcessModel extends Model {

  get defaults () {
    return {
      difficulty: 'NORMAL'
    }
  }

  static async get (id, cacheable) {
    if (!id) {
      return new ProcessModel()
    }
    const response = await api.get(
      `/process/processes/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/process/processes/${id}`)
  }

  static async getByItemId (itemId, cacheable) {
    if (!itemId) {
      return new ProcessModel()
    }
    const response = await api.get(
      `/process/items/${itemId}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async existsByItemId (itemId) {
    return await exists(api, `/process/items/${itemId}`)
  }

  async create () {
    this.id = uuid()
    const response = await api.post('/process/processes', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/process/processes/${this.id}`, this)
  }

  async delete () {
    await api.delete(`/process/processes/${this.id}`)
  }

  async validate (state) {
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

  async validateCreate () {
    return await this.validate('create')
  }

  async validateUpdate () {
    return await this.validate('update')
  }
}

export class ProcessPaginationArray extends SpringPaginationArray {
  url = '/process/processes'
  axios = api
  model = ProcessModel
}