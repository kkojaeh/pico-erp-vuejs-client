import {
  CollectionArray,
  FetchableArray,
  SpringPaginationArray
} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'
import {authorizedUrl} from "../../plugins/auth";
import qs from "qs";
import {download} from "../data";

const propertyOrders = {
  'width': 1,
  'height': 2,
  'grammage': 3,
  'incisionCount': 4
}

export class ItemImportOptions {

  overwrite = false

}

export class ItemExportOptions {

  empty = false

}

export class ItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      baseUnitCost: 0,
      purchasable: false
    }
  }

  get isActivatable() {
    return ['DRAFT', 'DEACTIVATED'].includes(this.status)
  }

  get isDeactivatable() {
    return ['ACTIVATED'].includes(this.status)
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ItemModel()
    }
    const response = await api.get(
        `/item/items/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemModel(response.data)
  }

  static async existsByCode(code) {
    return exists(api, `/item/codes/${code}`)
  }

  static async exists(id) {
    return await exists(api, `/item/items/${id}`)
  }

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/item/xlsx/items`)
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/item/xlsx/items?${qs.stringify(
        options)}`
    download(authorizedUrl(url))
  }

  get phantom() {
    return this.hasChanged("id")
  }

  get specifiable() {
    return !!this.specTypeId
  }

  async save() {
    if(this.phantom) {
      const response = await api.post('/item/items', this)
      this.assign(response.data)
    }else{
      await api.put(`/item/items/${this.id}`, this)
    }
  }

  async activate() {
    await api.put(`/item/items/${this.id}/activate`, this)
  }

  async deactivate() {
    return api.put(`/item/items/${this.id}/deactivate`, this)
  }

  async validate() {
    const phantom = this.phantom
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 100}
      },
      code: {
        exists: async (value) => {
          if (!value) {
            return
          }
          if (!phantom) {
            return
          }
          return await ItemModel.existsByCode(value)
        },
        presence: true,
        length: {minimum: 2, maximum: 20}
      },
      externalCode: {
        presence: false,
        length: {maximum: 100}
      },
      barcodeNumber: {
        presence: false,
        length: {maximum: 100}
      },
      specTypeId: {
        presence: false,
        length: {maximum: 200}
      },
      unit: {
        presence: true
      },
      type: {
        presence: true
      },
      description: {
        presence: false,
        length: {maximum: 200}
      },
      customerId: {
        presence: false
      },
      purchasable: {
        presence: true
      },
      baseUnitCost: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      }
    }
    return await this.$validate(constraints)
  }

}

export const ItemPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/item/items?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ItemModel
      }
    }
)

export const ItemLabelArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/item/item-query-labels?${$QS}'
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