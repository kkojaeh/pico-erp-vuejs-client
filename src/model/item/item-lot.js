import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {SpringPaginationArray} from "src/model/array";

export class ItemLotModel extends Model {

  get defaults() {
    return {}
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ItemLotModel()
    }
    const response = await api.get(
        `/item/lots/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemLotModel(response.data)
  }

  static async create(itemId) {
    const response = await api.post(`/item/lots`, {
      id: uuid(),
      itemId: itemId
    })
    return new ItemLotModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/item/lots/${id}`)
  }

  async save() {
    await api.put(`/item/lots/${this.id}`, this)
  }

}

export const ItemLotPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/item/lots?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ItemLotModel
      }
    }
)