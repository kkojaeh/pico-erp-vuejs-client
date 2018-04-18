import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'

export class QuotationModel extends Model {

  get defaults () {
    return {
      address: {},
      enabled: true,
      supplier: false,
      customer: false,
      outsourcing: false
    }
  }

  static async get (id) {
    const response = await api.get(`/quotation/quotations/${id}`)
    return new QuotationModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/quotation/quotations/${id}`)
  }

  async create () {
    const response = await api.post('/quotation/quotations', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/quotation/quotations/${this.id}`, this)
  }

  async validate (state) {
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
          if (state !== 'create') {
            return
          }
          let result = await QuotationModel.exists(value)
          return result
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      representative: {
        length: {minimum: 1, maximum: 20}
      },
      mobilePhoneNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      },
      faxNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      },
      telephoneNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
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

export class QuotationPaginationArray extends SpringPaginationArray {
  url = '/quotation/quotations?${$QS}'
  axios = api
  model = QuotationModel
}

export class QuotationSatusArray extends FetchableArray {
  url = '/quotation/status-labels'
  axios = api
}

export class QuotationExpiryPolicyArray extends FetchableArray {
  url = '/quotation/expiry-policy-labels'
  axios = api
}
