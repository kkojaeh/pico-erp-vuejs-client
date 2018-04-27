import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { ItemModel } from '../item/item'

export class UserModel extends Model {

  get defaults () {
    return {
      enabled: true
    }
  }

  static async get (id, cacheable) {
    if(!id){
      return new UserModel()
    }
    const response = await api.get(`/user/users/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new UserModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/user/users/${id}`)
  }

  async create () {
    const response = api.post('/user/users', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/user/users/${this.id}`, this)
  }

  async validate (state) {
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        exists: async (value) => {
          if (!value) {
            return
          }
          if (state !== 'create') {
            return
          }
          let result = await UserModel.exists(value)
          return result
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      email: {
        presence: true,
        email: true,
        length: {minimum: 2, maximum: 50}
      },
      mobilePhoneNumber: {
        presence: true,
        phoneNumber: true,
        length: {minimum: 2, maximum: 50}
      }
    }
    return await this.$validate(constraints)
  }

  async validateCreate () {
    return await this.validate('create')
  }

  async validateUpdate () {
    return await this.validate('update')
  }

}

export class UserRoleModel extends Model {
  get axios () {
    return api
  }

  get url () {
    return `/user/users/${this.userId}/role`
  };

  async grant () {
    await api.post(`/user/users/${this.userId}/role`, this)
  }

  async revoke () {
    await api.delete(`/user/users/${this.userId}/role`, {
      data: this
    })
  }
}

export class UserPaginationArray extends SpringPaginationArray {
  url = '/user/users?${$QS}'
  axios = api
  model = UserModel
}

export class UserRoleArray extends FetchableArray {
  url = '/user/users/${id}/role'
  axios = api
  model = UserRoleModel
}

export class UserLabelArray extends FetchableArray {
  url = '/user/user-query-labels?${$QS}'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }

}
