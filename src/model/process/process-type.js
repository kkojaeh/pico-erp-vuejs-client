import {
  FetchableArray,
  SavableArray,
  SpringPaginationArray
} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {authorizedUrl} from 'src/plugins/auth'
import {language, languageAliases} from 'src/i18n'
import qs from 'qs'
import {LabelModel} from "src/model/shared";
import {download} from 'src/model/data'

export class ProcessTypeImportOptions {

  overwrite = false

}

export class ProcessTypeExportOptions {

  empty = false

}

export class ProcessTypeModel extends Model {

  get defaults() {
    return {
      lossRate: 0,
      costRates: {
        directLabor: 0.25,
        indirectLabor: 0.25,
        indirectMaterial: 0.25,
        indirectExpenses: 0.25
      },
      difficulties: {
        'EASY': {'description': '', 'costRate': 0.95},
        'NORMAL': {'description': '', 'costRate': 1.00},
        'HARD': {'description': '', 'costRate': 1.10},
        'VERY_HARD': {'description': '', 'costRate': 1.20}
      },
      preprocessTypes: []
    }
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProcessTypeModel()
    }
    const response = await api.get(
        `/process/process-types/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/process/process-types/${id}`)
  }

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/process/xlsx/process-types`)
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/process/xlsx/process-types?${qs.stringify(
        options)}`
    download(authorizedUrl(url))
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  async addPreparationType(preprocessType) {
    return await api.post(`/process/process-types/${this.id}/preparation-types`,
        {
          preprocessTypeId: preprocessType.id
        })
  }

  async removePreparationType(preprocessType) {
    return await api.delete(
        `/process/process-types/${this.id}/preparation-types/${preprocessType.id}`,
        {
          preprocessTypeId: preprocessType.id
        })
  }

  async save() {
    if (this.phantom) {
      await api.post('/process/process-types', this)
    } else {
      await api.put(`/process/process-types/${this.id}`, this)
    }
  }

  async validate() {
    const phantom = this.phantom
    const constraints = {
      id: {
        presence: true,
        length: {minimum: 1, maximum: 5},
        format: {
          pattern: '[A-Z0-9]{1,5}',
          message: languageAliases({
            ko: '형식이 틀립니다(영문 대문자/숫자 조합 1~5 글자입니다)'
          })[language]
        },
        exists: async (value) => {
          if (!value) {
            return
          }
          if (!phantom) {
            return
          }
          return await ProcessTypeModel.exists(value)
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      infoTypeId: {
        presence: true
      },
      lossRate: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0,
          lessThan: 1
        }
      },
      costRates: {
        'function': () => {
          let sum = 0
          _.forIn(this.costRates, (value, key) => {
            sum += value
          })
          if (sum != 1) {
            return languageAliases({
              ko: '비율의 합이 100% 가 아닙니다'
            })[language]
          }
        }
      }
    }
    return await this.$validate(constraints)
  }

}

export const ProcessTypePaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/process/process-types?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProcessTypeModel
      }
    }
)

export const ProcessTypeLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/process-type-query-labels?${$QS}'
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

export const ProcessTypePreprocessTypeArray = Array.decorate(
    SavableArray,
    class {

      initialize(processType) {
        this.processType = processType
      }

      isSaveTarget(element) {
        return element.hasChanged('selected')
      }

      async saveElement(element) {
        return await element.selected ? this.processType.addPreparationType(
            element) : this.processType.removePreparationType(element)
      }

    }
)