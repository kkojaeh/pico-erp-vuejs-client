import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'
import {language, languageAliases} from "../../i18n";

export class WarehouseZoneModel extends Model {

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
      return new WarehouseZoneModel()
    }
    const response = await api.get(
        `/warehouse/location/zones/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseZoneModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/location/zones/${id}`)
  }

  async save() {
    const data = _.assign({}, this)
    if (this.phantom) {
      const response = await api.post(`/warehouse/location/zones`, data)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/location/zones/${this.id}`, data)
    }
  }

  async delete() {
    await api.delete(`/warehouse/location/zones/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      code: {
        presence: true,
        format: {
          pattern: "[A-Z]+",
          message: languageAliases({
            ko: '대문자 알파벳만 가능합니다'
          })[language]
        },
        length: {minimum: 1, maximum: 1}
      }
    }
    return await this.$validate(constraints)
  }

}

export const WarehouseZoneArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/location/sites/${siteId}/zones'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseZoneModel
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