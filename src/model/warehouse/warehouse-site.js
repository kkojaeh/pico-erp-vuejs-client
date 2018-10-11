import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'

export class WarehouseSiteModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      type: 'site'
    }
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WarehouseSiteModel()
    }
    const response = await api.get(
        `/warehouse/location/sites/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseSiteModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/location/sites/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    if (this.phantom) {
      const response = await api.post(`/warehouse/location/sites`, data)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/location/sites/${this.id}`, data)
    }
  }

  async delete() {
    await api.delete(`/warehouse/location/sites/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      code: {
        presence: true,
        length: {minimum: 1, maximum: 2}
      }
    }
    return await this.$validate(constraints)
  }

}

export const WarehouseSiteArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/sites'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseSiteModel
      }

    }
)