import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'

export class ProjectModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      customerManagerContact: {
        name: null,
        email: null,
        mobilePhoneNumber: null,
        telephoneNumber: null,
        faxNumber: null
      }
    }
  }

  get defaultErrors() {
    return {
      customerManagerContact: {}
    }
  }

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

  get phantom() {
    return this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/project/projects', this)
      this.assign(response.data)
    } else {
      await api.put(`/project/projects/${this.id}`, this)
    }
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      customerId: {
        presence: true
      },
      managerId: {
        presence: true
      },
      'customerManagerContact.name': {
        presence: true,
        length: {minimum: 2, maximum: 20}
      },
      'customerManagerContact.email': {
        presence: false,
        email: true,
        length: {minimum: 0, maximum: 30}
      },
      'customerManagerContact.mobilePhoneNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      'customerManagerContact.faxNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      'customerManagerContact.telephoneNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      }
    }

    return await this.$validate(constraints)
  }
}

export const ProjectPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/project/projects?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProjectModel
      }
    }
)

export const ProjectLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/project/project-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async fetch(keyword) {
        return super.fetch({
          query: keyword || ''
        })
      }
    }
)