<template>
  <textarea></textarea>
</template>

<script>
  import $ from 'jquery';
  import {language, languageAliases} from 'src/i18n'


  class Adapter {
    constructor(loader) {
      this.loader = loader
    }

    upload() {
      const file = this.loader.file
      if (file.type && file.type.indexOf('image/') > -1) {
        return new Promise((resolve, reject) => {
          var reader = new FileReader()
          reader.onload = (event) => {
            resolve({
              default: reader.result
            })
          }
          reader.onerror = (event) => {
            reject(event)
          }
          reader.readAsDataURL(this.loader.file)
        })
      }
      return Promise.reject()
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
      this.model = this.value
      this._initEditor()
    },
    beforeDestroy() {
      if (this.$el) {
        $(this.$el).trumbowyg('destroy')
      }
    },
    data() {
      return {
        model: null
      }
    },
    watch: {
      value(value) {
        if (value !== this.model) {
          this.model = value
          if (this.$el) {
            $(this.$el).trumbowyg('html', value)
          }
        }
      },
      readonly(value) {
        const el = $(this.$el)
        el.trumbowyg(
            value ? 'disable' : 'enable'
        )
      }
    },
    methods: {
      _onTrumbowygChange(event) {
        this.model = event.target.value
        this.$emit('input', this.model)
      },
      async _initEditor() {
        const el = $(this.$el)
        el.trumbowyg({
          btns: [
            ['table'],
            ['undo', 'redo'],
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['fullscreen']
          ],
          imageWidthModalEdit: true,
          disabled: this.readonly,
          lang: languageAliases({
            ko: 'ko'
          })[language],
          plugins: {
            table: {
              rows: 7,
              columns: 7
            }
          }
        })
        el.trumbowyg('html', this.model);
        el.on(`tbwchange`, this._onTrumbowygChange);
        el.on(`tbwpaste`, this._onTrumbowygChange);
      }
    }

  }

</script>