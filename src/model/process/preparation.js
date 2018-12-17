import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {FetchableArray, SavableArray, ValidatableArray} from '../array'

export class ProcessPreparationModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      chargeCost: 0
    }
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProcessPreparationModel()
    }
    const response = await api.get(
        `/process/preparations/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessPreparationModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/preparations/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/process/preparations', this)
      this.assign(response.data)
    } else {
      await api.put(`/process/preparations/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(`/process/preparations/${this.id}`)
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 3, maximum: 100}
      },
      chargeCost: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      typeId: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProcessPreparationArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/process/processes/${processId}/preparations'
      }

      get axios() {
        return api
      }

      get model() {
        return ProcessPreparationModel
      }

      initialize(process) {
        super.initialize()
        this.process = process
      }

      async fetch() {
        return await super.fetch({
          processId: this.process.id
        })
      }

      applyEach(element) {
        element.processId = this.process.id
      }

    }
)