import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model } from 'src/model/model'
import { api } from 'src/plugins/axios'
import qs from 'qs'
import store from '../../store'

export class GroupImportOptions {

  overwrite = false

}

export class GroupExportOptions {

  empty = false

}

export class GroupModel extends Model {

  static get importByXlsxUrl () {
    const host = api.defaults.baseURL
    const authQs = store.getters['auth/tokenParameterName'] + '='
      + store.getters['auth/token']
    return `${host}/user/import/groups/xlsx?${authQs}`
  }

  get defaults () {
    return {}
  }

  static exportAsXlsx (options) {
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

  static async get (id) {
    const response = await api.get(`/user/groups/${id}`)
    return new GroupModel(response.data)
  }

  static async exists (id) {
    return await exists(api, `/user/groups/${id}`)
  }

  async create () {
    const response = await api.post('/user/groups', this)
    this.assign(response.data)
  }

  async update () {
    await api.put(`/user/groups/${this.id}`, this)
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
          if (!state !== 'create') {
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

  async validateCreate () {
    return await this.validate('create')
  }

  async validateUpdate () {
    return await this.validate('update')
  }

}

export class GroupArray extends SpringPaginationArray {
  url = '/user/groups?${$QS}'
  axios = api
  model = GroupModel
}

export class GroupRoleModel extends Model {

  async grant () {
    await api.post(`/user/groups/${this.groupId}/role`, this)
  }

  async revoke () {
    await api.delete(`/user/groups/${this.groupId}/role`, {
      data: this
    })
  }
}

export class GroupUserModel extends Model {
  async add () {
    await api.post(`/user/groups/${this.groupId}/user`, this)
  }

  async remove () {
    await api.delete(`/user/groups/${this.groupId}/user`, {
      data: this
    })
  }
}

export class GroupRoleArray extends FetchableArray {
  url = '/user/groups/${id}/role'
  axios = api
  model = GroupRoleModel
}

export class GroupUserArray extends FetchableArray {
  url = '/user/groups/${id}/user'
  axios = api
  model = GroupUserModel
}
