import {AttachmentFileModel, AttachmentModel} from './attachment'
import {api} from 'src/plugins/axios'
import * as _ from 'lodash'
import store from 'src/store'

export class DefaultAttachmentModel extends AttachmentModel {

  constructor() {
    super()
    this.items = []
  }

  get headers() {
    const headers = {}
    headers[store.getters['auth/tokenHeaderName']] = store.getters['auth/token']
    return headers
  }

  get files() {
    return this.items.map(this.mapFile.bind(this))
  }

  get uploadUrl() {
    const host = api.defaults.baseURL
    const id = this.id
    return `${host}/attachment/attachments/${id}/items`
  }

  static iconUrlByName(name) {
    const host = api.defaults.baseURL
    const extension = name.substring(name.lastIndexOf('.'))
    return `${host}/attachment/icons/${extension}`
  }

  static iconUrlByContentType(contentType) {
    const host = api.defaults.baseURL
    if (contentType) {
      return `${host}/attachment/icons/${contentType}`
    }
  }

  async fetch(id) {
    if (!id) {
      return this
    }
    const response = await api.get(`/attachment/attachments/${id}`, {})
    _.assign(this, response.data)
    const itemResponse = await api.get(`/attachment/attachments/${id}/items`,
        {})
    this.items = itemResponse.data
    return this
  }

  async create() {
    const response = await api.post('/attachment/attachments', {
      multiple: this.multiple,
      categoryId: this.category
    })
    _.assign(this, response.data)
    return this.id
  }

  async delete() {
    const id = this.id
    await api.delete(`/attachment/attachments/${id}`, {})
  }

  mapFile(item) {
    const authQs = store.getters['auth/tokenParameterName'] + '='
        + store.getters['auth/token']
    const id = this.id
    const host = api.defaults.baseURL
    return new AttachmentFileModel.Builder(this)
    .id(item.id)
    .name(item.name)
    .size(item.contentLength)
    .thumbnail(`${host}/attachment/thumbnails/${id}/items/${item.id}?${authQs}`)
    .download(`${host}/attachment/attachments/${id}/items/${item.id}?${authQs}`)
    .type(item.contentType)
    .build()
  }

  async addFile(file) {
    const item = {
      id: file.id,
      name: file.name,
      contentLength: file.size,
      contentType: file.type
    }
    this.items.push(item)
    return this.mapFile(item)
  }

  async removeFile(fileId) {
    const id = this.id
    const item = this.items.find((item) => item.id === fileId)
    if (!item) {
      throw Error('not fout item')
    }
    await api.delete(`/attachment/attachments/${id}/items/${item.id}`)
    return `${item.id}`
  }

}