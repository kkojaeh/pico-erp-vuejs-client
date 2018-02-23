<template>
<form :action="url" class="vue-dropzone dropzone" ref="dropzoneForm">
  <div ref="template" v-show="false">
    <slot>
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
    </slot>
  </div>
</form>

</template>

<script>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
import * as _ from 'lodash';
import qs from 'qs'

export default {
  props: {
    url: {
      type: String,
      required: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    acceptedFileTypes: {
      type: String
    },
    thumbnailHeight: {
      type: Number,
      default: 200
    },
    thumbnailWidth: {
      type: Number,
      default: 200
    },
    showRemoveLink: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 2
    },
    maxNumberOfFiles: {
      type: Number,
      default: 5
    },
    parallelUploads: {
      type: Number,
      default: 1
    },
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    useFontAwesome: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Object
    },
    language: {
      type: Object,
      default: function () {
        return {
          dictDefaultMessage: '<br>Drop files here to upload',
          dictCancelUpload: 'Cancel upload',
          dictCancelUploadConfirmation: 'Are you sure you want to cancel this upload?',
          dictFallbackMessage: 'Your browser does not support drag and drop file uploads.',
          dictFallbackText: 'Please use the fallback form below to upload your files like in the olden days.',
          dictFileTooBig: 'File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.',
          dictInvalidFileType: `You can't upload files of this type.`,
          dictMaxFilesExceeded: 'You can not upload any more files. (max: {{maxFiles}})',
          dictRemoveFile: null,
          dictRemoveFileConfirmation: null,
          dictResponseError: 'Server responded with {{statusCode}} code.'
        }
      }
    },
    useCustomDropzoneOptions: {
      type: Boolean,
      default: false
    },
    dropzoneOptions: {
      type: Object
    },
    paramName: {
      type: String,
      default: 'file'
    }
  },
  methods: {
    setOption(option, value) {
      this.dropzone.options[option] = value
    },
    removeAllFiles() {
      this.dropzone.removeAllFiles(true)
    },
    processQueue() {
      this.dropzone.processQueue()
    },
    removeFile(file) {
      this.dropzone.removeFile(file)
    },
    getAcceptedFiles() {
      return this.dropzone.getAcceptedFiles()
    },
    getRejectedFiles() {
      return this.dropzone.getRejectedFiles()
    },
    getQueuedFiles() {
      return this.dropzone.getQueuedFiles()
    },
    getUploadingFiles() {
      return this.dropzone.getUploadingFiles()
    },
    getFiles() {
      return this.dropzone.files
    },
    addEstablishedFile(file) {
      this.dropzone.emit('addedfile', file)
      if (file.thumbnail) {
        let thumbnail = file.thumbnail
        thumbnail += _.includes(thumbnail, '?') ? '&' : '?'
        thumbnail += qs.stringify({
          width: this.thumbnailWidth,
          height: this.thumbnailHeight
        }, {
          arrayFormat: 'repeat'
        })
        this.dropzone.emit('thumbnail', file, thumbnail)
        this.dropzone.emit('complete', file)
      }
    },
    setThumbnail(file, url) {
      url += _.includes(url, '?') ? '&' : '?'
      url += qs.stringify({
        width: this.thumbnailWidth,
        height: this.thumbnailHeight
      }, {
        arrayFormat: 'repeat'
      })
      this.dropzone.emit('thumbnail', file, url)
    },
    processTemplate(template) {
      return template.replace(/\${(\w+)\}/g, (m, i) => {
        return this[i]
      })
    }
  },
  computed: {
    cloudIcon() {
      if (this.useFontAwesome) {
        return '<i class="fa fa-cloud-upload"></i>'
      }
      else {
        return '<i class="material-icons">cloud_upload</i>'
      }
    },
    doneIcon() {
      if (this.useFontAwesome) {
        return '<i class="fa fa-check"></i>'
      }
      else {
        return ' <i class="material-icons">done</i>'
      }
    },
    errorIcon() {
      if (this.useFontAwesome) {
        return '<i class="fa fa-close"></i>'
      }
      else {
        return ' <i class="material-icons">error</i>'
      }
    },
    downloadIcon() {
      if (this.useFontAwesome) {
        return '<i class="fa fa-download"></i>'
      }
      else {
        return ' <i class="material-icons">download</i>'
      }
    },
    removeIcon() {
      if (this.useFontAwesome) {
        return '<i class="fa fa-trash"></i>'
      }
      else {
        return ' <i class="material-icons">remove</i>'
      }
    }
  },
  watch: {
    url(to, from) {
      this.setOption('url', to)
    },
    headers(to, from) {
      this.setOption('headers', to)
    }
  },
  mounted() {
    if (this.$isServer) {
      return
    }
    Dropzone.autoDiscover = false
    let element = this.$refs.dropzoneForm
    var templateElement = this.$refs.template.querySelector('script[type=text\\/preview-template]')
    let previewTemplate = this.processTemplate(templateElement.innerHTML)

    if (!this.useCustomDropzoneOptions) {
      this.dropzone = new Dropzone(element, {
        clickable: this.clickable,
        thumbnailWidth: this.thumbnailWidth,
        thumbnailHeight: this.thumbnailHeight,
        maxFiles: this.maxNumberOfFiles,
        maxFilesize: this.maxFileSize,
        addRemoveLinks: this.showRemoveLink,
        acceptedFiles: this.acceptedFileTypes,
        autoProcessQueue: this.autoProcessQueue,
        headers: this.headers,
        previewTemplate: previewTemplate,
        dictDefaultMessage: this.cloudIcon + this.language.dictDefaultMessage,
        dictCancelUpload: this.language.dictCancelUpload,
        dictCancelUploadConfirmation: this.language.dictCancelUploadConfirmation,
        dictFallbackMessage: this.language.dictFallbackMessage,
        dictFallbackText: this.language.dictFallbackText,
        dictFileTooBig: this.language.dictFileTooBig,
        dictInvalidFileType: this.language.dictInvalidFileType,
        dictMaxFilesExceeded: this.language.dictMaxFilesExceeded,
        dictRemoveFile: this.language.dictRemoveFile,
        dictRemoveFileConfirmation: this.language.dictRemoveFileConfirmation,
        dictResponseError: this.language.dictResponseError,
        parallelUploads: this.parallelUploads
      })
    }
    else {
      this.dropzone = new Dropzone(element, this.dropzoneOptions)
    }
    // Handle the dropzone events
    var vm = this
    this.dropzone.on('thumbnail', (file) => {
      vm.$emit('vdropzone-thumbnail', file)
    })
    this.dropzone.on('addedfile', (file) => {
      if (vm.showRemoveLink) {
        file._removeLink.innerHTML = vm.removeIcon
      }
      vm.$emit('vdropzone-file-added', file)
    })
    this.dropzone.on('complete', (file) => {
      if (vm.showRemoveLink) {
        file._removeLink.innerHTML = vm.removeIcon
      }
      vm.$emit('vdropzone-complete', file)
    })

    this.dropzone.on('removedfile', (file) => {
      vm.$emit('vdropzone-removed-file', file)
    })

    this.dropzone.on('success', (file, response) => {
      vm.$emit('vdropzone-success', file, response)
    })

    this.dropzone.on('successmultiple', (file, response) => {
      vm.$emit('vdropzone-success-multiple', file, response)
    })

    this.dropzone.on('error', (file, error, xhr) => {
      vm.$emit('vdropzone-error', file, error, xhr)
    })

    this.dropzone.on('sending', (file, xhr, formData) => {
      vm.$emit('vdropzone-sending', file, xhr, formData)
    })

    this.dropzone.on('sendingmultiple', (file, xhr, formData) => {
      vm.$emit('vdropzone-sending-multiple', file, xhr, formData)
    })

    this.dropzone.on('queuecomplete', (file, xhr, formData) => {
      vm.$emit('vdropzone-queue-complete', file, xhr, formData)
    })
  }
}

