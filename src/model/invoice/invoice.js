import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'

export class InvoiceModel extends Model {

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
      }
    }
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new InvoiceModel()
    }
    const response = await api.get(
        `/invoice/invoices/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new InvoiceModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/invoice/invoices/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/invoice/invoices',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/invoice/invoices/${this.id}`, this)
    }
  }

  async receive() {
    await api.put(`/invoice/invoices/${this.id}/receive`, this)
  }

  async validateReceive() {
    let constraints = {
      receive: {
        'function': () => {
          const errors = []
          if (!this.receivable) {
            const error = languageAliases({
              ko: '인수 할 수 없습니다'
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
      dueDate: {
        presence: true,
        datetime: {
          parse: (date) => moment(date),
          format: (date) => moment(date).format('YYYY-MM-DD'),
          earliest: new Date()
        }
      },
      orderId: {
        presence: true
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }
}

export const InvoicePaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/invoice/invoices?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return InvoiceModel
      }
    }
)
