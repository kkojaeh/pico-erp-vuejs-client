import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

export class CompanyContactModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      enabled: true,
      contact: {}
    }
  }

  get defaultErrors() {
    return {
      contact: {}
    }
  }

  static async get(id, cacheable) {
    if (!id) {
      return new CompanyContactModel()
    }
    const response = await api.get(
        `/company/contacts/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new CompanyContactModel(response.data)
  }

  static async exists(id) {
    return exists(api, `/company/contacts/${id}`)
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/company/contacts', this)
      this.assign(response.data)
    } else {
      await api.put(`/company/contacts/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(`/company/contacts/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      companyId: {
        presence: true
      },
      'contact.name': {
        presence: true,
        length: {minimum: 2, maximum: 20}
      },
      'contact.email': {
        presence: false,
        email: true,
        length: {minimum: 0, maximum: 30}
      },
      'contact.mobilePhoneNumber': {
        presence: true,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      'contact.faxNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      },
      'contact.telephoneNumber': {
        presence: false,
        phoneNumber: true,
        length: {minimum: 0, maximum: 20}
      }
    }

    return await this.$validate(constraints)
  }

}

export const CompanyContactArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/company/companies/${companyId}/contacts'
      }

      get axios() {
        return api
      }

      get model() {
        return CompanyContactModel
      }

      initialize(company) {
        super.initialize()
        this.company = company
      }

      async query() {
        return await this.fetch({
          companyId: this.company.id
        })
      }

      applyEach(element){
        element.companyId = this.company.id
      }

    }
)

export const CompanyContactLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/company/contact-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      async query(companyId, keyword) {
        return await this.fetch({
          companyId: companyId,
          query: keyword || ''
        })
      }
    }
)