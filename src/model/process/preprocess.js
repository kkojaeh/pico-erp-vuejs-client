import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {FetchableArray, SavableArray, ValidatableArray} from '../array'

export class PreprocessModel extends Model {

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
      return new PreprocessModel()
    }
    const response = await api.get(
        `/process/preprocesses/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/preprocesses/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/process/preprocesses', this)
      this.assign(response.data)
    } else {
      await api.put(`/process/preprocesses/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(`/process/preprocesses/${this.id}`)
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

export const ProcessPreprocessArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/process/processes/${processId}/preprocesses'
      }

      get axios() {
        return api
      }

      get model() {
        return PreprocessModel
      }

      initialize(process) {
        super.initialize()
        this.process = process
      }

      async query() {
        return await this.fetch({
          processId: this.process.id
        })
      }

      applyEach(element) {
        element.processId = this.process.id
      }

    }
)