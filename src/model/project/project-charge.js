import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

export class ProjectChargeModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      unitPrice: 0,
      quantity: 0,
      paid: false,
      charged: false
    }
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  /*

    static async get(id, cacheable) {
      if (!id) {
        return new ProjectModel()
      }
      const response = await api.get(
          `/project/projects/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
      return new ProjectModel(response.data)
    }

    static async exists(id) {
      return await exists(api, `/project/projects/${id}`)
    }
  */

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/project/projects/${this.projectId}/charges`, this)
      this.assign(response.data)
    } else {
      await api.put(`/project/projects/${this.projectId}/charges/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      unitPrice: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      itemId: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/project/projects/${this.projectId}/charges/${this.id}`, {})
  }
}

export const ProjectChargeArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/project/projects/${projectId}/charges'
      }

      get axios() {
        return api
      }

      get model() {
        return ProjectChargeModel
      }

      initialize(project) {
        super.initialize()
        this.project = project
      }

      async fetch() {
        await super.fetch({
          projectId: this.project.id
        })
      }

      applyEach(element){
        element.projectId = this.project.id
      }
    }
)