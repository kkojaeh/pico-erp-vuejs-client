<template>
  <uppy ref="uppy" :plugins="uppyPlugins" :auto-proceed="false"
        :restrictions="restrictions"
        @before-file-added="_onUppyBeforeFileAdded"
        @file-added="_onUppyFileAdded"
        @file-removed="_onUppyFileRemoved"
        @before-upload="_onUppyBeforeUpload"
        @upload-success="_onUppyUploadSuccess"
        @complete="_onUppyUploadComplete"></uppy>
</template>

<script>
  import * as _ from 'lodash'
  import Uppy from 'src/components/uppy/uppy.vue'
  import {
    AttachmentFileModel
  } from './attachment-model'

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
        default: 30
      },
      maxNumberOfFiles: {
        type: Number,
        default: 5
      },
      value: {
        type: String
      },
      modelType: {
        type: Function
      },
      category: {
        type: String,
        required: true
      },
      allowedContentTypes: {
        type: Array
      }
    },
    components: {
      'uppy': Uppy
    },
    data () {
      return {
        model: {},
        removed: [],
        headers: {},
        files: {},
        uppyPlugins: {
          Dashboard: {
            hideUploadButton: true,
            hideProgressAfterFinish: true,
            maxHeight: this.$q.platform.is.mobile ? 200 : 300
          },
          Webcam: {},
          XHRUpload: {
            endpoint: 'about:blank',
            fieldName: 'file'
          }
        }
      }
    },
    watch: {
      value (to, from) {
        if (to) {
          if (this.model.id !== to) {
            this._fetch(to)
          }
        } else {
          this._clear()
        }
      }
    },
    computed: {
      restrictions () {
        return {
          maxFileSize: this.maxFileSize * 1024 * 1024,
          maxNumberOfFiles: this.multiple ? this.maxNumberOfFiles : 1,
          minNumberOfFiles: false,
          allowedFileTypes: this.allowedContentTypes || false
        }
      }
    },
    mounted () {
      this._initModel()
    },
    methods: {
      _initModel () {
        this.model = new this.modelType()
        this.model.multiple = this.multiple
        this.model.category = this.category
      },
      async _fetch (id) {
        await this.model.fetch(id)
        this._addFiles(this.model.files)
      },
      async _clear () {
        const uppy = this.$refs.uppy
        uppy.reset()
        this._initModel()
        this.removed = []
        this.files = {}
        this.url = 'about:blank'
      },

      _isImage (file) {
        const type = file.type
        return type && type.indexOf('image/') > -1
      },
      _onUppyBeforeFileAdded ({file}) {
        const uppy = this.$refs.uppy
        if (!this.multiple) {
          uppy.removeAllFiles()
        }
        if (!file.isRemote && !this._isImage(file)) {
          file.preview = this.modelType.iconUrlByName(file.name)
        }
      },
      _onUppyFileAdded ({file}) {
        const uppy = this.$refs.uppy
        if (file.isRemote) {
          this.$nextTick(() => {
            let files = uppy.getState().files
            let uppyFile = files[file.id]
            this.files[file.id] = file.source
            uppyFile.uploadURL = uppyFile.remote
            uppy.setState({
              files: files
            })
          })
        }
      },
      _onUppyFileRemoved ({file}) {
        const fileId = file
        const source = this.files[fileId]

        if (source) {
          this.removed.push(source)
        }
      },
      async _onUppyUploadSuccess ({response, fileId}) {
        const uppy = this.$refs.uppy
        const model = this.model
        const fileModel = await this.model.addFile(
          new AttachmentFileModel.Builder(model)
          .id(response.id)
          .name(response.name)
          .size(response.contentLength)
          .type(response.contentType)
          .build()
        )
        let uppyFile = uppy.getFileState(fileId)
        this.files[fileId] = fileModel.id
        uppyFile.source = fileModel.id
        uppyFile.uploadURL = fileModel.download
        uppyFile.isRemote = true
        uppyFile.remote = fileModel.download
        uppy.setFileState(id, uppyFile)
      },

      _onUppyUploadComplete ({result}) {
        const uppy = this.$refs.uppy
        const successful = result.successful
        successful.forEach((file) => {
          // 업로드 완료 상태 및 삭제 가능 상태로 하기 위함
          delete file.progress.uploadStarted
          delete file.progress.uploadComplete
        })

      },

      async _onUppyBeforeUpload ({files}) {
        _.forIn(files, (file, id) => {
          // 업로드 대상에서 제외 시키기 위함
          if (file.isRemote) {
            file.progress.uploadStarted = true
            setTimeout(() => {
              delete file.progress.uploadStarted
            }, 1)
          }
        })
      },

      async _addFiles (files) {
        return await Promise.all(files.map(this._addFile))
      },

      async _addFile (file) {
        const uppy = this.$refs.uppy
        return await uppy.addFile({
          source: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          data: {
            size: file.size
          },
          preview: this._isImage(file) ? file.thumbnail : this.modelType.iconUrlByContentType(
            file.type),
          remote: file.download,
          isRemote: true
        })
      },

      _hasChanged () {
        const uppy = this.$refs.uppy
        const hasLocal = _.values(uppy.getState().files)
        .filter((file) => !file.isRemote).length > 0
        return hasLocal || this.removed.length
      },

      async _uploadFiles () {
        const uppy = this.$refs.uppy
        const xhrUpload = uppy.getPlugin('XHRUpload')
        xhrUpload.opts.endpoint = this.model.uploadUrl
        xhrUpload.opts.headers = this.model.headers
        return await uppy.upload()
      },

      async _removeFiles () {
        return await Promise.all(
          this.removed
          .map((id) => this.model.removeFile(id))
        )
      },

      async save () {
        let value = this.value
        if (this._hasChanged()) {
          if (!value) {
            value = await this.model.create()
          }
          await Promise.all([this._removeFiles(), this._uploadFiles()])
          this.$emit('input', value)
        }
        return value
      }

    }
  }

</script>
