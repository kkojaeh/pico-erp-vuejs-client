import {FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

const removedSymbol = Symbol('removed')

export class CompanyContactModel extends Model {

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
    return !this.id
  }

  async save() {
    if (this.phantom) {
      this.id = uuid()
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
        this[removedSymbol] = []
      }

      async query() {
        return await this.fetch({
          companyId: this.company.id
        })
      }

      async validate() {
        this.forEach(element => element.companyId = this.company.id)
        const results = await Promise.all(
            this.filter(element => !element.id || element.hasChanged())
            .map(contact => contact.validate())
        )
        // 결과가 false 인 유효하지 않은 값이 없다면 모두 유효함
        return results.filter(valid => valid == false).length == 0
      }

      async save() {
        this.forEach(element => element.companyId = this.company.id)
        await Promise.all(
            this.filter(element => !element.id || element.hasChanged())
            .map(contact => contact.save())
        )
        await Promise.all(
            this[removedSymbol].map(element => element.delete())
        )
        this[removedSymbol] = []
      }

      remove(element) {
        super.remove(element)
        if (!element.phantom) {
          this[removedSymbol].push(element)
        }
      }

      clear() {
        super.clear()
        this[removedSymbol] = []
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