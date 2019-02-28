<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        송장(입고 예정)
        <span slot="right" v-if="!!model.code">
          {{statusLabel}} - {{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="송장을 송신한 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <c-autocomplete-select float-label="발송사" v-model="model.senderId"
                                 :label="senderModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-building" helper="송장을 수신한 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <c-autocomplete-select float-label="인수사" v-model="model.receiverId"
                                 :label="receiverModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-calendar" helper="입고 예정일시 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-datetime float-label="입고예정일시" v-model="model.dueDate"
                      readonly hide-underline
                      type="datetime"/>
        </q-field>

        <q-field icon="description" helper="비고 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :count="50">
          <q-input type="textarea" v-model="model.remark" float-label="비고"
                   rows="4"
                   readonly hide-underline
                   max-length="50"/>
        </q-field>

        <q-field icon="fas fa-map-marker" helper="인수지의 주소입니다"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-4">
          <c-address-input v-model="model.receiveAddress" readonly hide-underline/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        송장 품목
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 stop-editing-when-grid-loses-focus
                 suppress-no-rows-overlay
                 :row-data="itemArray">

          <ag-grid-column field="item.code" header-name="품목 코드" :width="100"/>
          <ag-grid-column field="item.name" header-name="품목 이름" :width="250"/>
          <ag-grid-column field="itemSpecCode" header-name="LOT" :width="100"/>
          <ag-grid-column field="quantity" header-name="수량" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"
          />
          <ag-grid-column field="unit" header-name="단위" :width="80"
                          :cell-style="{textAlign: 'center'}"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:unitLabelArray, valueField:'value', labelField: 'label'}"/>
          <ag-grid-column field="remark" header-name="비고" :width="200"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat icon="done" @click="onReceive()" label="인수완료"
               v-if="receivable"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {InvoiceItemArray, InvoiceModel, InvoiceStatusArray,} from 'src/model/invoice'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
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
        model: new InvoiceModel(),
        itemArray: new InvoiceItemArray(),
        receiverModel: new CompanyModel(),
        senderModel: new CompanyModel(),
        companyLabelArray: new CompanyLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new InvoiceStatusArray()
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.statusLabelArray.fetch(),
        this.companyLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {

      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },

      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await InvoiceModel.get(id)
        const itemArray = new InvoiceItemArray(model)
        await itemArray.fetch()
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

      async onReceive() {
        const validReceive = await this.model.validateReceive()
        if (validReceive) {
          const ok = await this.$alert.confirm('인수를 완료 하시겠습니까?')
          if (ok) {
            await this.model.receive()
            this.$emit('changed')
            this.$alert.positive('인수 완료 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.receive)
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
      receivable() {
        return this.model.receivable
      },
      statusLabel() {
        const status = this.model.status
        const found = this.statusLabelArray.find(e => e.value == status) || {}
        return found.label || ''
      }
    },
    watch: {
      'model.senderId': async function (to) {
        this.senderModel = await CompanyModel.get(to, true)
      },
      'model.receiverId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
      }
    },
    components: {
      CommentList
    }
  }
</script>
