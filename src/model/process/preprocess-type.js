import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {language, languageAliases} from 'src/i18n'
import qs from 'qs'
import {LabelModel} from "../shared";
import {authorizedUrl} from 'src/plugins/auth'
import {download} from 'src/model/data'

export class PreprocessTypeImportOptions {

  overwrite = false

}

export class PreprocessTypeExportOptions {

  empty = false

}

export class PreprocessTypeModel extends Model {

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/process/import/process-types/xlsx`)
  }

  get defaults() {
    return {
      baseCost: 0
    }
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new PreprocessTypeModel()
    }
    const response = await api.get(
        `/process/preprocess-types/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new PreprocessTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/preprocess-types/${id}`)
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/process/export/process-types/xlsx?${qs.stringify(
        options)}`
    download(authorizedUrl(url))
  }

  async save() {
    if (this.phantom) {
      await api.post('/process/preprocess-types', this)
    } else {
      await api.put(`/process/preprocess-types/${this.id}`, this)
    }
  }

  async validate() {
    const phantom = this.phantom
    const constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        format: {
          pattern: '(\\w|-)+',
          message: languageAliases({
            ko: '형식이 틀립니다(영문 및 숫자 `_-` 만 사용가능합니다)'
          })[language]
        },
        exists: async (value) => {
          if (!value) {
            return
          }
          if (!phantom) {
            return
          }
          return await PreprocessTypeModel.exists(value)
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      infoTypeId: {
        presence: true
      },
      baseCost: {
        numericality: {
          greaterThanOrEqualTo: 0
        }
      }

    }
    return await this.$validate(constraints)
  }

}

export const PreprocessTypePaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/process/preprocess-types?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return PreprocessTypeModel
      }
    }
)

export const PreprocessTypeLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/preprocess-type-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async query(keyword) {
        return await this.fetch({
          query: keyword || ''
        })
      }
    }
)