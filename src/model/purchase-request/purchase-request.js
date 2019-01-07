import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import {CompanyModel} from "../company";
import moment from 'moment'

export class PurchaseRequestModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      receiveSiteId: null,
      receiveStationId: null,
      updatable: true,
      committable: true
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
      return new PurchaseRequestModel()
    }
    const response = await api.get(
        `/purchase-request/requests/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new PurchaseRequestModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/purchase-request/requests/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/purchase-request/requests',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/purchase-request/requests/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/purchase-request/requests/${this.id}/cancel`, this)
  }

  async accept() {
    await api.put(`/purchase-request/requests/${this.id}/accept`, this)
  }

  async commit() {
    await api.put(`/purchase-request/requests/${this.id}/commit`, this)
  }

  async reject(reason) {
    await api.put(`/purchase-request/requests/${this.id}/reject`, {
      rejectedReason: reason
    })
  }

  async validateCommit() {
    let constraints = {
      commit: {
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

  async validateAccept() {
    let constraints = {
      accept: {
        'function': () => {
          const errors = []
          if (!this.acceptable) {
            const error = languageAliases({
              ko: '접수 할 수 없습니다'
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
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      projectId: {
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
      requesterId: {
        presence: true
      },
      receiverId: {
        presence: true
      },
      receiveSiteId: {
        'function': async () => {
          const errors = []
          const owner = await CompanyModel.owner()
          if (this.receiverId == owner.id) {
            if (!this.receiveSiteId) {
              const error = languageAliases({
                ko: '내부 위치를 지정해야 합니다'
              })[language]
              errors.push(error)
            }
          }
          return errors
        }
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }
}

export const PurchaseRequestPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/purchase-request/requests?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return PurchaseRequestModel
      }
    }
)

export const PurchaseRequestAwaitOrderPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/purchase-request/await-orders?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return PurchaseRequestModel
      }
    }
)

export const PurchaseRequestAwaitAcceptPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/purchase-request/await-accepts?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return Model
      }
    }
)