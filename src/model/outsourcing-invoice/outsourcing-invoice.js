import {FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'

export class OutsourcingInvoiceModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT'
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
      return new OutsourcingInvoiceModel()
    }
    const response = await api.get(
        `/outsourcing-invoice/invoices/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OutsourcingInvoiceModel(response.data)
  }

  static async generate(orderId) {
    const id = uuid()
    const response = await api.post(
        `/outsourcing-invoice/invoices/${id}/generate`, {
          orderId: orderId
        })
    return new OutsourcingInvoiceModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/outsourcing-invoice/invoices/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/outsourcing-invoice/invoices',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/outsourcing-invoice/invoices/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/outsourcing-invoice/invoices/${this.id}/cancel`, this)
  }

  async determine() {
    await api.put(`/outsourcing-invoice/invoices/${this.id}/determine`, this)
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

export const OutsourcingInvoiceArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/outsourcing-invoice/orders/${orderId}/invoices'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingInvoiceModel
      }

      initialize(order) {
        super.initialize()
        this.order = order
      }

      async fetch() {
        await super.fetch({
          orderId: this.order.id
        })
      }
    }
)