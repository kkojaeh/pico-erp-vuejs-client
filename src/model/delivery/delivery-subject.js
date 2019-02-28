import {SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'

export class DeliverySubjectModel extends Model {

  constructor(data) {
    super(data)
  }

  get defaults() {
    return {
      titleTemplate: null,
      bodyTemplate: null
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
      return new DeliverySubjectModel()
    }
    const response = await api.get(
        `/delivery/subjects/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new DeliverySubjectModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/delivery/subjects/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/delivery/subjects',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/delivery/subjects/${this.id}`, this)
    }
  }

  async validate() {
    let constraints = {
      name: {
        length: {maximum: 50}
      },
      titleTemplate: {
        length: {maximum: 150},
        presence: true
      },
      bodyTemplate: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }
}

export const DeliverySubjectPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/delivery/subjects?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return DeliverySubjectModel
      }
    }
)