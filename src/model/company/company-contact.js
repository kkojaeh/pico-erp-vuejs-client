import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

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

  async create() {
    this.id = uuid()
    const response = await api.post('/company/contacts', this)
    this.assign(response.data)
  }

  async update() {
    return await api.put(`/company/contacts/${this.id}`, this)
  }

  async validate(state) {
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

  async validateCreate() {
    return await
        this.validate('create')
  }

  async validateUpdate() {
    return await
        this.validate('update')
  }
}

export class CompanyContactPaginationArray extends SpringPaginationArray {
  url = '/company/contacts?${$QS}'
  axios = api
  model = CompanyContactModel

  query = async (companyId) => {
    return await this.fetch({
      companyId: companyId
    })
  }

  validates = async () => {
    const results = await Promise.all(
        this.map(contact => {
          if (!contact.id) {
            return contact.validateCreate()
          } else if (contact.hasChanged()) {
            return contact.validateUpdate()
          }
        }).filter(validate => !!validate)
    )
    // 결과가 false 인 유효하지 않은 값이 없다면 모두 유효함
    return results.filter(valid => valid == false).length == 0
  }

  save = async () => {
    await Promise.all(
        this.map(contact => {
          if (!contact.id) {
            return contact.create()
          } else if (contact.hasChanged()) {
            return contact.update()
          }
        }).filter(execute => !!execute)
    )
  }

}

export class CompanyContactLabelArray extends FetchableArray {
  url = '/company/contact-query-labels?${$QS}'
  axios = api

  query = async (companyId, keyword) => {
    return await this.fetch({
      companyId: companyId,
      query: keyword || ''
    })
  }
}


