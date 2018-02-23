<template>
  <div>
    <div class="container"></div>
  </div>

</template>

<script>
  import * as _ from 'lodash';
  import qs from 'qs'
  import Uppy from 'uppy/lib/core'
  import Dashboard from 'uppy/lib/plugins/Dashboard'
  import XHRUpload from 'uppy/lib/plugins/XHRUpload'
  import Webcam from 'uppy/lib/plugins/Webcam'

  const uppyPlugins = {
    Dashboard: Dashboard,
    XHRUpload: XHRUpload,
    Webcam: Webcam
  };

  const uppyEvents = {
    'file-added': ['file'],
    'file-removed': ['file'],
    'upload': [],
    'upload-progress': ['data'],
    'upload-success': ['fileId', 'response', 'uploadURL'],
    'complete': ['result']
  };

  const uppyMethods = [
    'getID',
    'addFile',
    'getFile',
    'setState',
    'getState',
    'setMeta',
    'setFileMeta',
    'reset',
    'log',
    'info',
    'upload'
  ];

  const methods = {};
  uppyMethods.forEach((name) => {
    methods[name] = function () {
      return this.uppy[name].apply(this.uppy, arguments);
    }
  });

  export default {

    props: {
      autoProceed: {
        type: Boolean,
        default: true,
      },
      options: {
        type: Object,
        default: () => {
        }
      },
      restrictions: {
        type: Object
      }
    },

    beforeCreate() {
      const vm = this;
      const uppy = new Uppy({
        debug: true,
        autoProceed: this.autoProceed,
        restrictions: this.restrictions
      });
      this.uppy = uppy;
      _.forIn(uppyEvents, (argumentNames, eventName) => {
        uppy.on(eventName, () => {
          const event = {};
          const args = arguments;
          argumentNames.forEach((argumentName, index) => {
            event[argumentName] = args[index];
          });
          vm.$emit(eventName, event);
        });
      });
    },

    mounted() {
      const uppy = this.uppy;
      const options = this.options;
      _.keys(uppyPlugins)
      .filter((name) => options[name])
      .forEach((name) => {
        uppy.use(uppyPlugins[name], options[name]);
      });
      uppy.run();
    },

    beforeDestroy() {
      this.uppy.close();
      this.uppy = null;
    },

    methods: {
      ...methods
    }

  }

</script>

<style>


</style>
