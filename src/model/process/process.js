import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {SpringPaginationArray} from '../array'
import {language, languageAliases} from "../../i18n";

export class ProcessModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      difficulty: 'NORMAL',
      adjustCost: 0,
      estimatedCost: {
        directLabor: 0,
        indirectLabor: 0,
        indirectMaterial: 0,
        indirectExpenses: 0
      }
    }
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProcessModel()
    }
    const response = await api.get(
        `/process/processes/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/processes/${id}`)
  }

  static async getByItemId(itemId, cacheable) {
    if (!itemId) {
      return new ProcessModel()
    }
    const response = await api.get(
        `/process/items/${itemId}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async existsByItemId(itemId) {
    return await exists(api, `/process/items/${itemId}`)
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  async save() {
    if(this.phantom) {
      const response = await api.post('/process/processes', this)
      this.assign(response.data)
    }else{
      await api.put(`/process/processes/${this.id}`, this)
    }
  }

  get canCompletePlan() {
    return !this.phantom && this.status == 'DRAFT'
  }

  get typeFixed() {
    return this.status != 'DRAFT'
  }

  async delete() {
    await api.delete(`/process/processes/${this.id}`)
  }

  async completePlan() {
    await api.put(`/process/processes/${this.id}/complete-plan`, {})
  }

  async validateCompletePlan() {
    return await this.$validate({
      'completePlan': {
        'function': () => {
          const errors = []
          if (this.status !== 'DRAFT') {
            const error = languageAliases({
              ko: '작성중이 아닙니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    })

    return await this.validate()
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 3, maximum: 100}
      },
      difficulty: {
        presence: true
      },
      typeId: {
        presence: true
      },
      adjustCost: {
        presence: true,
        numericality: true
      },
      adjustCostReason: {
        length: {maximum: 200},
        'function': () => {
          const errors = []
          if (this.adjustCost !== 0 && !this.adjustCostReason) {
            const error = languageAliases({
              ko: '비용이 조정되 었습니다 사유를 입력하세요'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProcessPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/process/processes?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProcessModel
      }
    }
)
