import {FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

const removedSymbol = Symbol('removed')

export class CompanyAddressModel extends Model {

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
    return !this.id
  }

  async save() {
    if (this.phantom) {
      this.id = uuid()
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

      initialize(companyId) {
        super.initialize(companyId)
        this.companyId = companyId
        this[removedSymbol] = []
      }

      async query() {
        return await this.fetch({
          companyId: this.companyId
        })
      }

      async validates() {
        const results = await Promise.all(
            this.filter(address => !address.id || address.hasChanged())
            .map(address => address.validate())
        )
        // 결과가 false 인 유효하지 않은 값이 없다면 모두 유효함
        return results.filter(valid => valid == false).length == 0
      }

      async save() {
        await Promise.all(
            this.filter(address => !address.id || address.hasChanged())
            .map(address => address.save())
        )
        await Promise.all(
            this[removedSymbol].map(address => address.delete())
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

export const CompanyAddressLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/company/address-query-labels?${$QS}'
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


