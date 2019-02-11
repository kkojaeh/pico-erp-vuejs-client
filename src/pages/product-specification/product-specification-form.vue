<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat ref="container">

      <q-card-title>
        [{{item.code}}] {{item.name}}
        <span slot="right">
          Version. {{content.revision}} / {{statusLabel}}
        </span>
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-barcode" helper="바코드 번호 입니다"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-6">
          <q-input v-model="item.barcodeNumber" float-label="바코드 번호" class="ime-mode-disabled"
                   readonly hide-underline>
            <q-btn icon="content_copy" v-clipboard:copy="item.barcodeNumber" v-clipboard-notify
                   slot="after"
                   flat></q-btn>
          </q-input>
        </q-field>

        <q-field icon="fas fa-comment" helper="설명을 입력하세요"
                 class="col-xs-12 col-md-11 col-lg-11 col-xl-11"
                 orientation="vertical" label="설명"
                 v-show="editing"
                 :error="!!content.$errors.description"
                 :error-label="content.$errors.description">
          <c-html-editor v-model="content.description"></c-html-editor>
        </q-field>

        <q-field icon="fas fa-comment"
                 class="col-xs-12 col-md-11 col-lg-11 col-xl-11"
                 orientation="vertical" label="설명"
                 v-show="!editing">
          <div v-html="content.description"></div>
        </q-field>

        <div v-for="(process, index) in processes" ref="processes" :key="process.id"
             class="specification-process-editor-container col-xs-12 col-md-6 col-lg-6 col-xl-6"></div>

        <div v-if="(processes.length % 2) == 1"
             class="col-xs-12 col-md-6 col-lg-6 col-xl-6"></div>

        <q-field icon="attachment" helper="사진 관련 첨부파일 입니다" label="품목 사진"
                 orientation="vertical"
                 class="col-xs-12 col-md-6 col-xl-6">

          <c-attachment ref="imageAttachment" v-model="content.imageId"
                        category="product-specification-image"
                        :allowed-content-types="['image/*']"
                        multiple :readonly="!updatable"></c-attachment>
        </q-field>

        <q-field icon="attachment" helper="도면 관련 첨부파일 입니다" label="도면 파일"
                 orientation="vertical"
                 class="col-xs-12 col-md-6 col-xl-6">

          <c-attachment ref="bluePrintAttachment" v-model="content.bluePrintId"
                        :allowed-content-types="['image/*']"
                        category="product-specification-blue-print"
                        multiple :readonly="!updatable"></c-attachment>
        </q-field>

      </q-card-main>

      <div ref="renderer"></div>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="add" @click="onNewDraft()" label="새버전" v-if="draftable"></q-btn>
        <q-btn flat icon="edit" @click="onEdit()" label="수정" v-if="editable"
               v-show="!editing"></q-btn>
        <q-btn flat icon="print" @click="onPrint()" label="출력" v-if="!editing"></q-btn>
        <q-btn flat icon="done" @click="onCommit()" label="제출" v-if="committable"></q-btn>
        <q-btn flat icon="save" @click="onSave()" label="저장" v-if="updatable"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ItemModel} from 'src/model/item'
  import {
    ProductSpecificationContentModel,
    ProductSpecificationContentProcessArray,
    ProductSpecificationModel,
    ProductSpecificationStatusArray
  } from 'src/model/product-specification'
  import 'json-editor'
  import * as _ from 'lodash'
  import printRenderer from './print.mustache'

  export default {
    authorized: {
      'productSpecificationWriter': 'hasAnyRole(\'PRODUCT_SPECIFICATION_WRITER\', \'PRODUCT_SPECIFICATION_MANAGER\')'
    },
    props: {
      action: {
        type: String
      },
      id: {
        type: String
      },
      closable: {
        type: Boolean,
        default: false
      },
      closeConfirmed: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: new ProductSpecificationModel(),
        content: new ProductSpecificationContentModel(),
        item: new ItemModel(),
        processes: new ProductSpecificationContentProcessArray(),
        statuses: new ProductSpecificationStatusArray(),
        editors: [],
        editing: false
      }
    },
    async mounted() {
      await Promise.all([
        this.statuses.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    beforeDestroy() {
      this.clearEditors()
    },
    methods: {

      async show() {
        await this.load(this.id)
      },

      clearEditors() {
        while (this.editors.length) {
          const editor = this.editors.pop()
          editor.destroy()
        }
      },

      async load(id) {
        this.clearEditors()
        this.model = await ProductSpecificationModel.get(id)
        this.content = await ProductSpecificationContentModel.get(this.model.contentId)
        this.item = await ItemModel.get(this.model.itemId, true)
        this.processes = new ProductSpecificationContentProcessArray(this.content)
        await this.processes.fetch()
        const refs = this.$refs.processes
        this.processes.forEach((process, index) => {
          const ref = refs[index]
          const editor = new JSONEditor(ref, {
            schema: process.processInfoType.getMetadata(),
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
          editor.process = process
          editor.setValue(process.processInfo)
          this.editors.push(editor)
        })
        this.applyEditors()
      },

      applyEditors() {
        const editing = this.editing
        if (editing) {
          this.editors.forEach(editor => {
            editor.enable()
            _.forEach(editor.element.querySelectorAll("input,textarea"), (e) => {
              e.removeAttribute('readonly')
            })
          })
        } else {
          this.editors.forEach(editor => {
            editor.disable()
            _.forEach(editor.element.querySelectorAll("input,textarea"), (e) => {
              e.removeAttribute('disabled')
              e.setAttribute('readonly', true)
            })
          })
        }
      },

      async reload() {
        await this.load(this.id || this.model.id)
      },

      async onCommit() {
        const valid = await this.model.validate()
        if (!valid) {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
        const validCommit = await this.model.validateCommit()
        if (validCommit) {
          const ok = await this.$alert.confirm('사양서를 제출 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.commit()
            this.$alert.positive('제출 되었습니다')
            await this.reload()
            this.editing = false
          }
        } else {
          this.$alert.warning(this.model.$errors.commit)
        }
      },

      async onSave() {
        const valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            await this.reload()
            this.editing = false
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },

      onEdit() {
        this.editing = true
      },

      onPrint() {
        const data = {
          code: this.item.code,
          name: this.item.name,
          barcodeNumber: this.item.barcodeNumber,
          description: this.content.description
        }
        data.processes = this.editors.map((editor, index) => {
          const o = {
            order: index + 1,
            name: editor.editors.root.header.innerText,
          }
          const properties = []
          const orders = editor.editors.root.property_order
          _.forEach(editor.editors, (e, key) => {
            if (key == 'root') {
              return
            }
            properties.push({
              key: e.key,
              name: e.header.innerText,
              order: orders.indexOf(e.key),
              value: e.value
            })
          })

          o.properties = _.sortBy(properties, ['order'])
          return o

        })
        data.images = this.$refs.imageAttachment.getFiles().map(file => {
          return {
            name: file.name,
            url: file.download
          }
        })
        data.bluePrints = this.$refs.bluePrintAttachment.getFiles().map(file => {
          return {
            name: file.name,
            url: file.download
          }
        })
        const width = (595 / 1.4) * window.devicePixelRatio
        const height = (842 / 1.4) * window.devicePixelRatio

        const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        const dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

        const left = (width / 2) + dualScreenLeft;
        const top = (height / 2) + dualScreenTop;

        const options = `width=${width},height=${height},top=${top},left=${left},toolbars=no,scrollbars=no,status=no,resizable=no`

        const w = window.open('', "spcification-print", options);
        w.document.writeln(printRenderer(data))
        w.document.close();
        w.focus();
        setTimeout(() => {
          w.print();
          w.close();
        }, 2000)
      },

      async save() {
        this.editors.forEach(editor => {
          _.assign(editor.process.processInfo, editor.getValue())
        })
        await Promise.all([
          await this.$refs.imageAttachment.save(),
          await this.$refs.bluePrintAttachment.save(),
        ])
        await Promise.all([
          await this.content.save(),
          await this.processes.save()
        ])
      },

      async onNewDraft() {
        const ok = await this.$alert.confirm('새 버전을 생성 하시겠습니까?')
        if (ok) {
          await this.model.nextDrft()
          await this.$await(1000)
          this.$alert.positive('새버전이 생성 되었습니다')
          await this.reload()
        }
      }

    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      }),
      phantom() {
        return this.model.phantom
      },
      committable() {
        return this.editing && this.model.committable
      },
      draftable() {
        return this.$authorized.productSpecificationWriter && this.model.draftable
      },

      updatable() {
        return this.editing && this.content.updatable
      },

      editable() {
        return this.$authorized.productSpecificationWriter && this.content.updatable
      },

      statusLabel() {
        const status = this.model.status
        const found = this.statuses.find(e => e.value == status) || {}
        return found.label || ''
      }
    },
    watch: {
      editing(value) {
        this.$nextTick(this.applyEditors)
      }
    },
    components: {}
  }
</script>
<style lang="stylus">
  .specification-process-editor-container
    p
      display: none
    .row
      margin-bottom: 20px
      > div
        width: 100%
    .form-control
      label
        font-weight: normal !important
      width: 100%
      *
        width: 100%
      input
        border-top: none
        border-left: none
        border-right: none
        padding: 5px
      input[type="number"]
        text-align: right
      input:focus
        outline: none
        border-bottom-color: #027be3
      textarea
        padding: 5px
        border-width: 2px
        border-style: inset
        border-color: rgb(238, 238, 238)
        border-top: none
        border-left: none
        border-right: none
        height: 100px !important
      textarea:focus
        outline: none
        border-bottom-color: #027be3

    h3
      display: block
      font-size: 1.17em
      margin-top: 3px
      margin-bottom: 3px
      margin-left: 10px
      margin-right: 0
      line-height 20px
      font-weight: bold
</style>