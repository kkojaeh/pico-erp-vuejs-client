import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'

export class ProductionRequestModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      unit: null,
      itemId: null,
      quantity: 0,
      spareQuantity: 0,
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
      return new ProductionRequestModel()
    }
    const response = await api.get(
        `/production-request/requests/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductionRequestModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/production-request/requests/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/production-request/requests',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/production-request/requests/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/production-request/requests/${this.id}/cancel`, this)
  }

  async accept() {
    await api.put(`/production-request/requests/${this.id}/accept`, this)
  }

  async commit() {
    await api.put(`/production-request/requests/${this.id}/commit`, this)
  }

  async validateCommit() {
    let constraints = {
      commit: {
        'function': () => {
          const errors = []
          if (!this.committable) {
            const error = languageAliases({
              ko: '제출 할 수 없습니다'
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

  async validate() {
    let constraints = {
      itemId: {
        presence: true
      },
      unit: {
        presence: true
      },
      receiverId: {
        presence: true
      },
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      spareQuantity: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
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
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProductionRequestPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-request/requests?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionRequestModel
      }
    }
)

export const ProductionRequestAwaitAcceptPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-request/await-accepts?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return Model
      }
    }
)