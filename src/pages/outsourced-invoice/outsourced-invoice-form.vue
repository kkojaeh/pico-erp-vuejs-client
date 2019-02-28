<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        고객 송장(입고 예정)
        <span slot="right" v-if="!!invoiceModel.code">
          {{statusLabel}} - {{invoiceModel.code}}
          <q-btn icon="content_copy" v-clipboard:copy="invoiceModel.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="프로젝트를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.projectId" :error-label="model.$errors.projectId">

          <c-autocomplete-select float-label="프로젝트" v-model="model.projectId"
                                 :label="projectModel.name" :options="projectLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onProjectSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-building" helper="고객 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.senderId" :error-label="model.$errors.senderId">
          <c-autocomplete-select float-label="고객사" v-model="model.senderId"
                                 :label="senderModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 readonly hide-underline
                                 @search="onCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-building" helper="송장을 수신한 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiverId" :error-label="model.$errors.receiverId">
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
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="입고예정일시" v-model="model.dueDate"
                      :readonly="!updatable" :hide-underline="!updatable"
                      type="datetime"/>
        </q-field>

        <q-field icon="description" helper="비고 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.remark" :error-label="model.$errors.remark"
                 :count="50">
          <q-input type="textarea" v-model="model.remark" float-label="비고"
                   rows="4"
                   :readonly="!updatable" :hide-underline="!updatable"
                   max-length="50"/>
        </q-field>

        <q-field icon="fas fa-map-marker" helper="인수지의 주소입니다"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-4"
                 :error="!!model.$errors.receiveAddress.postalCode || !!model.$errors.receiveAddress.street || !!model.$errors.receiveAddress.detail"
                 :error-label="model.$errors.receiveAddress.postalCode || model.$errors.receiveAddress.street || model.$errors.receiveAddress.detail">
          <c-address-input v-model="model.receiveAddress" :readonly="!updatable"
                           :hide-underline="!updatable"
                           :after="[{ icon:'list', condition: updatable, handler:onSelectReceiverAddress}]"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        송장 품목
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddItem"
                 v-if="updatable" v-show="!determined"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" @click="onRemoveItem"
                 v-if="updatable" v-show="!determined"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 stop-editing-when-grid-loses-focus
                 suppress-no-rows-overlay
                 :editable="updatable"
                 :row-data="itemArray">
          <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"
                          :hide="!updatable || determined"/>
          <ag-grid-column field="item.code" header-name="품목 코드" :width="100"/>
          <ag-grid-column field="item.name" header-name="품목 이름" :width="250"/>
          <ag-grid-column field="quantity" header-name="수량" :width="120"
                          :cell-style="{textAlign: 'right'}" :editable="updatable"
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
  import {InvoiceModel} from 'src/model/invoice'
  import {ItemSelector} from 'src/model/item'
  import {
    OutsourcedInvoiceItemArray,
    OutsourcedInvoiceItemModel,
    OutsourcedInvoiceModel,
    OutsourcedInvoiceStatusArray
  } from 'src/model/outsourced-invoice'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {CompanyAddressSelector, CompanyLabelArray, CompanyModel} from 'src/model/company'
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
        model: new OutsourcedInvoiceModel(),
        invoiceModel: new InvoiceModel(),
        itemArray: new OutsourcedInvoiceItemArray(),
        receiverModel: new CompanyModel(),
        senderModel: new CompanyModel(),
        projectModel: new ProjectModel(),
        companyLabelArray: new CompanyLabelArray(),
        projectLabelArray: new ProjectLabelArray(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new OutsourcedInvoiceStatusArray()
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.statusLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.companyLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {

      async onSelectReceiverAddress() {
        const selector = new CompanyAddressSelector(this)
        selector.companyId = this.model.receiverId
        const addresses = await selector.show()

        if (addresses && addresses.length) {
          const model = this.model
          const companyAddress = addresses[0]
          model.receiveAddress.postalCode = companyAddress.address.postalCode
          model.receiveAddress.street = companyAddress.address.street
          model.receiveAddress.detail = companyAddress.address.detail
        }
      },

      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },

      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },

      async create() {
        this.model = await new OutsourcedInvoiceModel
        this.itemArray = new OutsourcedInvoiceItemArray(this.model)
        const owner = await CompanyModel.owner()
        this.model.receiverId = owner.id
      },

      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await OutsourcedInvoiceModel.get(id)
        const itemArray = new OutsourcedInvoiceItemArray(model)
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
      },

      async onAddItem() {
        const itemSelector = new ItemSelector(this)
        itemSelector.defaultFilters = {
          customerId: this.senderModel.id,
          customerName: this.senderModel.name,
          purchasable: false
        }

        const itemModels = await itemSelector.show()
        if (!itemModels) {
          return
        }
        itemModels.map(async (itemModel) => {
          const item = new OutsourcedInvoiceItemModel({
            itemId: itemModel.id,
            unit: itemModel.unit
          })
          await item.fetchReference()
          this.itemArray.push(item)
        })

      },

      async onRemoveItem() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          this.itemArray.remove(this.selected.item)
          this.selected.item = null
        }
      },

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
      cancelable() {
        return this.model.cancelable
      },
      determinable() {
        return this.model.determinable
      },
      determined() {
        return this.model.status == 'DETERMINED'
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
      },
      'model.invoiceId': async function (to) {
        this.invoiceModel = await InvoiceModel.get(to, true)
      },
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
        this.model.senderId = this.projectModel.customerId
      }
    },
    components: {
      CommentList
    }
  }
</script>
