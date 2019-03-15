<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        발주 송장(입고 예정)
        <span slot="right" v-if="!!model.code">{{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-calendar" helper="입고일시를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="입고일시" v-model="model.dueDate"
                      :readonly="!updatable" :hide-underline="!updatable"
                      type="datetime"/>
        </q-field>

        <q-field icon="check" helper="발주의 상태 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="상태" v-model="model.status" readonly hide-underline
                    :options="statusLabelArray"></q-select>
        </q-field>

        <q-field icon="description" helper="비고 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.remark"
                 :error-label="model.$errors.remark"
                 :count="50">
          <q-input type="textarea" v-model="model.remark" float-label="비고"
                   rows="4"
                   :readonly="!updatable" :hide-underline="!updatable"
                   max-length="50"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        외주 입고 품목
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 :editable="updatable"
                 stop-editing-when-grid-loses-focus
                 suppress-no-rows-overlay
                 :row-data="itemArray">

          <ag-grid-column field="orderItem.item.code" header-name="품목 코드" :width="100"/>
          <ag-grid-column field="orderItem.item.name" header-name="품목 이름" :width="200"/>
          <ag-grid-column field="orderItem.itemSpec.summary" header-name="스펙" :width="160"/>
          <ag-grid-column field="orderItem.quantity" header-name="수량" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"/>
          <ag-grid-column field="orderItem.spareQuantity" header-name="예비수량" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"/>
          <ag-grid-column field="orderItem.receivedQuantity" header-name="받은수량" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"/>
          <ag-grid-column field="quantity" header-name="입고수량" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"
                          :editable="updatable"/>
          <ag-grid-column field="orderItem.outsourcingUnit" header-name="단위" :width="80"
                          :cell-style="{textAlign: 'center'}"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
          <ag-grid-column field="remark" header-name="비고" :width="200"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"
                          :editable="updatable"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="done" @click="onDetermine()" label="발행"
               v-if="determinable"></q-btn>
        <q-btn flat icon="cancel" @click="onCancel()" label="취소"
               v-if="cancelable"></q-btn>
        <q-btn flat icon="save" @click="onSave()" v-if="updatable" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {
    OutsourcingInvoiceItemArray,
    OutsourcingInvoiceModel,
    OutsourcingInvoiceStatusArray
  } from 'src/model/outsourcing-invoice'
  import CommentList from 'src/pages/comment/comment-list.vue'
  import {UnitLabelArray} from 'src/model/shared'

  export default {
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
        model: new OutsourcingInvoiceModel(),
        itemArray: new OutsourcingInvoiceItemArray(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new OutsourcingInvoiceStatusArray()
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.statusLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {

      async create() {
        this.model = new OutsourcingInvoiceModel()
        this.itemArray = new OutsourcingInvoiceItemArray(this.model)
        this.model.chargerId = this.user.id
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await OutsourcingInvoiceModel.get(id)
        const itemArray = new OutsourcingInvoiceItemArray(model)
        await itemArray.fetch()
        console.log(itemArray)
        this.model = model
        this.itemArray = itemArray
      },

      async closeOrReload() {
        if (this.closable && this.closeConfirmed) {
          this.$closeOverlay()
        } else {
          await this.load(this.id || this.model.id)
        }
      },
      async onSave() {
        let valid = ![
          await this.model.validate(),
          await this.itemArray.validate()
        ].includes(false)

        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$emit('changed')
            this.$alert.positive('저장 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
        }
      },
      async save() {
        await this.model.save()
        await this.itemArray.save()
      },

      async onDetermine() {
        let valid = ![
          await this.model.validate(),
          await this.itemArray.validate()
        ].includes(false)
        if (!valid) {
          this.$alert.warning('입력이 유효하지 않습니다')
          this.$redrawGrids()
          return
        }
        if (this.itemArray.length == 0) {
          this.$alert.warning('품목이 없습니다')
          return
        }
        const validDetermine = await this.model.validateDetermine()
        if (validDetermine) {
          const ok = await this.$alert.confirm('발주 송장을 발행 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.determine()
            this.$emit('changed')
            this.$alert.positive('발행 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.determine)
        }
      },

      async onCancel() {
        const validCancel = await this.model.validateCancel()
        if (validCancel) {
          const ok = await this.$alert.confirm('발주 송장을 취소 하시겠습니까?')
          if (ok) {
            await this.model.cancel()
            this.$emit('changed')
            this.$alert.positive('취소 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.cancel)
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
      updatable() {
        return this.model.updatable
      },
      cancelable() {
        return this.model.cancelable
      },
      determinable() {
        return this.model.determinable
      }
    },
    watch: {},
    components: {
      CommentList
    }
  }
</script>
