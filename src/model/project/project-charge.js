import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'

const projectSymbol = Symbol('project')

export class ProjectChargeModel extends Model {

  get defaults() {
    return {
      unitPrice: 0,
      quantity: 0
    }
  }

  get defaultErrors() {
    return {}
  }

  get project() {
    return this[projectSymbol]
  }

  set project(value) {
    this[projectSymbol] = value
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

  get phantom() {
    return !this.id
  }

  async save() {
    const projectId = this.project.id
    if (this.phantom) {
      this.id = uuid()
      const response = await api.post(
          `/project/projects/${projectId}/sale-items`, this)
      this.assign(response.data)
    } else {
      await api.put(`/project/projects/${projectId}/sale-items/${this.id}`,
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
}