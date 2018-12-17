<template>

  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        품목 스펙 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">
        <div ref="editorContainer"
             class="json-schema-editor-container col-xs-12 col-md-8 col-xl-8"></div>
      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>

        <q-btn flat v-show="modifiable" icon="save" @click="onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>


  </q-page>

</template>
<script>
  import {ItemModel, ItemSpecModel, ItemSpecTypeModel} from 'src/model/item'
  import 'json-editor'
  import * as _ from 'lodash'

  export default {
    props: {
      itemId: {
        type: String
      },
      id: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      },
      editable: {
        type: Boolean,
        default: true
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    authorized: {
      'itemManager': 'hasRole(\'ITEM_MANAGER\')',
      'bomManager': 'hasRole(\'BOM_MANAGER\')'
    },
    data() {
      return {
        model: new ItemModel(),
        metadata: {}
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    beforeDestroy() {
      if (this.editor) {
        this.editor.destroy()
        this.editor = null
      }
    },
    methods: {
      initEditor() {
        if (this.editor) {
          this.editor.destroy()
        }
        this.editor = new JSONEditor(this.$refs.editorContainer, {
          schema: this.metadata,
          theme: 'html',
          iconlib: 'fontawesome4',
          disable_array_add: true,
          disable_array_delete: true,
          disable_array_reorder: true,
          disable_collapse: true,
          disable_edit_json: true,
          disable_properties: true,
          show_errors: 'always',
          no_additional_properties: true
        })
        this.editor.setValue(this.model.variables)
        if (this.modifiable) {
          this.editor.enable();
        } else {
          this.editor.disable();
        }
      },
      async create() {
        const item = await ItemModel.get(this.itemId)
        const specTypeId = item.specTypeId
        const specType = await ItemSpecTypeModel.get(specTypeId)
        this.metadata = specType.getMetadata()
        this.model = await ItemSpecModel.create(this.itemId)
        this.initEditor()
      },
      async show() {
        this.model = await ItemSpecModel.get(this.id)
        const item = await ItemModel.get(this.model.itemId)
        const specTypeId = item.specTypeId
        const specType = await ItemSpecTypeModel.get(specTypeId)
        this.metadata = specType.getMetadata()
        this.initEditor()
      },
      async onSaveClick() {
        let errors = this.editor.validate()
        if (!errors.length) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable && !this.closeConfirmed) {
              const close = await this.$alert.confirm('화면을 닫으시겠습니까?')
              if (close) {
                this.$closeOverlay()
              }
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save() {
        this.model.variables = _.defaultsDeep(this.editor.getValue(), this.model.variables)
        await this.model.save()
        this.$emit('saved', this.model)
      }
    },
    computed: {
      modifiable() {
        return this.editable && !this.model.locked
      }
    },
    components: {}
  }
</script>
<style lang="stylus">

  .json-schema-editor-container
    .row
      margin-bottom: 20px
      > div
        width: 100%
    .form-control
      width: 100%
      *
        width: 100%
      input
        border-top: none
        border-left: none
        border-right: none
      input[type="number"]
        text-align: right

    h3
      display: block
      font-size: 1.17em
      margin-top: 1em
      margin-bottom: 1em
      margin-left: 0
      margin-right: 0
      font-weight: bold

</style>
