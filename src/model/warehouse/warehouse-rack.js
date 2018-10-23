import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'

export class WarehouseRackModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      type: 'rack'
    }
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WarehouseRackModel()
    }
    const response = await api.get(
        `/warehouse/location/racks/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseRackModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/location/racks/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    if (this.phantom) {
      const response = await api.post(`/warehouse/location/racks`, data)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/location/racks/${this.id}`, data)
    }
  }

  async delete() {
    await api.delete(`/warehouse/location/racks/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      code: {
        presence: true,
        numericality: {
          greaterThan: 0,
          lessThan: 100,
          onlyInteger: true
        }
      }
    }
    return await this.$validate(constraints)
  }

}

export const WarehouseRackArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/zones/${zoneId}/racks'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseRackModel
      }

      initialize(zone) {
        super.initialize()
        this.zone = zone
      }

      async fetch() {
        return await super.fetch({
          zoneId: this.zone.id
        })
      }

    }
)