import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'

export class WarehouseLevelModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      type: 'level'
    }
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WarehouseLevelModel()
    }
    const response = await api.get(
        `/warehouse/location/levels/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseLevelModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/location/levels/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    if (this.phantom) {
      const response = await api.post(`/warehouse/location/levels`, data)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/location/levels/${this.id}`, data)
    }
  }

  async delete() {
    await api.delete(`/warehouse/location/levels/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      code: {
        presence: true,
        numericality: {
          greaterThan: 0,
          lessThan: 21,
          onlyInteger: true
        }
      }
    }
    return await this.$validate(constraints)
  }

}

export const WarehouseLevelArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/bays/${bayId}/levels'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseLevelModel
      }

      initialize(bay) {
        super.initialize()
        this.bay = bay
      }

      async fetch() {
        return await super.fetch({
          bayId: this.bay.id
        })
      }

    }
)