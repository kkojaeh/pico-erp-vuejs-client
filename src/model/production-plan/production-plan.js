import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";
import moment from 'moment'

export class ProductionPlanModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      itemId: null,
      quantity: 0,
      spareQuantity: 0
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
      return new ProductionPlanModel()
    }
    const response = await api.get(
        `/production-plan/plans/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductionPlanModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/production-plan/plans/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/production-plan/plans',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/production-plan/plans/${this.id}`, this)
    }
  }

  async cancel() {
    await api.put(`/production-plan/plans/${this.id}/cancel`, this)
  }

  async determine() {
    await api.put(`/production-plan/plans/${this.id}/commit`, this)
  }

  async validateDetermine() {
    let constraints = {
      determine: {
        'function': () => {
          const errors = []
          if (!this.determinable) {
            const error = languageAliases({
              ko: '확정 할 수 없습니다'
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
      itemId: {
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

export const ProductionPlanPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-plan/plans?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionPlanModel
      }
    }
)

export const ProductionPlanAwaitAcceptPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-plan/await-accepts?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return Model
      }
    }
)