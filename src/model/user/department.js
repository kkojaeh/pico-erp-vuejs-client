import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {language, languageAliases} from 'src/i18n'
import qs from 'qs'
import {LabelModel} from 'src/model/shared'
import {authorizedUrl} from 'src/plugins/auth'
import {download} from 'src/model/data'

export class DepartmentImportOptions {

  overwrite = false

}

export class DepartmentExportOptions {

  empty = false

}

export class DepartmentModel extends Model {

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/user/import/departments/xlsx`)
  }

  get defaults() {
    return {
      customerManagerContact: {}
    }
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/user/export/departments/xlsx?${qs.stringify(options)}`
    download(authorizedUrl(url))
  }

  static async get(id, cacheable) {
    if (!id) {
      return new DepartmentModel()
    }
    const response = await api.get(
        `/user/departments/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new DepartmentModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/user/departments/${id}`)
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/user/departments', this)
      this.assign(response.data)
    } else {
      await api.put(`/user/departments/${this.id}`, this)
    }
  }

  async validate() {
    const phantom = this.phantom
    const constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        format: {
          pattern: '\\w+',
          message: languageAliases({
            ko: '형식이 틀립니다(영문 및 숫자 _ 만 사용가능합니다)'
          })[language]
        },
        exists: async (value) => {
          if (!value) {
            return
          }
          if (!phantom) {
            return
          }
          return await DepartmentModel.exists(value)
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

}

export const DepartmentPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/user/departments?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return DepartmentModel
      }
    }
)

export const DepartmentLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/user/department-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async fetch(keyword) {
        return await super.fetch({
          query: keyword || ''
        })
      }
    }
)
