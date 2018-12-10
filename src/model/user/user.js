import {
  CollectionArray,
  FetchableArray,
  SavableArray,
  SpringPaginationArray
} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'
import qs from 'qs'
import {authorizedUrl} from 'src/plugins/auth'
import {download} from 'src/model/data'

export class UserImportOptions {

  overwrite = false

}

export class UserExportOptions {

  empty = false

}

export class UserModel extends Model {

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/user/xlsx/users`)
  }

  get defaults() {
    return {
      enabled: true
    }
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/user/xlsx/users?${qs.stringify(options)}`
    download(authorizedUrl(url))
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
    if (this.phantom) {
      const response = api.post('/user/users', this)
      this.assign(response.data)
    } else {
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
    CollectionArray,
    SavableArray,
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

      async fetch() {
        return await super.fetch({
          userId: this.user.id || ' '
        })
      }

      async saveElement(element) {
        return await element.granted ? element.grant() : element.revoke()
      }

      isSaveTarget(element) {
        return element.hasChanged('granted')
      }

      applyEach(element) {
        element.userId = this.user.id
      }
    }
)

export const UserLabelArray = Array.decorate(
    CollectionArray,
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

      async fetch(keyword) {
        return await super.fetch({
          query: keyword || ''
        })
      }
    }
)
