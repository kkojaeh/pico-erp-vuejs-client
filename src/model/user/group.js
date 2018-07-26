import {
  FetchableArray,
  SavableArray,
  SpringPaginationArray
} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import qs from 'qs'
import {authorizedUrl} from 'src/plugins/auth'
import {download} from 'src/model/data'

export class GroupImportOptions {

  overwrite = false

}

export class GroupExportOptions {

  empty = false

}

export class GroupModel extends Model {

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    return authorizedUrl(`${host}/user/import/groups/xlsx`)
  }

  get defaults() {
    return {}
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const url = `${host}/user/export/groups/xlsx?${qs.stringify(options)}`
    download(authorizedUrl(url))
  }

  static async get(id) {
    const response = await api.get(`/user/groups/${id}`)
    return new GroupModel(response.data)
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async exists(id) {
    return await exists(api, `/user/groups/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/user/groups', this)
      this.assign(response.data)
    } else {
      await api.put(`/user/groups/${this.id}`, this)
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
          let result = await GroupModel.exists(value)
          return result
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      }
    }
    return await this.$validate(constraints)
  }

}

export const GroupArray = Array.decorate(
    class extends SpringPaginationArray {

      get url() {
        return '/user/groups?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return GroupModel
      }
    }
)

export class GroupRoleModel extends Model {

  async grant() {
    await api.post(`/user/groups/${this.groupId}/roles`, this)
  }

  async revoke() {
    await api.delete(`/user/groups/${this.groupId}/roles`, {
      data: this
    })
  }
}

export class GroupUserModel extends Model {

  get phantom() {
    return this.hasChanged("userId")
  }

  async add() {
    await api.post(`/user/groups/${this.groupId}/users`, this)
  }

  async remove() {
    await api.delete(`/user/groups/${this.groupId}/users`, {
      data: this
    })
  }
}

export const GroupRoleArray = Array.decorate(
    SavableArray,
    class extends FetchableArray {
      get url() {
        return '/user/groups/${groupId}/roles'
      }

      get axios() {
        return api
      }

      get model() {
        return GroupRoleModel
      }

      initialize(group) {
        super.initialize()
        this.group = group
      }

      async query() {
        return await this.fetch({
          groupId: this.group.id || ' '
        })
      }

      isSaveTarget(element) {
        return element.hasChanged('granted')
      }

      async saveElement(element) {
        return await element.granted ? element.grant() : element.revoke()
      }

      applyEach(element) {
        element.groupId = this.group.id
      }

    }
)

export const GroupUserArray = Array.decorate(
    SavableArray,
    class extends FetchableArray {
      get url() {
        return '/user/groups/${groupId}/users'
      }

      get axios() {
        return api
      }

      get model() {
        return GroupUserModel
      }

      initialize(group) {
        super.initialize()
        this.group = group
      }

      async query() {
        return await this.fetch({
          groupId: this.group.id || ' '
        })
      }

      async saveElement(element) {
        return await element.add()
      }

      async removeElement(element) {
        return await element.remove()
      }

      applyEach(element) {
        element.groupId = this.group.id
      }

    }
)