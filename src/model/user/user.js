import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'
import store from 'src/store'
import qs from 'qs'

export class UserImportOptions {

  overwrite = false

}

export class UserExportOptions {

  empty = false

}

export class UserModel extends Model {

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
        + store.getters['auth/token']
    return `${host}/user/import/users/xlsx?${authQs}`
  }

  get defaults() {
    return {
      enabled: true
    }
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
        + store.getters['auth/token']
    const link = document.createElement('a')
    link.href = `${host}/user/export/users/xlsx?${qs.stringify(
        options)}&${authQs}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static async get(id, cacheable) {
    if (!id) {
      return new UserModel()
    }
    const response = await api.get(
        `/user/users/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new UserModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/user/users/${id}`)
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  async save() {
    if(this.phantom){
      const response = api.post('/user/users', this)
      this.assign(response.data)
    }else{
      await api.put(`/user/users/${this.id}`, this)
    }
  }

  async validate() {
    const phantom = this.phantom
    const constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        exists: async (value) => {
          if (!value) {
            return
          }
          if (!phantom) {
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
      },
      position: {
        length: {maximum: 20}
      }

    }
    return await this.$validate(constraints)
  }

}

export class UserRoleModel extends Model {

  async grant() {
    await api.post(`/user/users/${this.userId}/roles`, this)
  }

  async revoke() {
    await api.delete(`/user/users/${this.userId}/roles`, {
      data: this
    })
  }
}

export const UserPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/user/users?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return UserModel
      }
    }
)


export const UserRoleArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/user/users/${userId}/roles'
      }

      get axios() {
        return api
      }

      get model() {
        return UserRoleModel
      }

      initialize(user) {
        super.initialize()
        this.user = user
      }

      async query() {
        return await this.fetch({
          userId: this.user.id || ' '
        })
      }

      async save() {
        this.forEach(element => element.userId = this.user.id)
        await Promise.all(
            this.filter(element => element.hasChanged('granted'))
            .map(element => element.granted ? element.grant() : element.revoke())
        )
      }
    }
)

export const UserLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/user/user-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async query(keyword) {
        return await this.fetch({
          query: keyword || ''
        })
      }
    }
)
