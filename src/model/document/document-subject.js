import {SpringPaginationArray} from 'src/model/array'
import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'

export class DocumentSubjectModel extends Model {

  constructor(data) {
    super(data)
  }

  get defaults() {
    return {}
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new DocumentSubjectModel()
    }
    const response = await api.get(
        `/e-document/subjects/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new DocumentSubjectModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/e-document/subjects/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/e-document/subjects',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/e-document/subjects/${this.id}`, this)
    }
  }

  async test(key) {
    const response = await api.post(
        `/e-document/subjects/${this.id}/test`, {
          key: key,
          template: this.template
        }, {
          responseType: 'blob'
        })
    return response.data
  }

  async validate() {
    let constraints = {
      name: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }
}

export const DocumentSubjectPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/e-document/subjects?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return DocumentSubjectModel
      }
    }
)