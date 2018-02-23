<template>
<dropzone ref="dropzone" :auto-process-queue="false" :max-file-size="maxFileSize" :max-number-of-files="maxNumberOfFiles" :thumbnail-width="120" :thumbnail-height="120" :use-font-awesome="true"
          :url="url" :headers="headers"
  @vdropzone-file-added="_onDropzoneFileAdded" @vdropzone-success="_onDropzoneSuccess" @vdropzone-removed-file="_onDropzoneRemovedFile">
  <!-- v-on:vdropzone-success="success" -->
  <script type="text/preview-template">
    <div class="dz-preview dz-file-preview">
      <div class="dz-image" style="width:${thumbnailWidth}px;height:${thumbnailHeight}px;">
        <img data-dz-thumbnail />
      </div>
      <div class="dz-details">
        <div class="dz-size"><span data-dz-size></span></div>
        <div class="dz-filename"><span data-dz-name></span></div>
      </div>
      <div class="dz-progress">
        <span class="dz-upload" data-dz-uploadprogress></span>
      </div>
      <div class="dz-error-message">
        <span data-dz-errormessage></span>
      </div>
      <div class="dz-success-mark">${doneIcon}</div>
      <div class="dz-error-mark">${errorIcon}</div>
      <a class="dz-download" data-dz-download>${downloadIcon}</a>
    </div>
  </script>
</dropzone>

</template>

<script>
import Dropzone from 'src/dropzone/Dropzone.vue'
import {
  AttachmentFileModel
} from 'src/attachment/AbstractAttachmentModel'

export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    maxFileSize: {
      type: Number,
      default: 20
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
    }
  },
  components: {
    'dropzone': Dropzone
  },
  data() {
    return {
      model: {},
      removed: [],
      url: 'about:blank',
      headers: {}
    }
  },
  watch : {
    value(to, from) {
      if(to){
        if(this.model.id !== to) {
          this._fetch(to);
        }
      }else{
        this._clear();
      }
    }
  },
  mounted() {
    this._initModel();
  },
  methods: {
    _initModel() {
      this.model = new this.modelType();
      this.model.multiple = this.multiple;
      this.model.category = this.category;
    },
    async _fetch(id) {
      await this.model.fetch(id);
      this._addFiles(this.model.files);
    },
    async _clear() {
      const dropzone = this.$refs.dropzone;
      dropzone.removeAllFiles();
      this._initModel();
      this.removed = [];
      this.url = "about:blank";
    },

    _isImage(file){
      const type = file.type
      return type && type.indexOf('image/') > -1
    },
    _onDropzoneFileAdded(file) {
      const dropzone = this.$refs.dropzone;
      if (!this._isImage(file)) {
        dropzone.setThumbnail(file, this.modelType.iconUrl(file.name, file.type))
      }
      for (let download of file.previewElement.querySelectorAll('[data-dz-download]')) {
        download.href = file.download
      }
    },
    _onDropzoneSuccess(file, response) {
      // TODO: 확인 필요
      file.id = response.id
      file.download = response.download
      for (let download of file.previewElement.querySelectorAll('[data-dz-download]')) {
        download.href = file.download
      }
    },
    _onDropzoneRemovedFile(file) {
      if (file.status === 'success') {
        this.removed.push(file)
      }
    },

    _addFiles(files) {
      const dropzone = this.$refs.dropzone;
      files.forEach((file) => {
        dropzone.addEstablishedFile({
          id: file.id,
          name: file.name,
          size: file.size,
          path: file.download,
          thumbnail: file.thumbnail,
          download: file.download,
          type: file.contentType,
          status: 'success',
          processing: true
        })
      })
    },

    _hasChanged() {
      const dropzone = this.$refs.dropzone
      const queued = dropzone.getFiles().filter((file) => file.status === 'queued').length > 0;
      return queued || this.removed.length
    },

    _uploadFiles() {
      const dropzone = this.$refs.dropzone;
      this.url = this.model.uploadUrl;
      this.headers = this.model.headers;
      return new Promise((resolve, reject) => {
        const processHandler = (file) => {
          if(file){
            this.model.addFile(
              new AttachmentFileModel.Builder(this)
              .id(file.id)
              .name(file.name)
              .size(file.size)
              .type(file.type)
              .build()
            )
          }
          if (dropzone.getQueuedFiles().length) {
            dropzone.$once('vdropzone-complete', processHandler)
            dropzone.processQueue();
          }
          else {
            resolve()
          }
        }
        setTimeout(processHandler, 1)
      })
    },

    async _removeFiles(){
      return await Promise.all(
         this.removed
         .map((file) => file.id)
         .map((id) => this.model.removeFile(id))
      );
    },

    async save() {
      let value;
      if(this._hasChanged()){
        if(!this.value){
          value = await this.model.create();
        }
        await Promise.all([this._removeFiles(), this._uploadFiles()]);
        this.$emit('input', value);
      }
      return value;
    }

  }
}

</script>
