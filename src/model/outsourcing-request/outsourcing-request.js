import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import {CompanyModel} from "../company";
import moment from 'moment'
import {ItemModel} from "../item";

const itemSymbol = Symbol('item')

export class OutsourcingRequestModel extends Model {

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
      committable: false,
      itemId: null,
      itemSpecCode: null,
      quantity: 0,
      spareQuantity: 0
    }
  }

  get item() {
    return this[itemSymbol]
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new OutsourcingRequestModel()
    }
    const response = await api.get(
        `/outsourcing-request/requests/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OutsourcingRequestModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/outsourcing-request/requests/${id}`)
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/outsourcing-request/requests',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/outsourcing-request/requests/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/outsourcing-request/requests/${this.id}/cancel`, this)
  }

  async accept() {
    await api.put(`/outsourcing-request/requests/${this.id}/accept`, this)
  }

  async commit() {
    await api.put(`/outsourcing-request/requests/${this.id}/commit`, this)
  }

  async reject(reason) {
    await api.put(`/outsourcing-request/requests/${this.id}/reject`, {
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
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      itemId: {
        presence: true
      },
      itemSpecId: {
        'function': async () => {
          const errors = []
          if (this.item.specifiable) {
            if (!this.itemSpecId) {
              const error = languageAliases({
                ko: '품목의 스펙을 지정해야 합니다'
              })[language]
              errors.push(error)
            }
          }
          return errors
        }
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

export const OutsourcingRequestPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/outsourcing-request/requests?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingRequestModel
      }
    }
)

export const OutsourcingRequestAwaitOrderPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/outsourcing-request/await-orders?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingRequestModel
      }
    }
)

export const OutsourcingRequestAwaitAcceptPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/outsourcing-request/await-accepts?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingRequestModel
      }
    }
)