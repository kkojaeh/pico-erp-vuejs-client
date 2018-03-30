import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'

export class CompanyModel extends FetchableModel {

  get defaults () {
    return {
      address: {},
      enabled: true,
      supplier: false,
      customer: false,
      outsourcing: false
    }
  }

  get axios () {
    return api
  }

  get url () {
    return '/company/companies/${id}'
  };

  create () {
    return this.axios.post('/company/companies', this)
  }

  update () {
    return this.axios.put('/company/companies/${id}', this)
  }

  exists () {
    return exists(this.axios, '/company/companies/${id}', this)
  }

  existsByRegistrationOrDunsNo () {
    return exists(this.axios,
      '/company/companies/${registrationNumber}?registrationNumber=true',
      this)
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
          let result = await this.exists()
          return result
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      registrationNumber: {
        length: {minimum: 9, maximum: 20},
        exists: async (value) => {
          if (!value) {
            return
          }
          let result = await this.existsByRegistrationOrDunsNo()
          if (result && result.id !== this.id) {
            return
          } else {
            return !!result
          }
        }
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

  async validateForCreate () {
    return await
      this.validate('create')
  }

  async validateForUpdate () {
    return await
      this.validate('update')
  }
}

export class CompanyPaginationArray extends SpringPaginationArray {
  url = '/company/companies'
  axios = api
  model = CompanyModel
}

export class CompanyLabelArray extends FetchableArray {
  url = '/company/company-query-labels'
  axios = api

  query = async (keyword) => {
    return await this.fetch({
      query: keyword
    })
  }
}


