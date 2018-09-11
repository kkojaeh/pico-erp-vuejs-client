import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel} from "src/model/item";

const itemSymbol = Symbol('item')

export class ProjectSaleItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      unitPrice: 0
    }
  }

  get defaultErrors() {
    return {}
  }

  get item() {
    return this[itemSymbol]
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
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
    return this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/project/projects/${this.projectId}/sale-items`, this)
      this.assign(response.data)
    } else {
      await api.put(`/project/projects/${this.projectId}/sale-items/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      unitPrice: {
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
        `/project/projects/${this.projectId}/sale-items/${this.id}`, {})
  }
}

export const ProjectSaleItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/project/projects/${projectId}/sale-items'
      }

      get axios() {
        return api
      }

      get model() {
        return ProjectSaleItemModel
      }

      initialize(project) {
        super.initialize()
        this.project = project
      }

      async fetch() {
        await super.fetch({
          projectId: this.project.id
        })
        await Promise.all(this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element){
        element.projectId = this.project.id
      }

    }
)