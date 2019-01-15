import {SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'

export class NotifyTypeModel extends Model {

  constructor(data) {
    super(data)
  }

  get defaults() {
    return {
      senders: []
    }
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new NotifyTypeModel()
    }
    const response = await api.get(
        `/notify/types/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new NotifyTypeModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/notify/types/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/notify/types',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/notify/types/${this.id}`, this)
    }
  }

  async testCompileMarkdown(key) {
    const response = await api.post(
        `/notify/types/${this.id}/test-compile/markdown`, {
          key: key,
          markdownTemplate: this.markdownTemplate
        })
    return response.data
  }

  async validate() {
    let constraints = {
      name: {
        length: {maximum: 50}
      },
      enabled: {
        presence: true
      },
      multipleSend: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }
}

export const NotifyTypePaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/notify/types?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return NotifyTypeModel
      }
    }
)