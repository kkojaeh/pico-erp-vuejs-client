import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { BomModel } from 'src/model/bom'
import { ItemModel } from 'src/model/item'
import { api } from 'src/plugins/axios'

const bomSymbol = Symbol('bom')

const quotationSymbol = Symbol('quotation')

class QuotationBomItemModel extends Model {

  static create (bom) {
    return new QuotationBomItemModel({
      id: uuid(),
      bomId: bom.id
    })
  }

  get defaults () {
    return {
      '@type': 'bom',
      unitPrice: {
        original: 0,
        directLabor: 0,
        indirectLabor: 0,
        indirectMaterial: 0,
        directMaterial: 0,
        indirectExpenses: 0,
        discountRate: 0
      }
    }
  }

  get bom () {
    return this[bomSymbol]
  }

  get quotation () {
    return this[quotationSymbol]
  }

  async fetch () {
    const bom = await BomModel.get(this.bomId)
    this[bomSymbol] = bom
    await bom.fetchChildren(true)
    await bom.visit(async (node) => {
      node.item = await ItemModel.get(node.itemId, true)
    })
  }

  async update () {
    await api.put(`/quotation/quotations/${this.quotation.id}/items/${this.id}`,
      {
        item: this
      })
  }

}

class QuotationUnitPriceRateItemAdditionModel extends Model {
  static create () {
    return new QuotationUnitPriceRateItemAdditionModel({
      id: uuid()
    })
  }

  get defaults () {
    return {
      '@type': 'unit-price-rate',
      unitPriceRate: 0
    }
  }
}

export class QuotationModel extends Model {

  constructor (data) {
    super(data)
    if (this.items) {
      this.items = this.items.map(QuotationModel.itemConverter)
      this.items.forEach(item => item[quotationSymbol] = this)
    }
  }

  static itemConverter (data) {
    const type = data['@type']
    if (type == 'bom') {
      return new QuotationBomItemModel(data)
    }
  }

  async fetchAll () {
    await Promise.all(this.items.map(async (item) => await item.fetch()))
  }

  get defaults () {
    return {
      status: 'DRAFT',
      customerManagerContact: {
        name: null,
        email: null,
        mobilePhoneNumber: null,
        telephoneNumber: null,
        faxNumber: null
      }
    }
  }

  get defaultErrors () {
    return {
      customerManagerContact: {}
    }
  }

  static async get (id) {
    const response = await api.get(`/quotation/quotations/${id}`)
    return new QuotationModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/quotation/quotations/${id}`)
  }

  async create () {
    this.id = uuid()
    const response = await api.post('/quotation/quotations', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/quotation/quotations/${this.id}`, this)
  }

  async addBomItem (bom) {
    await api.post(`/quotation/quotations/${this.id}/items`, {
      item: QuotationBomItemModel.create(bom)
    })
  }

  async addUnitPriceRateItemAddition () {
    await api.post(`/quotation/quotations/${this.id}/item-additions`, {
      itemAddition: QuotationUnitPriceRateItemAdditionModel.create()
    })

  }

  async validate (state) {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      projectId: {
        presence: true
      },
      customerId: {
        presence: true
      },
      managerId: {
        presence: true
      },
      'customerManagerContact.name': {
        presence: true,
        length: {minimum: 2, maximum: 20}
      },
      'customerManagerContact.email': {
        presence: false,
        email: true,
        length: {minimum: 0, maximum: 30}
      },
      'customerManagerContact.mobilePhoneNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      'customerManagerContact.faxNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      'customerManagerContact.telephoneNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      }
    }

    return await this.$validate(constraints)
  }

  async validateCreate () {
    return await
      this.validate('create')
  }

  async validateUpdate () {
    return await
      this.validate('update')
  }
}

export class QuotationPaginationArray extends SpringPaginationArray {
  url = '/quotation/quotations?${$QS}'
  axios = api
  model = QuotationModel
}

export class QuotationStatusArray extends FetchableArray {
  url = '/quotation/status-labels'
  axios = api
}

export class QuotationExpiryPolicyArray extends FetchableArray {
  url = '/quotation/expiry-policy-labels'
  axios = api
}
