import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {download} from "../data";
import {authorizedUrl} from "../../plugins/auth";

export class DocumentModel extends Model {

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
      return new DocumentModel()
    }
    const response = await api.get(
        `/e-document/documents/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new DocumentModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/e-document/documents/${id}`)
  }

  static async download(id) {
    const host = api.defaults.baseURL
    const url = `${host}/e-document/documents/${id}/download`
    download(authorizedUrl(url))
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/e-document/documents',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/e-document/documents/${this.id}`, this)
    }
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