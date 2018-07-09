import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import store from 'src/store'
import qs from 'qs'
import {QuotationAdditionModel} from './quotation-addition'
import {QuotationBomItemModel} from './quotation-item'
import {QuotationItemAdditionRateModel} from './quotation-item-addition-rate'

export class QuotationPrintSheetOptions {

  detailedUnitPrice = true

  includedBom = true

}

export class QuotationModel extends Model {

  constructor(data) {
    super(data)
    if (this.items) {
      this.items = this.items.map(QuotationModel.itemConverter)
      this.items.forEach(item => item.quotation = this)
    }
    if (this.itemAdditions) {
      this.itemAdditions = this.itemAdditions.map(
          QuotationModel.itemAdditionConverter)
      this.itemAdditions.forEach(
          itemAddition => itemAddition.quotation = this)
    }
    if (this.additions) {
      this.additions = this.additions.map(
          QuotationModel.additionConverter)
      this.additions.forEach(addition => addition.quotation = this)
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
    return new QuotationItemAdditionRateModel(data)
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

  get phantom() {
    return !this.id
  }

  async save() {
    if (this.phantom) {
      this.id = uuid()
      const response = await api.post('/quotation/quotations', this)
      this.assign(response.data)
    } else {
      await api.put(`/quotation/quotations/${this.id}`, this)
    }
  }

  async addBomItem(bom) {
    await api.post(`/quotation/quotations/${this.id}/items`, {
      item: QuotationBomItemModel.create(bom)
    })
  }

  async addUnitPriceRateItemAddition() {
    await api.post(`/quotation/quotations/${this.id}/item-addition-rates`, {
      itemAdditionRate: QuotationItemAdditionRateModel.create()
    })
  }

  async addAddition() {
    await api.post(`/quotation/quotations/${this.id}/additions`, {
      addition: QuotationAdditionModel.create()
    })
  }

  async validate() {
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

  async validateCommit() {
    return await this.validate()
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