</script>

<style lang="styl">

  .dropzone
    .dz-preview.dz-complete
      .dz-download
        display: inherit;

  .vue-dropzone
    border: 2px solid #E5E5E5;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.2px;
    color: #777;
    transition: background-color .2s linear;
    &:hover
      background-color: #F6F6F6;
    i
      color: #CCC;

    .dz-preview
      .dz-image
        border-radius: 0px;
        &:hover
          img
            transform: none;
            -webkit-filter: none;
      .dz-details
        bottom: 0px;
        top: 0px;
        color: white;
        padding: 1em 1em !important;
        background-color: rgba(33, 150, 243, 0.8);
        transition: opacity .2s linear;
        text-align: left;
        .dz-filename span, .dz-size span
          background-color: transparent;

        .dz-filename:not(:hover) span
          border: none;

        .dz-filename:hover span
          background-color: transparent;
          border: none;

      .dz-progress
        top: calc(100% - 5px);
        width: 120px;
        height: 5px;
        border-radius: 0px;
        margin-left: -60px;
        .dz-upload
          background: #cccccc;

      .dz-remove
        position: absolute;
        z-index: 30;
        color: white;
        padding: 5px 8px;
        bottom: 10px;
        left: 15px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 1.1px;
        opacity: 0;
        cursor: pointer;
        > *
          cursor: pointer;

      .dz-download
        position: absolute;
        z-index: 30;
        color: white;
        right: 15px;
        padding: 5px 8px;
        bottom: 10px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 1.1px;
        opacity: 0;
        display: none;
        cursor: pointer;
        > *
          cursor: pointer;

      &:hover
        .dz-remove
          opacity: 1;
          border: 2px white solid;

      &:hover
        .dz-download
          opacity: 1;
          border: 2px white solid;

      .dz-success-mark, .dz-error-mark
        margin-left: auto!important;
        margin-top: auto!important;
        width: 100%!important;
        top: 35%!important;
        left: 0;
        i
          color: white!important;
          font-size: 5rem!important;
</style>
