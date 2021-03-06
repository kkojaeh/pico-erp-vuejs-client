import {
  CollectionArray,
  FetchableArray,
  SpringPaginationArray
} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {language, languageAliases} from 'src/i18n'
import {LabelModel} from 'src/model/shared'
import {authorizedUrl} from "../../plugins/auth";
import qs from "qs";
import {download} from "../data";

export class CompanyImportOptions {

  overwrite = false

}

export class CompanyExportOptions {

  empty = false

}

export class CompanyModel extends Model {

  constructor(data) {
    super(data)
  }

  get defaults() {
    return {
      address: {},
      enabled: true,
      supplier: false,
      customer: false,
      outsourcing: false
    }
  }

  static async owner() {
    const response = await api.get(
        `/company/owner`)
    return new CompanyModel(response.data)
  }

  static async get(id, cacheable) {
    if (!id) {
      return new CompanyModel()
    }
    const response = await api.get(
        `/company/companies/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new CompanyModel(response.data)
  }

  static async exists(id) {
    return exists(api, `/company/companies/${id}`)
  }

  static async existsByRegistrationNumber(registrationNumber) {
    return exists(api, `/company/registration-numbers/${registrationNumber}`)
  }

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/company/xlsx/companies`)
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/company/xlsx/companies?${qs.stringify(
        options)}`
    download(authorizedUrl(url))
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/company/companies', this)
      this.assign(response.data)
    } else {
      await api.put(`/company/companies/${this.id}`, this)
    }
  }

  async validate() {
    const phantom = this.phantom
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 3, maximum: 5},
        format: {
          pattern: '[A-Z0-9]{3,5}',
          message: languageAliases({
            ko: '형식이 틀립니다(영문 대문자/숫자 조합 3~5 글자입니다)'
          })[language]
        },
        exists: async (value) => {
          if (!value) {
            return
          }
          if (!phantom) {
            return
          }
          return await CompanyModel.exists(value)
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      itemDescription: {
        length: {maximum: 200}
      },
      conditionDescription: {
        length: {maximum: 200}
      },
      registrationNumber: {
        length: {minimum: 9, maximum: 20},
        exists: async (value) => {
          if (!value) {
            return
          }
          let result = await CompanyModel.existsByRegistrationNumber(value)
          if (result && result.id !== this.id) {
            return
          } else {
            return !!result
          }
        }
      },
      representative: {
        length: {minimum: 1, maximum: 20}
      }
    }

    return await this.$validate(constraints)
  }
}

export const CompanyPaginationArray = Array.decorate(
    class extends SpringPaginationArray {

      get url() {
        return '/company/companies?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return CompanyModel
      }
    }
)

export const CompanyLabelArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/company/company-query-labels?${$QS}'
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
