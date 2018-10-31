import {
  CollectionArray,
  FetchableArray,
  SpringPaginationArray
} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'

const propertyOrders = {
  'width': 1,
  'height': 2,
  'grammage': 3,
  'incisionCount': 4
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

  static async exists(id) {
    return await exists(api, `/item/items/${id}`)
  }

  static async getSpecMetadata(id) {
    const numbers = ['integer']
    const response = await api.get(`item/items/${id}/spec-metadata`)
    const data = response.data
    console.log(data.properties)
    _.forIn(data.properties, (value, key) => {
      if (propertyOrders[key]) {
        value.propertyOrder = propertyOrders[key]
      }
      if (numbers.includes(value.type)) {
        if (_.isArray(value.enum)) {
          value.enum = value.enum.map(Number)
        }
      }
    })
    return data
  }

  get phantom() {
    return this.hasChanged("id")
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
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      externalCode: {
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