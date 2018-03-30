import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import Vue from 'vue'
import { language, languageAliases } from 'src/i18n'

export class ProcessTypeModel extends FetchableModel {

  get defaults () {
    return {
      costRates: {
        directLaborCostRate: 0.25,
        indirectLaborCostRate: 0.25,
        indirectMaterialCostRate: 0.25,
        indirectExpensesRate: 0.25
      }
    }
  }

  get axios () {
    return api
  }

  get url () {
    return '/process/process-types/${id}'
  };

  create () {
    return this.axios.post('/process/process-types', this)
  }

  update () {
    return this.axios.put('/process/process-types/${id}', this)
  }

  exists () {
    return exists(this.axios, '/process/process-types/${id}', this)
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
          let result = await this.exists()
          return result
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      processInfoTypeId: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }

  validateCostRates () {
    let sum = 0
    _.forIn(this.costRates, (value, key) => {
      sum += value
    })
    if (sum != 1) {
      Vue.set(this.$errors, 'costRates', languageAliases({
        ko: '비율의 합이 100% 가 아닙니다'
      })[language])
      return false
    }
    return true
  }

  async validateForCreate () {
    return this.validateCostRates() && await this.validate('create')
  }

  async validateForUpdate () {
    return this.validateCostRates() && await this.validate('update')
  }
}

export class ProcessTypePaginationArray extends SpringPaginationArray {
  url = '/process/process-types'
  axios = api
  model = ProcessTypeModel
}

export class ProcessTypeLabelArray extends FetchableArray {
  url = '/process/process-type-query-labels'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword
    })
  }
}


