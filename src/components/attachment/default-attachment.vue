<template>
  <uppy-attachment ref="attachment" v-model="model" :model-type="modelType"
                   :multiple="multiple" :max-file-size="maxFileSize"
                   :max-number-of-files="maxNumberOfFiles" :category="category"
                   :readonly="readonly">
  </uppy-attachment>

</template>

<script>
  import UppyAttachment from './uppy-attachment.vue'
  import { AttachmentFileModel, AttachmentModel } from './attachment-model'
  import { api } from 'src/plugins/axios'
  import * as _ from 'lodash'
  import store from 'src/store'

  class DefaultAttachmentModel extends AttachmentModel {

    async fetch (id) {
      const response = await api.get(`/attachment/attachments/${id}`, {})
      _.assign(this, response.data)
      return this
    }

    async create () {
      const response = await api.post('/attachment/attachments', {
        multiple: this.multiple,
        categoryId: this.category
      })
      _.assign(this, response.data)
      return this.id
    }

    async delete () {
      const id = this.id
      await api.delete(`/attachment/attachments/${id}`, {})
    }

    get headers () {
      const headers = {}
      headers[store.getters['auth/tokenHeaderName']] = store.getters['auth/token']
      return headers
    }

    get files () {
      return this.items.map(this.mapFile.bind(this))
    }

    mapFile (item) {
      const authQs = store.getters['auth/tokenParameterName'] + '=' + store.getters['auth/token']
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

    get uploadUrl () {
      const host = api.defaults.baseURL
      const id = this.id
      return `${host}/attachment/attachments/${id}/items`
    }

    static iconUrlByName (name) {
      const host = api.defaults.baseURL
      const extension = name.substring(name.lastIndexOf('.'))
      return `${host}/attachment/icons/${extension}`
    }

    static iconUrlByContentType (contentType) {
      const host = api.defaults.baseURL
      if (contentType) {
        return `${host}/attachment/icons/${contentType}`
      }
    }

    async addFile (file) {
      const item = {
        id: file.id,
        name: file.name,
        contentLength: file.size,
        contentType: file.type
      }
      this.items.push(item)
      return this.mapFile(item)
    }

    async removeFile (fileId) {
      const id = this.id
      const item = this.items.find((item) => item.id === fileId)
      if (!item) {
        throw Error('not fout item')
      }
      await api.delete(`/attachment/attachments/${id}/items/${item.id}`)
      return `${item.id}`
    }

  }

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      /**
       * 최대 파일 사이즈 MB
       */
      maxFileSize: {
        type: Number,
        default: 100
      },
      maxNumberOfFiles: {
        type: Number,
        default: 5
      },
      value: {
        type: String
      },
      category: {
        type: String,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'uppy-attachment': UppyAttachment
    },
    data () {
      return {
        model: null,
        modelType: DefaultAttachmentModel
      }
    },
    watch: {
      value (to, from) {
        this.model = to
      },
      model (to, from) {
        this.$emit('input', to)
      }
    },
    methods: {
      async save () {
        return await this.$refs.attachment.save()
      }
    },
    mounted () {
      this.model = this.value
    }

  }

</script>
