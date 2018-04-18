import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class ProjectModel extends Model {

  get defaults () {
    return {
      customerManagerContact: {}
    }
  }

  get defaultErrors () {
    return {
      customerManagerContact: {}
    }
  }

  static async get (id) {
    const response = await api.get(`/project/projects/${id}`)
    return new ProcessModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/project/projects/${id}`)
  }

  async create () {
    this.id = uuid()
    const response = await api.post('/project/projects', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/project/projects/${this.id}`, this)
  }

  async validate (state) {
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

  async validateCreate () {
    return await
      this.validate('create')
  }

  async validateUpdate () {
    return await
      this.validate('update')
  }
}

export class ProjectPaginationArray extends SpringPaginationArray {
  url = '/project/projects?${$QS}'
  axios = api
  model = ProjectModel
}

export class ProjectLabelArray extends FetchableArray {
  url = '/project/project-query-labels?${$QS}'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}


