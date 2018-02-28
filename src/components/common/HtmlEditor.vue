<template>
  <textarea ref="textarea"></textarea>
</template>

<script>
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

  class Adapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      const file = this.loader.file;
      if (file.type && file.type.indexOf('image/') > -1) {
        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.onload = (event) => {
            resolve({
              default: reader.result
            });
          };
          reader.onerror = (event) => {
            reject(event);
          };
          reader.readAsDataURL(this.loader.file);
        });
      }
      return Promise.reject();
    }

    async abort() {
    }
  }

  export default {
    props: {
      value: {
        type: String
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    components: {},
    mounted() {
      this.model = this.value;
      this._initEditor();
    },
    beforeDestroy() {
      this.editor.destroy()
      .then(() => {
        this.editor = null;
      })
      .catch(error => {
        console.error(error);
      });
    },
    data() {
      return {
        model: null
      };
    },
    watch: {
      value(value) {
        if (value !== this.model) {
          this.model = value;
          this.editor.setData(value);
        }
      },
      readonly(readonly) {
        this.editor.isReadOnly = readonly;
      }
    },
    methods: {
      async _createEditor(){
        return ClassicEditor.create(this.$refs.textarea, {
          image: {
            toolbar: ['imageTextAlternative', '|', 'imageStyleAlignLeft', 'imageStyleFull',
              'imageStyleAlignRight'],
            styles: ['imageStyleFull', 'imageStyleAlignLeft', 'imageStyleAlignRight']
          },
          toolbar: [
            'headings', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList',
            '|', 'undo', 'redo'
          ]
        });
      },
      async _initEditor() {
        const editor = await this._createEditor();
        editor.plugins.get('FileRepository').createAdapter = function (loader) {
          return new Adapter(loader);
        };
        editor.isReadOnly = this.readonly;
        editor.setData(this.model);
        editor.document.on('change', () => {
          this.model = editor.getData()
          this.$emit('input', this.model);
        });
        this.editor = editor;
      }
    }

  }

</script>
<style>
  .ck-editor .ck-editor__editable {
    min-height: 300px;
  }

</style>
