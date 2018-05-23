import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'
import qs from 'qs'
import store from '../../store'

export class DepartmentImportOptions {

  overwrite = false

}

export class DepartmentExportOptions {

  empty = false

}

export class DepartmentModel extends Model {

  static get importByXlsxUrl () {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
      + store.getters['auth/token']
    return `${host}/user/import/departments/xlsx?${authQs}`
  }

  get defaults () {
    return {
      customerManagerContact: {}
    }
  }

  static exportAsXlsx (options) {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
      + store.getters['auth/token']
    const link = document.createElement('a')
    link.href = `${host}/user/export/departments/xlsx?${qs.stringify(
      options)}&${authQs}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static async get (id, cacheable) {
    if (!id) {
      return new DepartmentModel()
    }
    const response = await api.get(
      `/user/departments/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new DepartmentModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/user/departments/${id}`)
  }

  async create () {
    this.id = uuid()
    const response = await api.post('/user/departments', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/user/departments/${this.id}`, this)
  }

  async validate (state) {
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        format: {
          pattern: '\\w',
          message: languageAliases({
            ko: '형식이 틀립니다(영문 및 숫자 _ 만 사용가능합니다)'
          })[language]
        },
        exists: async (value) => {
          if (!value) {
            return
          }
          if (state !== 'create') {
            return
          }
          let result = await DepartmentModel.exists(value)
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

  async validateCreate () {
    return await
      this.validate('create')
  }

  async validateUpdate () {
    return await
      this.validate('update')
  }
}

export class DepartmentPaginationArray extends SpringPaginationArray {
  url = '/user/departments?${$QS}'
  axios = api
  model = DepartmentModel
}

export class DepartmentLabelArray extends FetchableArray {
  url = '/user/department-query-labels?${$QS}'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}


