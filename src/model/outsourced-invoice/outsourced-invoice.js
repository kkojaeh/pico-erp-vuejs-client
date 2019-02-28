import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'

export class OutsourcedInvoiceModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      receiveAddress: {
        postalCode: null,
        street: null,
        detail: null
      },
      updatable: true,
      projectId: null,
      receiverId: null,
      senderId: null
    }
  }

  get defaultErrors() {
    return {
      receiveAddress: {}
    }
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new OutsourcedInvoiceModel()
    }
    const response = await api.get(
        `/outsourced-invoice/invoices/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OutsourcedInvoiceModel(response.data)
  }

  static async generate(orderId) {
    const id = uuid()
    const response = await api.post(
        `/outsourced-invoice/invoices/${id}/generate`, {
          orderId: orderId
        })
    return new OutsourcedInvoiceModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/outsourced-invoice/invoices/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/outsourced-invoice/invoices',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/outsourced-invoice/invoices/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/outsourced-invoice/invoices/${this.id}/cancel`, this)
  }

  async determine() {
    await api.put(`/outsourced-invoice/invoices/${this.id}/determine`, this)
  }

  async validateDetermine() {
    let constraints = {
      determine: {
        'function': () => {
          const errors = []
          if (this.status !== 'DRAFT') {
            const error = languageAliases({
              ko: '작성중 상태가 아닙니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    }
    return await this.$validate(constraints)
  }

  async validateCancel() {
    let constraints = {
      cancel: {
        'function': () => {
          const errors = []
          if (!this.cancelable) {
            const error = languageAliases({
              ko: '취소 할 수 없습니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    }
    return await this.$validate(constraints)
  }

  async validate() {
    let constraints = {
      projectId: {
        presence: true
      },
      senderId: {
        presence: true
      },
      receiverId: {
        presence: true
      },
      dueDate: {
        presence: true,
        datetime: {
          parse: (date) => moment(date),
          format: (date) => moment(date).format('YYYY-MM-DD'),
          earliest: new Date()
        }
      },
      'receiveAddress.postalCode': {
        presence: true,
        length: {minimum: 5, maximum: 6}
      },
      'receiveAddress.street': {
        presence: true,
        length: {minimum: 10, maximum: 50}
      },
      'receiveAddress.detail': {
        presence: true,
        length: {minimum: 3, maximum: 50}
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }
}

export const OutsourcedInvoicePaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/outsourced-invoice/invoices?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcedInvoiceModel
      }
    }
)