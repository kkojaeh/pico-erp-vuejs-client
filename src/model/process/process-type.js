import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'

export class ProcessTypeModel extends Model {

  get defaults () {
    return {
      costRates: {
        directLabor: 0.25,
        indirectLabor: 0.25,
        indirectMaterial: 0.25,
        indirectExpenses: 0.25
      },
      difficultyGrades: [
        {'difficulty': 'EASY', 'description': '', 'costRate': 0.95},
        {'difficulty': 'NORMAL', 'description': '', 'costRate': 1.00},
        {'difficulty': 'HARD', 'description': '', 'costRate': 1.10},
        {'difficulty': 'VERY_HARD', 'description': '', 'costRate': 1.20}
      ]
    }
  }

  static async get (id, cacheable) {
    if (!id) {
      return new ProcessTypeModel()
    }
    const response = await api.get(
      `/process/process-types/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ProcessTypeModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/process/process-types/${id}`)
  }

  async create () {
    return await api.post('/process/process-types', this)
  }

  async update () {
    await api.put(`/process/process-types/${this.id}`, this)
  }

  async validate (state) {
    let constraints = {
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
          if (state !== 'create') {
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

  async validateCreate () {
    return await this.validate('create')
  }

  async validateUpdate () {
    return await this.validate('update')
  }
}

export class ProcessTypePaginationArray extends SpringPaginationArray {
  url = '/process/process-types'
  axios = api
  model = ProcessTypeModel
}

export class ProcessTypeLabelArray extends FetchableArray {
  url = '/process/process-type-query-labels?${$QS}'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}