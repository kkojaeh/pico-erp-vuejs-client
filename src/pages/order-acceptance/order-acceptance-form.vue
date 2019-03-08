<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        주문 접수 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">


        <q-field icon="fas fa-building" helper="프로젝트를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.projectId" :error-label="model.$errors.projectId">

          <c-autocomplete-select float-label="프로젝트" v-model="model.projectId"
                                 :label="projectModel.name" :options="projectLabelArray"
                                 label-field="label" value-field="value"
                                 :readonly="!!model.projectId" :hide-underline="!!model.projectId"
                                 @search="onProjectSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_circle" helper="주문 접수 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
        </q-field>

        <q-field icon="check" helper="견적의 상태 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-select float-label="상태" v-model="model.status" readonly hide-underline
                    :options="statusLabelArray"></q-select>
        </q-field>

        <q-field icon="account_box" helper="담당자를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.managerId"
                 :error-label="model.$errors.managerId">
          <c-autocomplete-select float-label="담당자" v-model="model.managerId"
                                 :label="managerModel.name" :options="userLabelArray"
                                 label-field="label" value-field="value"
                                 @search="onManagerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fas fa-building" helper="프로젝트의 고객사 입니다"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerId"
                 :error-label="model.$errors.customerId">
          <c-autocomplete-select float-label="고객사" v-model="model.customerId"
                                 :label="customerModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 hide-underline readonly
                                 @search="onCustomerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        발주 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="발주사를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.purchaserId"
                 :error-label="model.$errors.purchaserId">
          <c-autocomplete-select float-label="발주사" v-model="model.purchaserId"
                                 :label="purchaserModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 @search="onPurchaserSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_circle" helper="발주번호(PO 번호)를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.purchaseOrderNumber"
                 :error-label="model.$errors.purchaseOrderNumber">
          <q-input v-model="model.purchaseOrderNumber" float-label="발주번호(PO 번호)"/>
        </q-field>

        <q-field icon="fas fa-calendar" helper="주문일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-datetime float-label="주문일" v-model="model.orderedDate"
                      type="date"/>
        </q-field>

        <q-field icon="fas fa-calendar" helper="만기일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3">
          <q-datetime float-label="만기일자" v-model="model.dueDate"
                      type="date"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        인수 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="인수사를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.receiverId"
                 :error-label="model.$errors.receiverId">
          <c-autocomplete-select float-label="인수사" v-model="model.receiverId"
                                 :label="receiverModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 @search="onReceiverSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>


        <q-field icon="fas fa-mobile" helper="인수지에서 연락할 핸드폰 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.deliveryMobilePhoneNumber"
                 :error-label="model.$errors.deliveryMobilePhoneNumber">
          <c-phone-number-input v-model="model.deliveryMobilePhoneNumber"
                                float-label="인수지 핸드폰 번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="phone" helper="인수지에서 연락할 전화 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.deliveryTelephoneNumber"
                 :error-label="model.$errors.deliveryTelephoneNumber">
          <c-phone-number-input v-model="model.deliveryTelephoneNumber"
                                float-label="인수지 전화번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fas fa-map-marker" helper="인수지의 주소를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-6">
          <c-address-input v-model="model.deliveryAddress"
                           :after="[{ icon:'list', condition: modifiable && !!model.receiverId, handler:onCompanyAddressLoad}]"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        주문 품목
        <div slot="right" class="row items-center">
          <sup>프로젝트 선택후 추가/삭제 가능합니다</sup>
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddItem"
                 v-if="modifiable"
                 :disabled="!model.projectId"/>
          <q-btn flat color="secondary" label="삭제" icon="remove"
                 v-if="modifiable"
                 :disabled="!selected.item || !model.projectId"
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
                 suppress-no-rows-overlay
                 @selection-changed="onItemSelectionChanged"
                 :row-data="itemArray">

          <!--<ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>-->
          <ag-grid-column field="item.code" header-name="품목 코드" :width="200"/>
          <ag-grid-column field="item.name" header-name="품목 이름" :width="300"/>
          <ag-grid-column field="unitPrice" header-name="단가" :width="150"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          <ag-grid-column field="quantity" header-name="수량" :width="150"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number' }"
                          :editable="modifiable"/>
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
        <q-btn flat icon="call_received" @click="onAccept()" label="접수"
               v-if="model.acceptable"></q-btn>
        <q-btn flat icon="save" @click="onSave()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectLabelArray, ProjectModel, ProjectSaleItemSelector} from 'src/model/project'
  import {CompanyAddressSelector, CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import {
    OrderAcceptanceItemArray,
    OrderAcceptanceItemModel,
    OrderAcceptanceModel,
    OrderAcceptanceStatusArray
  } from 'src/model/order-acceptance'
  import CommentList from 'src/pages/comment/comment-list.vue'

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
      }
    },
    data() {
      return {
        model: new OrderAcceptanceModel(),
        itemArray: new OrderAcceptanceItemArray(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        managerModel: new UserModel(),
        projectModel: new ProjectModel(),
        projectLabelArray: new ProjectLabelArray(),
        customerModel: new CompanyModel(),
        purchaserModel: new CompanyModel(),
        receiverModel: new CompanyModel(),
        statusLabelArray: new OrderAcceptanceStatusArray(),
        enabled: true,
        selected: {
          item: null
        }
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.companyLabelArray.fetch()
      this.userLabelArray.fetch()
      this.projectLabelArray.fetch()
      this.statusLabelArray.fetch()
    },
    methods: {
      async onCustomerSearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onPurchaserSearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onReceiverSearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onManagerSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      async onProjectSearch(keyword) {
        await this.projectLabelArray.fetch(keyword)
        done()
      },

      onItemSelectionChanged(event) {
        this.selected.item = event.api.getSelectedRows()[0]
      },

      async create() {
        this.model = new OrderAcceptanceModel()
        this.itemArray = new OrderAcceptanceItemArray(this.model)
        this.$alert.info("프로젝트를 먼저 선택하세요")
      },
      async show() {
        await this.load(this.id)
      },
      async load(id) {
        const model = await OrderAcceptanceModel.get(id)
        const itemArray = new OrderAcceptanceItemArray(model)
        await itemArray.fetch()
        this.model = model
        this.itemArray = itemArray
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
            if (this.closable) {
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
        await this.model.save()
        await this.itemArray.save()
      },

      async onAccept() {
        let valid = await this.model.validateAccept()
        if (valid) {
          const ok = await this.$alert.confirm('주문을 접수 하시겠습니까?')
          if (ok) {
            await this.model.accept()
            await this.load(this.id)
            this.$alert.positive('접수 되었습니다')
          }
        } else {
          this.$alert.warning(this.selected.$errors.accept)
        }
      },

      async onCompanyAddressLoad() {
        const selector = new CompanyAddressSelector(this)
        selector.companyId = this.model.receiverId
        const addresses = await selector.show()

        if (addresses && addresses.length) {
          const model = this.model
          const companyAddress = addresses[0]
          model.deliveryAddress.postalCode = companyAddress.address.postalCode
          model.deliveryAddress.street = companyAddress.address.street
          model.deliveryAddress.detail = companyAddress.address.detail
          model.deliveryMobilePhoneNumber = companyAddress.mobilePhoneNumber
          model.deliveryTelephoneNumber = companyAddress.telephoneNumber
        }
      },

      async onAddItem() {
        const selector = new ProjectSaleItemSelector(this)
        selector.projectId = this.model.projectId
        selector.multiple = true
        const models = await selector.show()
        models.map(async model => {
          const item = new OrderAcceptanceItemModel({
            itemId: model.itemId,
            unitPrice: model.unitPrice
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
      phantom() {
        return this.model.phantom
      },
      modifiable() {
        return this.model.modifiable
      }
    },
    watch: {
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      },
      'model.customerId': async function (to) {
        this.customerModel = await CompanyModel.get(to, true)
      },
      'model.purchaserId': async function (to) {
        this.purchaserModel = await CompanyModel.get(to, true)
      },
      'model.receiverId': async function (to) {
        this.receiverModel = await CompanyModel.get(to, true)
      },
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
        this.model.customerId = this.projectModel.customerId
        this.customerModel = await CompanyModel.get(this.model.customerId, true)

      }
    },
    components: {
      CommentList
    }
  }
</script>
