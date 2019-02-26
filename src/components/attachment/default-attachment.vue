<template>
  <uppy-attachment ref="attachment" v-model="model" :model-type="modelType"
                   :multiple="multiple" :max-file-size="maxFileSize"
                   :max-number-of-files="maxNumberOfFiles" :category="category"
                   :readonly="readonly" :allowed-content-types="allowedContentTypes">
  </uppy-attachment>

</template>

<script>
  import UppyAttachment from './uppy-attachment.vue'
  import {DefaultAttachmentModel} from 'src/model/attachment/attachment-impl'

  import {Loading} from 'quasar'

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
      allowedContentTypes: {
        type: Array
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
    data() {
      return {
        model: null,
        modelType: DefaultAttachmentModel
      }
    },
    watch: {
      value(to, from) {
        this.model = to
      },
      model(to, from) {
        this.$emit('input', to)
      }
    },
    methods: {
      async save() {
        Loading.show({
          delay: 0
        })
        const result = await this.$refs.attachment.save()
        Loading.hide()
        return result
      },

      getFiles() {
        return this.$refs.attachment.getFiles()
      }
    },
    mounted() {
      this.model = this.value
    }

  }

</script>
