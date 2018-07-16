import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import store from 'src/store'
import qs from 'qs'
import {QuotationAdditionModel} from './quotation-addition'
import {QuotationItemModel} from './quotation-item'
import {QuotationItemAdditionModel} from './quotation-item-addition'

export class QuotationPrintSheetOptions {

  detailedUnitPrice = true

  includedBom = true

}

export class QuotationModel extends Model {

  constructor(data) {
    super(data)
    this.id || uuid()
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

  static async get(id) {
    const response = await api.get(`/quotation/quotations/${id}`)
    return new QuotationModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/quotation/quotations/${id}`)
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
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

