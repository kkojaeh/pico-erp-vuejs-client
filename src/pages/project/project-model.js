import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class ProjectModel extends FetchableModel {

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

  get axios () {
    return api
  }

  get url () {
    return '/project/projects/${id}'
  };

  create () {
    this.id = uuid()
    return this.axios.post('/project/projects', this)
  }

  update () {
    return this.axios.put('/project/projects/${id}', this)
  }

  exists () {
    return exists(this.axios, '/project/projects/${id}', this)
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

  async validateForCreate () {
    return await
      this.validate('create')
  }

  async validateForUpdate () {
    return await
      this.validate('update')
  }
}

export class ProjectPaginationArray extends SpringPaginationArray {
  url = '/project/projects'
  axios = api
  model = ProjectModel
}

export class ProjectLabelArray extends FetchableArray {
  url = '/project/project-query-labels'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword
    })
  }
}


