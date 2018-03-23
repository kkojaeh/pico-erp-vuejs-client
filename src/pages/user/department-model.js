import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class DepartmentModel extends FetchableModel {

  get defaults () {
    return {
      customerManagerContact: {}
    }
  }

  get axios () {
    return api
  }

  get url () {
    return '/user/departments/${id}'
  };

  create () {
    this.id = uuid()
    return this.axios.post('/user/departments', this)
  }

  update () {
    return this.axios.put('/user/departments/${id}', this)
  }

  exists () {
    return exists(this.axios, '/user/departments/${id}', this)
  }

  async validate (state) {
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        format: {
          pattern: '\\w',
          message: ({
            ko: '형식이 틀립니다(영문 및 숫자 _ 만 사용가능합니다)',
            "ko-KR": '형식이 틀립니다(영문 및 숫자 및 `_` 만 사용가능합니다)'
          })[navigator.language]
        },
        exists: async (value) => {
          if (!value) {
            return
          }
          if (state !== 'create') {
            return
          }
          let result = await this.exists()
          return result
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      managerId: {
        presence: false
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

export class DepartmentPaginationArray extends SpringPaginationArray {
  url = '/user/departments'
  axios = api
  model = DepartmentModel
}

export class DepartmentLabelArray extends FetchableArray {
  url = '/user/department-query-labels'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword
    })
  }
}


