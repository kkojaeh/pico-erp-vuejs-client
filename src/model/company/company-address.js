import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

export class CompanyAddressModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      enabled: true,
      address: {}
    }
  }

  get defaultErrors() {
    return {
      address: {}
    }
  }

  static async get(id, cacheable) {
    if (!id) {
      return new CompanyAddressModel()
    }
    const response = await api.get(
        `/company/addresses/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new CompanyAddressModel(response.data)
  }

  static async exists(id) {
    return exists(api, `/company/addresses/${id}`)
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/company/addresses', this)
      this.assign(response.data)
    } else {
      await api.put(`/company/addresses/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(`/company/addresses/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      companyId: {
        presence: true
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      mobilePhoneNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      },
      telephoneNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      },
      'address.postalCode': {
        presence: true,
        length: {minimum: 5, maximum: 6}
      },
      'address.street': {
        presence: true,
        length: {minimum: 10, maximum: 50}
      },
      'address.detail': {
        presence: true,
        length: {minimum: 3, maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }

}

export const CompanyAddressArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/company/companies/${companyId}/addresses'
      }

      get axios() {
        return api
      }

      get model() {
        return CompanyAddressModel
      }

      initialize(company) {
        super.initialize()
        this.company = company
      }

      async fetch() {
        return await super.fetch({
          companyId: this.company.id
        })
      }

      applyEach(element){
        element.companyId = this.company.id
      }

    }
)

export const CompanyAddressLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/company/address-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      async fetch(companyId, keyword) {
        return await super.fetch({
          companyId: companyId,
          query: keyword || ''
        })
      }
    }
)


