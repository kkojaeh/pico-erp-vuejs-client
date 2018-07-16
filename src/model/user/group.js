import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import qs from 'qs'
import store from '../../store'

export class GroupImportOptions {

  overwrite = false

}

export class GroupExportOptions {

  empty = false

}

export class GroupModel extends Model {

  static get importByXlsxUrl() {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
        + store.getters['auth/token']
    return `${host}/user/import/groups/xlsx?${authQs}`
  }

  get defaults() {
    return {}
  }

  static exportAsXlsx(options) {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
        + store.getters['auth/token']
    const link = document.createElement('a')
    link.href = `${host}/user/export/groups/xlsx?${qs.stringify(
        options)}&${authQs}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    if(this.phantom) {
      const response = await api.post('/user/groups', this)
      this.assign(response.data)
    }else{
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

  get phantom(){
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

      async save() {
        this.forEach(element => element.groupId = this.group.id)
        await Promise.all(
            this.filter(element => element.hasChanged('granted'))
                .map(element => element.granted ? element.grant() : element.revoke())
        )
      }

    }
)

const removedSymbol = Symbol('removed')

export const GroupUserArray = Array.decorate(
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
        this[removedSymbol] = []
      }

      async query() {
        return await this.fetch({
          groupId: this.group.id || ' '
        })
      }

      async save() {
        this.forEach(element => element.groupId = this.group.id)
        await Promise.all(
            this.filter(element => element.phantom)
            .map(element => element.add())
        )

        await Promise.all(
            this[removedSymbol].map(element => element.remove())
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