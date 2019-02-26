import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'
import qs from "qs";
import {download} from "../data";
import {authorizedUrl} from "../../plugins/auth";

export class OutsourcingOrderModel extends Model {

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
      committable: true
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
      return new OutsourcingOrderModel()
    }
    const response = await api.get(
        `/outsourcing-order/orders/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OutsourcingOrderModel(response.data)
  }

  static async generate(requestIds) {
    const id = uuid()
    const response = await api.post(
        `/outsourcing-order/orders/${id}/generate`, {
          requestIds: requestIds
        })
    return new OutsourcingOrderModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/outsourcing-order/orders/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/outsourcing-order/orders',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/outsourcing-order/orders/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/outsourcing-order/orders/${this.id}/cancel`, this)
  }

  async send() {
    await api.put(`/outsourcing-order/orders/${this.id}/send`, this)
  }

  async determine() {
    await api.put(`/outsourcing-order/orders/${this.id}/determine`, this)
  }

  async reject(reason) {
    await api.put(`/outsourcing-order/orders/${this.id}/reject`, {
      rejectedReason: reason
    })
  }

  async printDraft() {
    const host = api.defaults.baseURL
    const url = `${host}/outsourcing-order/orders/${this.id}/print-draft?${qs.stringify(
        {})}`
    download(authorizedUrl(url))
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

  async validateSend() {
    let constraints = {
      send: {
        'function': () => {
          const errors = []
          if (!this.sendable) {
            const error = languageAliases({
              ko: '전송 할 수 없습니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    }
    return await this.$validate(constraints)
  }

  async validateReject() {
    let constraints = {
      reject: {
        'function': () => {
          const errors = []
          if (!this.rejectable) {
            const error = languageAliases({
              ko: '반려 할 수 없습니다'
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
      chargerId: {
        presence: true
      },
      supplierId: {
        presence: true
      },
      receiverId: {
        presence: true
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

export const OutsourcingOrderPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/outsourcing-order/orders?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingOrderModel
      }
    }
)