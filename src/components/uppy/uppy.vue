<template>
  <div ref="container" :class="[readonly ? 'uppy-readonly': '']">
    <q-resize-observable @resize="_onResize"/>
  </div>
</template>

<script>
  import 'uppy/dist/uppy.css'
  import * as _ from 'lodash'
  import Uppy from 'uppy/lib/core'
  import Dashboard from 'uppy/lib/plugins/Dashboard'
  import XHRUpload from 'uppy/lib/plugins/XHRUpload'
  import Webcam from 'uppy/lib/plugins/Webcam'
  import I18n from 'src/i18n/uppy'

  const uppyPlugins = {
    Dashboard: Dashboard,
    XHRUpload: XHRUpload,
    Webcam: Webcam
  }

  const uppyDefaultOptions = {
    Dashboard: {
      locale: _.defaultsDeep({}, I18n.Dashboard, I18n.DragDrop, I18n.StatusBar),
      inline: true
    },
    XHRUpload: {},
    Webcam: {
      locale: I18n.Webcam
    }
  }

  const uppyEvents = {
    'file-added': ['file'],
    'file-removed': ['file'],
    'upload': [],
    'upload-progress': ['data'],
    'upload-success': ['fileId', 'response', 'uploadURL'],
    'complete': ['result']
  }

  const uppyMethods = [
    'getID',
    'addFile',
    'getFile',
    'setState',
    'getState',
    'setFileState',
    'setMeta',
    'setFileMeta',
    'getPlugin',
    'reset',
    'log',
    'info',
    'upload'
  ]

  const methods = {}
  uppyMethods.forEach((name) => {
    methods[name] = function () {
      return this.uppy[name].apply(this.uppy, arguments)
    }
  })

  export default {

    props: {
      autoProceed: {
        type: Boolean,
        default: true,
      },
      plugins: {
        type: Object,
        default: () => {
          return {}
        }
      },
      restrictions: {
        type: Object,
        default: () => {
          return {
            maxFileSize: false,
            maxNumberOfFiles: false,
            minNumberOfFiles: false,
            allowedFileTypes: false
          }
        }
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },

    watch: {},

    created () {
      this._createUppy()
    },

    mounted () {
      this._runUppy()
    },

    beforeDestroy () {
      this._destroyUppy()
    },

    methods: {
      ...methods,
      _createUppy () {
        const vm = this
        const uppy = new Uppy({
          debug: false,
          autoProceed: this.autoProceed,
          restrictions: this.restrictions,
          locale: I18n.Uppy,
          onBeforeFileAdded: async (file, files) => {
            vm.$emit('before-file-added', {
              file: file,
              files: files
            })
          },
          onBeforeUpload: async (files) => {
            vm.$emit('before-upload', {
              files: files
            })
          }
        })
        this.uppy = uppy
        _.forIn(uppyEvents, (argumentNames, eventName) => {
          uppy.on(eventName, function () {
            const event = {}
            const args = arguments
            argumentNames.forEach((argumentName, index) => {
              event[argumentName] = args[index]
            })
            vm.$emit(eventName, event)
          })
        })
      },
      _runUppy () {
        const uppy = this.uppy
        const plugins = this.getPlugins()
        _.keys(uppyPlugins)
        .filter((name) => plugins[name])
        .forEach((name) => {
          uppy.use(uppyPlugins[name], plugins[name])
        })
        uppy.run()
      },
      _onResize () {
        // FIX: Dashboard 의 isWide 속성을 변경(사이즈 문제)
        const uppy = this.uppy
        const dashboard = uppy.getPlugin('Dashboard')
        if (dashboard && dashboard.updateDashboardElWidth) {
          dashboard.updateDashboardElWidth()
        }
      },
      _destroyUppy () {
        this.uppy.close()
        this.uppy = null
      },
      getPlugins () {
        uppyDefaultOptions.Dashboard.target = this.$refs.container
        _.keys(this.plugins).forEach((name) => {
          uppyDefaultOptions[name] = uppyDefaultOptions[name] || {}
          uppyDefaultOptions[name].target = uppyDefaultOptions[name].target || Dashboard
        })
        return _.defaultsDeep(_.assign({}, this.plugins), uppyDefaultOptions)
      },
      getFileState (id) {
        return this.uppy.getState().files[id]
      },
      removeAllFiles () {
        _.keys(this.uppy.getState().files).forEach((id) => {
          this.uppy.removeFile(id)
        })
      }
    }

  }

</script>

<style lang="stylus">

  .uppy-DashboardItem-preview
    img
      object-fit: contain;

  .uppy-readonly
    .uppy-DashboardTabs
      display: none
    .uppy-Dashboard-files--noFiles
      display: none
    .uppy-DashboardItem-remove
      display: none
    .uppy-DashboardItem-edit
      display: none

  @media only screen and (min-width: 768px)
    .uppy-Dashboard-inner
      width: initial

</style>
