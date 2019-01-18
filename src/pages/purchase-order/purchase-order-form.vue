<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        발주 정보
        <span slot="right" v-if="!!model.code">{{model.code}}
          <q-btn icon="content_copy" v-clipboard:copy="model.code" v-clipboard-notify
                 flat></q-btn>
        </span>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="품목을 공급할 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.supplierId"
                 :error-label="model.$errors.supplierId">
          <c-autocomplete-select float-label="공급사" v-model="model.supplierId"
                                 :label="supplierModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onCompanySearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.dueDate" :error-label="model.$errors.dueDate">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      :readonly="!updatable" :hide-underline="!updatable"
                      type="date"/>
        </q-field>

        <q-field icon="account_box" helper="담당자 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.chargerId"
                 :error-label="model.$errors.chargerId">
          <c-autocomplete-select float-label="담당자" v-model="model.chargerId"
                                 :label="chargerModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!updatable" :hide-underline="!updatable"
                                 @search="onUserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
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
        인수 정보
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="인수사 주소 불러오기" icon="location_on"
                 v-if="updatable"
                 @click="onCompanyAddressLoad"
                 :disabled="!model.receiverId"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="품목을 인수할 회사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiverId"
                 :error-label="model.$errors.receiverId">
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

        <q-field icon="fas fa-map-marker" helper="인수지의 주소를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-4"
                 :readonly="!updatable" :hide-underline="!updatable"
                 :error="!!model.$errors.receiveAddress.postalCode || !!model.$errors.receiveAddress.street || !!model.$errors.receiveAddress.detail"
                 :error-label="model.$errors.receiveAddress.postalCode || model.$errors.receiveAddress.street || model.$errors.receiveAddress.detail">
          <c-address-input v-model="model.receiveAddress"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        발주 품목
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddItem"
                 v-if="updatable"
          />
          <q-btn flat color="secondary" label="삭제" icon="remove"
                 v-if="updatable"
                 @click="onRemoveItem"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 :editable="true"
                 stop-editing-when-grid-loses-focus
                 suppress-no-rows-overlay
                 @selection-changed="onItemSelectionChanged"
                 @cell-value-changed="onItemCellValueChanged"
                 :row-data="itemArray">

          <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"
                          :hide="!updatable"/>
          <ag-grid-column field="projectId" header-name="프로젝트" :width="150"
                          :editable="itemEditableFn"
                          :cell-editor-params="{ options: projectLabelArray,  labelField: 'label' , valueField: 'value', onSearch:onProjectSearch}"
                          :cell-renderer="projectRenderer"
                          cell-editor-framework="ag-grid-autocomplete-select-editor"/>
          <ag-grid-column field="item.code" header-name="품목 코드" :width="100"/>
          <ag-grid-column field="item.name" header-name="품목 이름" :width="200"/>
          <ag-grid-column field="itemSpecId" header-name="스펙" :width="160"
                          cell-renderer-framework="purchase-order-item-spec-cell-renderer"
                          :cell-renderer-params="{openHandler: onOpenItemSpec}"/>
          <ag-grid-column field="purchaseEstimatedUnitCost" header-name="예상단가" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          <ag-grid-column field="unitCost" header-name="단가" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-editor-framework="ag-grid-input-editor"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          :cell-editor-params="{ type: 'number', align: 'right' }"
                          :editable="updatable"/>
          <ag-grid-column field="quantity" header-name="수량" :width="120"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"
                          :editable="itemEditableFn"/>
          <ag-grid-column field="receivedQuantity" header-name="받은수량" :width="120"
                          :hide="!receivable"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', align: 'right' }"/>
          <ag-grid-column field="purchaseUnit" header-name="단위" :width="80"
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

    <q-card class="col-12" flat v-if="invoiceable">

      <q-card-title>
        송장 목록
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddItem"
                 v-if="updatable"
          />
          <q-btn flat color="secondary" label="삭제" icon="remove"
                 v-if="updatable"
                 @click="onRemoveItem"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 :editable="false"
                 stop-editing-when-grid-loses-focus
                 suppress-no-rows-overlay
                 @cell-clicked="onInvoiceGridCellClicked"
                 :row-data="invoiceArray">
          <ag-grid-column field="dueDate" header-name="입고일시" :width="180"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          :cell-style="{'text-decoration': 'underline', 'cursor': 'pointer'}"
                          :cell-renderer-params="{ago:true}"/>
          <ag-grid-column field="status" header-name="상태" :width="100"
                          cell-renderer-framework="ag-grid-array-label-renderer"
                          :cell-renderer-params="{array:invoiceStatusLabelArray, valueField:'value', labelField: 'label'}"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <!--
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!phantom" label="삭제"></q-btn>
        -->
        <q-btn flat icon="print" @click="onPrintDraft()" label="발주서 출력"
               v-if="printable"></q-btn>
        <q-btn flat icon="done" @click="onDetermine()" label="확정"
               v-if="determinable"></q-btn>
        <q-btn flat icon="done" @click="onCreatePurchaseInvoice()" label="발주 송장 생성"
               v-if="receivable" v-show="$authorized.invoicePublishable"></q-btn>
        <q-btn flat icon="cancel_presentation" @click="onReject()" label="공급사 거부"
               v-if="rejectable"></q-btn>
        <q-btn flat icon="send" @click="onSend()" label="전송"
               v-if="sendable"></q-btn>
        <q-btn flat icon="cancel" @click="onCancel()" label="취소"
               v-if="cancelable"></q-btn>

        <q-btn flat icon="save" @click="onSave()" v-if="updatable" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectLabelArray, ProjectModel} from 'src/model/project'
  import {CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {
    PurchaseOrderItemArray,
    PurchaseOrderItemModel,
    PurchaseOrderModel,
    PurchaseOrderStatusArray
  } from 'src/model/purchase-order'
  import {
    PurchaseInvoiceArray,
    PurchaseInvoiceModel,
    PurchaseInvoiceStatusArray
  } from 'src/model/purchase-invoice'
  import {
    WarehouseSiteArray,
    WarehouseSiteModel,
    WarehouseStationArray,
    WarehouseStationModel,
  } from 'src/model/warehouse'
  import CommentList from 'src/pages/comment/comment-list.vue'
  import {UnitLabelArray} from 'src/model/shared'
  import PurchaseOrderItemSpecCellRenderer from './purchase-order-item-spec-cell-renderer'

  export default {
    authorized: {
      'invoicePublishable': 'hasAnyRole(\'PURCHASE_INVOICE_PUBLISHER\', \'PURCHASE_INVOICE_MANAGER\')'
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
        model: new PurchaseOrderModel(),
        itemArray: new PurchaseOrderItemArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        chargerModel: new UserModel(),
        projectModel: new ProjectModel(),
        projectLabelArray: new ProjectLabelArray(),
        receiverModel: new CompanyModel(),
        supplierModel: new CompanyModel(),
        unitLabelArray: new UnitLabelArray(),
        statusLabelArray: new PurchaseOrderStatusArray(),
        receiveStationModel: new WarehouseStationModel(),
        receiveSiteModel: new WarehouseSiteModel(),
        siteArray: new WarehouseSiteArray(),
        stationArray: new WarehouseStationArray(),
        invoiceStatusLabelArray: new PurchaseInvoiceStatusArray(),
        invoiceArray: new PurchaseInvoiceArray(),

        enabled: true,
        selected: {
          item: null
        },
        owner: new CompanyModel()
      }
    },
    async mounted() {
      await Promise.all([
        this.unitLabelArray.fetch(),
        this.siteArray.fetch(),
        this.companyLabelArray.fetch(),
        this.userLabelArray.fetch(),
        this.projectLabelArray.fetch(),
        this.statusLabelArray.fetch(),
        this.invoiceStatusLabelArray.fetch()
      ])
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.siteArray.forEach(site => {
        site.value = site.id
        site.label = site.name
      })
    },
    methods: {
      async onInvoiceGridCellClicked(event) {
        if (event.colDef.field == "dueDate") {
          const data = event.data
          const changed = await this.$showPurchaseInvoice(data.id)
          if (changed) {
            await this.load(this.id || this.model.id)
          }
        }
      },
      projectRenderer(params) {
        return params.data.project.name
      },
      itemEditableFn(params) {
        return this.updatable && params.data.updatable
      },
      async onCompanyAddressLoad() {
        const addresses = await this.$selectCompanyAddress(this.model.receiverId, {multiple: false})

        if (addresses && addresses.length) {
          const model = this.model
          const companyAddress = addresses[0]
          model.receiveAddress = Object.assign({}, companyAddress.address)
          /*
          model.deliveryMobilePhoneNumber = companyAddress.mobilePhoneNumber
          model.deliveryTelephoneNumber = companyAddress.telephoneNumber
          */
        }
      },

      async onCompanySearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onUserSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
      },

      onItemSelectionChanged(event) {
        this.selected.item = event.api.getSelectedRows()[0]
      },

      async onItemCellValueChanged(event) {
        if (event.colDef.field == 'projectId') {
          await event.data.fetchReference()
          this.$redrawGrids()
        }
      },

      async onOpenItemSpec(data) {
        this.selected.item = data
        if (data.itemSpecId) {
          const changed = await this.$showItemSpec(data.itemSpecId, {
            editable: this.updatable && data.updatable
          })
          if (changed) {
            await data.fetchReference()
          }
        } else {
          const created = await this.$createItemSpec({
            itemId: data.itemId
          })
          if (created) {
            data.itemSpecId = created.id
            await data.fetchReference()
          }
        }
        this.$redrawGrids()
      },

      async create() {
        this.model = new PurchaseOrderModel()
        this.itemArray = new PurchaseOrderItemArray(this.model)
        this.model.chargerId = this.user.id
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await PurchaseOrderModel.get(id)
        const itemArray = new PurchaseOrderItemArray(model)
        const invoiceArray = new PurchaseInvoiceArray(model)
        await Promise.all([
          itemArray.fetch(),
          invoiceArray.fetch()
        ])
        this.model = model
        this.itemArray = itemArray
        this.invoiceArray = invoiceArray
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
          const ok = await this.$alert.confirm('발주를 확정 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.determine()
            this.$alert.positive('확정 되었습니다')
            await this.load(this.id || this.model.id)
            await this.onPrintDraft()
          }
        } else {
          this.$alert.warning(this.model.$errors.determine)
        }
      },

      async onSend() {
        const validSend = await this.model.validateSend()
        if (validSend) {
          const ok = await this.$alert.confirm('발주를 전송 하시겠습니까?')
          if (ok) {
            await this.model.send()
            this.$alert.positive('전송 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.send)
        }
      },

      async onCancel() {
        const validCancel = await this.model.validateCancel()
        if (validCancel) {
          const ok = await this.$alert.confirm('발주를 취소 하시겠습니까?')
          if (ok) {
            await this.model.cancel()
            this.$alert.positive('취소 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.cancel)
        }
      },

      async onReject() {
        const validReject = await this.model.validateReject()
        if (validReject) {
          const ok = await this.$alert.confirm('공급사가 거부 하였습니까?')
          if (ok) {
            const reason = await this.$alert.prompt('공급사의 거부 사유를 입력하세요')
            if (!reason) {
              this.$alert.warning("거부 사유가 없습니다")
              return
            }
            await this.model.reject(reason)
            this.$alert.positive('공급사 거부가 처리 되었습니다')
            await this.closeOrReload()
          }
        } else {
          this.$alert.warning(this.model.$errors.reject)
        }
      },

      async onPrintDraft() {
        const ok = await this.$alert.confirm('발주서를 출력 하시겠습니까?')
        if (ok) {
          await this.model.printDraft()
          this.$alert.positive('출력 되었습니다')
        }
      },

      async onAddItem() {
        const itemModels = await this.$selectItem({
          defaultFilters: {
            purchasable: true
          }
        })
        if (!itemModels) {
          return
        }
        itemModels.map(async (itemModel) => {
          const itemId = itemModel.id
          const item = new PurchaseOrderItemModel({
            itemId: itemId
          })
          await item.fetchReference()
          this.itemArray.push(item)
        })

      },

      async onCreatePurchaseInvoice() {
        const purchaseInvoice = await PurchaseInvoiceModel.generate(this.model.id)
        await this.$await(1000)
        await this.$showPurchaseInvoice(purchaseInvoice.id)
        await this.load(this.id || this.model.id)
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
      sendable() {
        return this.model.sendable
      },
      cancelable() {
        return this.model.cancelable
      },
      rejectable() {
        return this.model.rejectable
      },
      determinable() {
        return this.model.determinable
      },
      printable() {
        return this.model.printable
      },
      receivable() {
        return this.model.receivable
      },
      invoiceable() {
        return this.model.receivable || this.model.status == 'RECEIVED'
      }
    },
    watch: {
      'model.chargerId': async function (to) {
        this.chargerModel = await UserModel.get(to, true)
      },
      'model.supplierId': async function (to) {
        this.supplierModel = await CompanyModel.get(to, true)
      },
      'model.receiverId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
      }
    },
    components: {
      CommentList,
      PurchaseOrderItemSpecCellRenderer
    }
  }
</script>
