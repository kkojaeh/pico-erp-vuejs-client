import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'
import {ItemModel} from "../item";

const itemSymbol = Symbol('item')

export class ProductionOrderModel extends Model {

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
      committable: true,
      itemId: null,
      itemSpecCode: null,
      quantity: 0,
      spareQuantity: 0,
      estimatedPreparedDate: null
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
      return new ProductionOrderModel()
    }
    const response = await api.get(
        `/production-order/orders/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductionOrderModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/production-order/orders/${id}`)
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/production-order/orders',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/production-order/orders/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/production-order/orders/${this.id}/cancel`, this)
  }

  async accept() {
    await api.put(`/production-order/orders/${this.id}/accept`, this)
  }

  async commit() {
    await api.put(`/production-order/orders/${this.id}/commit`, this)
  }

  async reject(reason) {
    await api.put(`/production-order/orders/${this.id}/reject`, {
      rejectedReason: reason
    })
  }

  async complete() {
    await api.put(`/production-order/orders/${this.id}/complete`, this)
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

  async validateComplete() {
    let constraints = {
      complete: {
        'function': () => {
          const errors = []
          if (this.quantity + this.spareQuantity > this.progressedQuantity) {
            const error = languageAliases({
              ko: '수량이 부족합니다'
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
      processId: {
        presence: true
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
      estimatedPreparedDate: {
        presence: true,
        datetime: {
          parse: (date) => moment(date),
          format: (date) => moment(date).format('YYYY-MM-DD'),
          earliest: new Date()
        }
      },
      ordererId: {
        presence: true
      },
      receiverId: {
        presence: true
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProductionOrderPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-order/orders?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionOrderModel
      }
    }
)

export const ProductionOrderAwaitExecutionPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-order/await-executions?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionOrderModel
      }
    }
)

export const ProductionOrderAwaitAcceptPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-order/await-accepts?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionOrderModel
      }
    }
)