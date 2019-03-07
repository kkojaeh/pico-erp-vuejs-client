import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'

export class ProductionExecutionModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      quantity: 0,
      errorQuantity: 0,
      updatable: true,
      startDate: null,
      endDate: null
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
      return new ProductionExecutionModel()
    }
    const response = await api.get(
        `/production-execution/executions/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductionExecutionModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/production-execution/executions/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/production-execution/executions',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/production-execution/executions/${this.id}`, this)
    }
  }

  async validate() {
    let constraints = {
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      errorQuantity: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      duration: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      unit: {
        presence: true
      },
      itemId: {
        presence: true
      },
      itemSpecCode: {
        presence: true
      },
      processId: {
        presence: true
      },
      startDate: {
        presence: true,
        datetime: {}
      },
      endDate: {
        presence: true,
        datetime: {}
      },
      executorId: {
        presence: true
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProductionExecutionPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/production-execution/executions?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionExecutionModel
      }
    }
)