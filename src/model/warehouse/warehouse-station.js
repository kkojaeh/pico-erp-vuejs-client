import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'
import {language, languageAliases} from "../../i18n";
import {LabelModel} from "../shared";

export class WarehouseStationModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      type: 'station'
    }
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WarehouseStationModel()
    }
    const response = await api.get(
        `/warehouse/location/stations/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseStationModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/location/stations/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    if (this.phantom) {
      const response = await api.post(`/warehouse/location/stations`, data)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/location/stations/${this.id}`, data)
    }
  }

  async delete() {
    await api.delete(`/warehouse/location/stations/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      code: {
        presence: true,
        format: {
          pattern: "[A-Z0-9]+",
          message: languageAliases({
            ko: '대문자 알파벳과 숫자만 가능합니다'
          })[language]
        },
        length: {minimum: 2, maximum: 2}
      }
    }
    return await this.$validate(constraints)
  }

  get label() {
    if (this.code) {
      return `[${this.code}]${this.name}`
    }
  }

}

export const WarehouseStationArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/sites/${siteId}/stations'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseStationModel
      }

      initialize(site) {
        super.initialize()
        this.site = site
      }

      async fetch() {
        return await super.fetch({
          siteId: this.site.id
        })
      }

    }
)

export const WarehouseStationLabelArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/station-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async fetch(keyword) {
        return await super.fetch({
          query: keyword || ''
        })
      }
    }
)
