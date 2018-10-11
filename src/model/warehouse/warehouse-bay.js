import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'

export class WarehouseBayModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WarehouseBayModel()
    }
    const response = await api.get(
        `/warehouse/location/bays/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseBayModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/location/bays/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    if (this.phantom) {
      const response = await api.post(`/warehouse/location/bays`, data)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/location/bays/${this.id}`, data)
    }
  }

  async delete() {
    await api.delete(`/warehouse/location/bays/${this.id}`, this)
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

export const WarehouseBayArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/racks/${rackId}/bays'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseBayModel
      }

      initialize(rack) {
        super.initialize()
        this.rack = rack
      }

      async fetch() {
        return await super.fetch({
          rackId: this.rack.id
        })
      }

    }
)