import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { LabelModel } from 'src/model/shared'
import { api } from 'src/plugins/axios'
import * as _ from 'lodash'

export class ItemModel extends Model {

  get defaults () {
    return {
      status: 'DRAFT',
      baseUnitCost: 0
    }
  }

  get isActivatable () {
    return ['DRAFT', 'DEACTIVATED'].includes(this.status)
  }

  get isDeactivatable () {
    return ['ACTIVATED'].includes(this.status)
  }

  static async get (id, cacheable) {
    if(!id){
      return new ItemModel()
    }
    const response = await api.get(`/item/items/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/item/items/${id}`)
  }

  static async getSpecMetadata (id) {
    const numbers = ['integer']
    const response = await api.get(`item/items/${id}/spec-metadata`)
    const data = response.data
    _.forIn(data.properties, (value, key) => {
      if (numbers.includes(value.type)) {
        if(_.isArray(value.enum)){
          value.enum = value.enum.map(Number)
        }
      }
    })
    return data
  }

  async create () {
    this.id = uuid()
    const response = await api.post('/item/items', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/item/items/${this.id}`, this)
  }

  async activate () {
    await api.put(`/item/items/${this.id}/activate`, this)
  }

  async deactivate () {
    return api.put(`/item/items/${this.id}/deactivate`, this)
  }

  async validate (state) {
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
      saleable: {
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

  async validateCreate () {
    return await this.validate('create')
  }

  async validateUpdate () {
    return await this.validate('update')
  }

}

export class ItemPaginationArray extends SpringPaginationArray {
  url = '/item/items?${$QS}'
  axios = api
  model = ItemModel
}

export class ItemLabelArray extends FetchableArray {
  url = '/item/item-query-labels?${$QS}'
  axios = api
  model = LabelModel

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}
