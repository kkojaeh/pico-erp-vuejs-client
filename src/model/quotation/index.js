import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {BomModel} from 'src/model/bom'
import {ProcessModel} from 'src/model/process'
import {ItemModel, ItemSpecModel} from 'src/model/item'
import {api} from 'src/plugins/axios'
import store from 'src/store'
import qs from 'qs'
import {LabelModel} from 'src/model/shared'

const bomSymbol = Symbol('bom')

const quotationSymbol = Symbol('quotation')

const itemSymbol = Symbol('item')

const itemSpecSymbol = Symbol('item-spec')

const processSymbol = Symbol('process')

export class QuotationPrintSheetOptions {

  detailedUnitPrice = true

  includedBom = true

}

class QuotationBomItemModel extends Model {

  get defaults() {
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

  get bom() {
    return this[bomSymbol]
  }

  get quotation() {
    return this[quotationSymbol]
  }

  static create(bom) {
    return new QuotationBomItemModel({
      id: uuid(),
      bomId: bom.id
    })
  }

  async fetch() {
    const bom = await BomModel.get(this.bomId)
    this[bomSymbol] = bom
    await bom.fetchChildren(true)
    await bom.visit(async (node) => {
      node[itemSymbol] = await ItemModel.get(node.itemId, true)
      node[processSymbol] = await ProcessModel.get(node.processId, true)
      node[itemSpecSymbol] = await ItemSpecModel.get(node.itemSpecId, true)
      Object.defineProperties(node, {
        'item': {
          get: function () {
            return this[itemSymbol]
          }
        },
        'itemSpec': {
          get: function () {
            return this[itemSpecSymbol]
          }
        },
        'process': {
          get: function () {
            return this[processSymbol]
          }
        }
      })
    })
  }

  async update() {
    await api.put(`/quotation/quotations/${this.quotation.id}/items/${this.id}`,
        {
          item: this
        })
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotation.id}/items/${this.id}`, {})
  }

}

class QuotationUnitPriceRateItemAdditionModel extends Model {
  get defaults() {
    return {
      '@type': 'unit-price-rate',
      name: '',
      unitPriceRate: 0
    }
  }

  get quotation() {
    return this[quotationSymbol]
  }

  get value() {
    return this.unitPriceRate
  }

  set value(value) {
    this.unitPriceRate = value
  }

  static create() {
    return new QuotationUnitPriceRateItemAdditionModel({
      id: uuid()
    })
  }

  async update() {
    await api.put(
        `/quotation/quotations/${this.quotation.id}/item-addition-rates/${this.id}`,
        {
          itemAddition: this
        })
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotation.id}/item-addition-rates/${this.id}`,
        {})
  }

}

class QuotationAdditionModel extends Model {
  get defaults() {
    return {
      name: '',
      unitPrice: 0,
      quantity: 1
    }
  }

  get quotation() {
    return this[quotationSymbol]
  }

  static create() {
    return new QuotationAdditionModel({
      id: uuid()
    })
  }

  async update() {
    await api.put(
        `/quotation/quotations/${this.quotation.id}/additions/${this.id}`, {
          addition: this
        })
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotation.id}/additions/${this.id}`, {})
  }

}

export class QuotationModel extends Model {

  constructor(data) {
    super(data)
    if (this.items) {
      this.items = this.items.map(QuotationModel.itemConverter)
      this.items.forEach(item => item[quotationSymbol] = this)
    }
    if (this.itemAdditions) {
      this.itemAdditions = this.itemAdditions.map(
          QuotationModel.itemAdditionConverter)
      this.itemAdditions.forEach(
          itemAddition => itemAddition[quotationSymbol] = this)
    }
    if (this.additions) {
      this.additions = this.additions.map(
          QuotationModel.additionConverter)
      this.additions.forEach(addition => addition[quotationSymbol] = this)
    }

  }

  get defaults() {
    return {
      modifiable: true,
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

  get defaultErrors() {
    return {
      customerManagerContact: {}
    }
  }

  static itemConverter(data) {
    const type = data['@type']
    if (type == 'bom') {
      return new QuotationBomItemModel(data)
    }
  }

  static itemAdditionConverter(data) {
    const type = data['@type']
    if (type == 'unit-price-rate') {
      return new QuotationUnitPriceRateItemAdditionModel(data)
    }
  }

  static additionConverter(data) {
    return new QuotationAdditionModel(data)
  }

  static async get(id) {
    const response = await api.get(`/quotation/quotations/${id}`)
    return new QuotationModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/quotation/quotations/${id}`)
  }

  async fetchAll() {
    await Promise.all(this.items.map(async (item) => await item.fetch()))
  }

  async create() {
    this.id = uuid()
    const response = await api.post('/quotation/quotations', this)
    this.assign(response.data)
  }

  async update() {
    await api.put(`/quotation/quotations/${this.id}`, this)
  }

  async addBomItem(bom) {
    await api.post(`/quotation/quotations/${this.id}/items`, {
      item: QuotationBomItemModel.create(bom)
    })
  }

  async addUnitPriceRateItemAddition() {
    await api.post(`/quotation/quotations/${this.id}/item-addition-rates`, {
      itemAdditionRate: QuotationUnitPriceRateItemAdditionModel.create()
    })
  }

  async addAddition() {
    await api.post(`/quotation/quotations/${this.id}/additions`, {
      addition: QuotationAdditionModel.create()
    })
  }

  async validate(state) {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      expiryPolicy: {
        presence: true
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
      protectedDescription: {
        length: {maximum: 200}
      },
      publicDescription: {
        length: {maximum: 200}
      }
    }

    return await this.$validate(constraints)
  }

  async validateCreate() {
    return await
        this.validate('create')
  }

  async validateUpdate() {
    return await
        this.validate('update')
  }

  async validateCommit() {
    return await
        this.validate('update')
  }

  async printSheet(options) {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
        + store.getters['auth/token']
    const link = document.createElement('a')
    link.href = `${host}/quotation/quotations/${this.id}/print-sheet?${qs.stringify(
        options)}&${authQs}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async commit() {
    await api.put(`/quotation/quotations/${this.id}/commit`, {})
  }

  async cancel() {
    await api.put(`/quotation/quotations/${this.id}/cancel`, {})
  }

  async nextDraft() {
    const response = await api.post(`/quotation/quotations/${this.id}/next`, {
      nextId: uuid()
    })
    this.assign(response.data)
  }
}

export const QuotationPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/quotation/quotations?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return QuotationModel
      }
    }
)

export const QuotationStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/quotation/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const QuotationExpiryPolicyArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/quotation/expiry-policy-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export class QuotationStatusCountPerMonthAggregateOptions {

  year = new Date().getFullYear()

}

export const QuotationStatusCountPerMonthAggregateArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/quotation/aggregate/statuses/count/month?${$QS}'
      }

      get axios() {
        return api
      }
    }
)
