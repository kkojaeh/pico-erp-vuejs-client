<template>
  <uppy ref="uppy" :plugins="uppyPlugins" :auto-proceed="autoProceed"
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

  export default {
    props: {
      autoProceed: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: () => {}
      },
      url: {
        type: String,
        required: true
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
          XHRUpload: {
            endpoint: this.url,
            fieldName: 'file'
          }
        },
        viewers: []
      }
    },
    watch: {

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
    },
    methods: {

      async clear () {
        const uppy = this.$refs.uppy
        uppy.reset()
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
      },
      _onUppyFileAdded ({file}) {
        const uppy = this.$refs.uppy
      },
      _onUppyFileRemoved ({file}) {

      },
      async _onUppyUploadSuccess ({response, fileId}) {
        if (!_.isString(fileId)) {
          fileId = fileId.id
        }
        const uppy = this.$refs.uppy
      },

      _onUppyUploadComplete ({result}) {
        const uppy = this.$refs.uppy
      },

      async _onUppyBeforeUpload ({files}) {

      },

      async upload () {
        const uppy = this.$refs.uppy
        return await uppy.upload()
      }


    },

    beforeDestroy () {
    }
  }

</script>
