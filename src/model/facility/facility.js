import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {SpringPaginationArray} from '../array'

export class FacilityModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {}
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new FacilityModel()
    }
    const response = await api.get(
        `/facility/facilities/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new FacilityModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/facility/facilities/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/facility/facilities', this)
      this.assign(response.data)
    } else {
      await api.put(`/facility/facilities/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(`/facility/facilities/${this.id}`)
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 3, maximum: 100}
      },
      categoryId: {
        presence: true
      }
    }
    return await this.$validate(constraints)
  }
}

export const FacilityPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/facility/facilities?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return FacilityModel
      }
    }
)
