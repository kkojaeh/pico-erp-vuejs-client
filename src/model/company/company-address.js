import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'

export class CompanyAddressModel extends Model {

  get defaults () {
    return {
      enabled: true,
      address: {}
    }
  }

  get defaultErrors () {
    return {
      address: {}
    }
  }

  static async get (id, cacheable) {
    if (!id) {
      return new CompanyAddressModel()
    }
    const response = await api.get(
        `/company/addresses/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new CompanyAddressModel(response.data)
  }

  static async exists (id) {
    return exists(api, `/company/addresses/${id}`)
  }

  async create () {
    this.id = uuid()
    const response = await api.post('/company/addresses', this)
    this.assign(response.data)
  }

  async update () {
    return await api.put(`/company/addresses/${this.id}`, this)
  }

  async validate (state) {
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
        length: {minimum: 5, maximum: 50}
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

export class CompanyAddressPaginationArray extends SpringPaginationArray {
  url = '/company/addresses?${$QS}'
  axios = api
  model = CompanyAddressModel

  query = async (companyId) => {
    return await this.fetch({
      companyId: companyId
    })
  }

  validates = async () => {
    const results = await Promise.all(
        this.map(address => {
          if (!address.id) {
            return address.validateCreate()
          } else if (address.hasChanged()) {
            return address.validateUpdate()
          }
        }).filter(validate => !!validate)
    )
    // 결과가 false 인 유효하지 않은 값이 없다면 모두 유효함
    return results.filter(valid => valid == false).length == 0
  }

  save = async () => {
    await Promise.all(
        this.map(address => {
          if (!address.id) {
            return address.create()
          } else if (address.hasChanged()) {
            return address.update()
          }
        }).filter(execute => !!execute)
    )
  }

}

export class CompanyAddressLabelArray extends FetchableArray {
  url = '/company/address-query-labels?${$QS}'
  axios = api

  query = async (companyId, keyword) => {
    return await this.fetch({
      companyId: companyId,
      query: keyword || ''
    })
  }
}


