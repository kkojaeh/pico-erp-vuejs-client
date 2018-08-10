import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

export class ItemSpecModel extends Model {

  get defaults () {
    return {
      variables: {}
    }
  }

  static async get (id, cacheable) {
    if (!id) {
      return new ItemSpecModel()
    }
    const response = await api.get(
      `/item/specs/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemSpecModel(response.data)
  }

  static async create (itemId) {
    const response = await api.post(`/item/specs`, {
      id: uuid(),
      itemId: itemId
    })
    return new ItemSpecModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/item/specs/${id}`)
  }

  async save () {
    await api.put(`/item/specs/${this.id}`, this)
  }

}