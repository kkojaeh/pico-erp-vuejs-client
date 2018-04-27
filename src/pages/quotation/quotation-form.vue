<template>

  <q-page class="row" style="padding-bottom: 80px">

    <q-card class="col-12" flat>

      <q-card-title>
        견적 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="label" helper="견적 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름"/>
        </q-field>

        <q-field icon="account_box" helper="담당자를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.managerId"
                 :error-label="model.$errors.managerId">

          <c-autocomplete-select float-label="담당자" v-model="model.managerId"
                                 :label="managerModel.name" :options="userLabels"
                                 label-field="label" value-field="value"
                                 @search="onManagerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="check" helper="견적의 상태 입니다"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-select float-label="상태" v-model="model.status" readonly hide-underline
                    :options="statusLabels"></q-select>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        고객 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fa-building" helper="프로젝트를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.projectId" :error-label="model.$errors.projectId">

          <c-autocomplete-select float-label="프로젝트" v-model="model.projectId"
                                 :label="projectModel.name" :options="projectLabels"
                                 label-field="label" value-field="value"
                                 @search="onProjectSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="fa-building" helper="견적 대상 고객사 입니다"
                 class="col-xs-12 col-md-6 col-xl-4">
          <q-input float-label="고객사" v-model="customerModel.name"
                   readonly hide-underline>
          </q-input>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat :disabled="!model.projectId">

      <q-card-title>
        고객 담당자
        <div slot="right" class="row items-center">
          <q-btn outline @click="onCopyContactFromProjectClick"
                 v-show="model.projectId">프로젝트 고객 담당자와 동일
          </q-btn>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="고객 담당자 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerManagerContact.name"
                 :error-label="model.$errors.customerManagerContact.name">
          <q-input v-model="model.customerManagerContact.name" float-label="고객 담당자 이름"
                   class="ime-mode-active"/>
        </q-field>

        <q-field icon="email" helper="고객 담당자 이메일을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerManagerContact.email"
                 :error-label="model.$errors.customerManagerContact.email">
          <q-input v-model="model.customerManagerContact.email" type="email"
                   float-label="고객 담당자 이메일"
                   class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fa-mobile" helper="고객 담당자 핸드폰 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.mobilePhoneNumber"
                 :error-label="model.$errors.mobilePhoneNumber">
          <c-phone-number-input v-model="model.customerManagerContact.mobilePhoneNumber"
                                float-label="고객 담당자 핸드폰 번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="phone" helper="고객 담당자 전화 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.telephoneNumber"
                 :error-label="model.$errors.telephoneNumber">
          <c-phone-number-input v-model="model.customerManagerContact.telephoneNumber"
                                float-label="고객 담당자 전화번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fa-fax" helper="고객 담당자 FAX 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.faxNumber"
                 :error-label="model.$errors.faxNumber">
          <c-phone-number-input v-model="model.customerManagerContact.faxNumber"
                                float-label="고객 담당자 FAX 번호"
                                class="ime-mode-disabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat :disabled="creating">

      <q-card-title>
        품목
        <div slot="right" class="row items-center">
          <q-toggle v-model="detailedItemUnitPrice" label="상세 단가"/>
          <q-btn-dropdown outline label="추가" flat icon="add">
            <!-- dropdown content -->
            <q-list link>
              <q-item @click.native="addBomBySelect" v-close-overlay>
                <q-item-side left icon="add"></q-item-side>
                <q-item-main label="기존 품목"></q-item-main>
              </q-item>
              <q-item @click.native="addBomByNew" v-close-overlay>
                <q-item-side left icon="add"></q-item-side>
                <q-item-main label="신규 품목"></q-item-main>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 dom-layout='autoHeight'
                 row-selection="single"
                 enable-col-resize
                 enable-sorting
                 :is-full-width-cell="isFullWidthCell"
                 full-width-cell-renderer-framework="quotation-bom-renderer"
                 :full-width-cell-renderer-params="{detailed: detailedItemUnitPrice}"
                 :does-data-flower="doesDataFlower"
                 :get-row-height="getRowHeight"
                 :row-data="itemArray"
                 @cell-value-changed="onItemCellValueChanged">
          <ag-grid-column field="name" header-name="이름" cellRenderer="agGroupCellRenderer"
                          :checkbox-selection="true"
                          :width="300"
                          :cell-renderer-params="{
                            suppressCount: true
                          }"/>
          <ag-grid-column field="bom.item.code" header-name="코드" :width="150"
                          cell-renderer-framework="ag-grid-router-link-renderer"
                          :cell-renderer-params="{path:'/item/show/${bom.item.id}', innerRenderer: createCellRenderer('item.externalCode')}" />
          <ag-grid-column field="description" header-name="설명" :width="200"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 200 }"
                          :editable="isModifiable"/>
          <ag-grid-column field="unit" header-name="단위" :width="100"
                          :cell-style="{textAlign: 'center'}"/>
          <ag-grid-column field="quantity" header-name="수량" :width="100"
                          :cell-style="{textAlign: 'right'}"
                          :editable="isModifiable" cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number' }"/>
          <ag-grid-column field="unitPrice.original" header-name="단가" :width="100"
                          :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="unitPrice.directMaterial" header-name="재료비(직접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="unitPrice.indirectMaterial" header-name="재료비(간접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="unitPrice.directLabor" header-name="노무비(직접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :hide="!detailedItemUnitPrice"
                          :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="unitPrice.indirectLabor" header-name="노무비(간접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :hide="!detailedItemUnitPrice"
                          :width="100" :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="unitPrice.indirectExpenses" header-name="간접경비"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="unitPrice.discountRate" header-name="할인율" :width="100"
                          :cell-style="{textAlign: 'right'}" :editable="isModifiable"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', decimals: 2, suffix:'%', align:'right', toValue:percentToValue, fromValue: percentFromValue  }"
                          :value-formatter="percentFormatter"/>
          <ag-grid-column field="originalAmount" header-name="금액(할인전)" :width="100"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="discountedAmount" header-name="금액(할인후)" :width="100"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="finalizedAmount" header-name="금액" :width="100"
                          :cell-style="{textAlign: 'right'}"/>


          <ag-grid-column field="description" header-name="비고" :width="200"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"
                          :editable="isModifiable"/>
        </ag-grid>

      </q-card-main>

      <q-card-title>
        품목 부가비
        <div slot="right" class="row items-center">
          <q-btn outline label="추가" flat icon="add" @click="addItemAddition" />
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 dom-layout='autoHeight'
                 row-selection="single"
                 enable-col-resize
                 enable-sorting
                 :is-full-width-cell="isFullWidthCell"
                 full-width-cell-renderer-framework="quotation-bom-renderer"
                 :full-width-cell-renderer-params="{detailed: detailedItemUnitPrice}"
                 :does-data-flower="doesDataFlower"
                 :get-row-height="getRowHeight"
                 :row-data="itemArray"
                 @cell-value-changed="onItemCellValueChanged">
          <ag-grid-column field="name" header-name="이름" cellRenderer="agGroupCellRenderer"
                          :checkbox-selection="true"
                          :width="300"
                          :cell-renderer-params="{
                            suppressCount: true
                          }"/>
          <ag-grid-column field="bom.item.code" header-name="코드" :width="150"
                          cell-renderer-framework="ag-grid-router-link-renderer"
                          :cell-renderer-params="{path:'/item/show/${bom.item.id}', innerRenderer: createCellRenderer('item.externalCode')}" />
          <ag-grid-column field="description" header-name="설명" :width="200"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 200 }"
                          :editable="isModifiable"/>
          <ag-grid-column field="unit" header-name="단위" :width="100"
                          :cell-style="{textAlign: 'center'}"/>
          <ag-grid-column field="quantity" header-name="수량" :width="100"
                          :cell-style="{textAlign: 'right'}"
                          :editable="isModifiable" cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number' }"/>
          <ag-grid-column field="unitPrice.original" header-name="단가" :width="100"
                          :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="unitPrice.directMaterial" header-name="재료비(직접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="unitPrice.indirectMaterial" header-name="재료비(간접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="unitPrice.directLabor" header-name="노무비(직접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :hide="!detailedItemUnitPrice"
                          :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="unitPrice.indirectLabor" header-name="노무비(간접)"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :hide="!detailedItemUnitPrice"
                          :width="100" :cell-style="{textAlign: 'right'}"/>
          <ag-grid-column field="unitPrice.indirectExpenses" header-name="간접경비"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :width="100" :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="unitPrice.discountRate" header-name="할인율" :width="100"
                          :cell-style="{textAlign: 'right'}" :editable="isModifiable"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ type: 'number', decimals: 2, suffix:'%', align:'right', toValue:percentToValue, fromValue: percentFromValue  }"
                          :value-formatter="percentFormatter"/>
          <ag-grid-column field="originalAmount" header-name="금액(할인전)" :width="100"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="discountedAmount" header-name="금액(할인후)" :width="100"
                          header-class="quotation-detailed-price"
                          cell-class="quotation-detailed-price"
                          :cell-style="{textAlign: 'right'}"
                          :hide="!detailedItemUnitPrice"/>
          <ag-grid-column field="finalizedAmount" header-name="금액" :width="100"
                          :cell-style="{textAlign: 'right'}"/>


          <ag-grid-column field="description" header-name="비고" :width="200"
                          cell-editor-framework="ag-grid-input-editor"
                          :cell-editor-params="{ maxlength: 50 }"
                          :editable="isModifiable"/>
        </ag-grid>

      </q-card-main>

    </q-card>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable">이전</q-btn>
        <q-toolbar-title>
        </q-toolbar-title>
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating">삭제</q-btn>
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!creating">이력
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" :url="`/audit/company/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="_onSaveClick()">저장</q-btn>
      </q-toolbar>
    </q-page-sticky>

    <q-modal ref="itemFormModal">
      <item-form ref="itemForm" action="create" closable></item-form>
    </q-modal>

    <q-modal ref="itemSelectorModal" content-classes="column">
      <item-selector ref="itemSelector"></item-selector>
    </q-modal>

  </q-page>

</template>
<script>
  import { mapGetters } from 'vuex'
  import {
    QuotationExpiryPolicyArray,
    QuotationModel,
    QuotationStatusArray
  } from 'src/model/quotation'
  import { ProjectLabelArray, ProjectModel } from 'src/model/project'
  import { BomModel } from 'src/model/bom'
  import { CompanyModel } from 'src/model/company'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import { UserLabelArray, UserModel } from 'src/model/user'
  import ItemSelector from 'src/pages/item/item-selector.vue'
  import ItemForm from 'src/pages/item/item-form.vue'
  import QuotationBomRenderer from './quotation-bom-renderer.vue'
  import * as _ from 'lodash'
  import Big from 'big.js'

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
    data () {
      return {
        model: new QuotationModel(),
        projectModel: new ProjectModel(),
        customerModel: new CompanyModel(),
        managerModel: new UserModel(),
        projectLabels: new ProjectLabelArray(),
        statusLabels: new QuotationStatusArray(),
        userLabels: new UserLabelArray(),
        expiryPolicyLabels: new QuotationExpiryPolicyArray(),
        itemArray: [],
        creating: false,
        detailedItemUnitPrice: false
      }
    },
    mounted () {
      this.statusLabels.fetch()
      this.expiryPolicyLabels.fetch()
      this.projectLabels.query()
      this.userLabels.query()
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
    },
    methods: {
      createCellRenderer (additionalField) {
        return function (params) {
          const addition = _.get(params.data, additionalField)
          if (addition == null || addition == undefined) {
            return params.value
          }
          return `${params.value} (${addition})`
        }
      },
      async onItemCellValueChanged(e) {
        if(e.newValue == e.oldValue){
          return
        }
        await e.data.update()
        this.load()
      },
      percentToValue (value) {
        return Number(new Big(value).times(100).round(2))
      },
      percentFromValue (value) {
        return Number(new Big(value).div(100))
      },
      percentFormatter (params) {
        return new Big(params.value).times(100).toFixed(2) + ' %'
      },
      isFullWidthCell (node) {
        return node.flower
      },
      doesDataFlower (data) {
        return data['@type'] == 'bom'
      },
      getRowHeight: function (params) {
        var rowIsNestedRow = params.node.flower

        if (rowIsNestedRow) {
          return 70  + params.data.bom.count * 48
        }
        return 48
      },
      async onProjectSearch (keyword, done) {
        await this.projectLabels.query(keyword)
        done()
      },
      async onManagerSearch (keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },
      async onCopyContactFromProjectClick () {
        const ok = await this.$alert.confirm('프로젝트의 고객 담당자 정보를 불러 오시겠습니까?')
        if (ok) {
          _.assign(this.model.customerManagerContact, this.projectModel.customerManagerContact)
        }
      },
      async onBomItemAddClick () {

      },
      async create () {
        this.creating = true
        this.model = new QuotationModel()
      },
      async show () {
        this.creating = false
        this.load()
      },
      async load () {
        this.model = await QuotationModel.get(this.id)
        await this.model.fetchAll()
        this.itemArray = this.model.items
      },
      async _onSaveClick () {
        let valid = this.creating ? await this.model.validateCreate()
          : await this.model.validateUpdate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              if (this.creating) {
                const ok = await this.$alert.confirm('계속 편집 하시겠습니까?')
                if (ok) {
                  this.$router.push({
                    path: `/quotation/show/${this.model.id}`, query: this.$route.query
                  })
                } else {
                  this.$closeOverlay()
                }
              } else {
                this.$closeOverlay()
              }
            }

          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },
      async save () {
        if (this.creating) {
          await this.model.create()
        } else {
          await this.model.update()
        }
        this.$emit('saved', this.model)
      },
      /**
       * ItemForm@saved -> BomModel.createByItemId -> selected.addMaterial
       */
      addBomByNew () {
        const model = this.model
        const modal = this.$refs.itemFormModal
        const form = this.$refs.itemForm
        modal.show()
        modal.$once('hide', () => {
          form.$off('saved')
        })
        form.$once('saved', async (itemModel) => {
          modal.hide()
          const bom = await BomModel.createByItemId(itemModel.id)
          await model.addBomItem(bom)
          this.load()
        })
      },

      addBomBySelect () {
        const model = this.model
        const modal = this.$refs.itemSelectorModal
        const selector = this.$refs.itemSelector
        modal.show()
        modal.$once('hide', () => {
          selector.$off('selected')
        })
        selector.$once('selected', async (itemModels) => {
          modal.hide()
          await Promise.all(
            itemModels.map(async (itemModel) => {
              const itemId = itemModel.id
              const exists = await BomModel.existsByItemId(itemId)
              let bom
              if (exists) {
                bom = await BomModel.getByItemId(itemId)
              } else {
                bom = await BomModel.createByItemId(itemModel.id)
              }
              await model.addBomItem(bom)
            })
          )
          this.load()
        })
      },

      addItemAddition () {

      }
    },
    computed: {
      ...mapGetters([]),
      isModifiable () {
        return this.model.status == 'DRAFT'
      }
    },
    watch: {
      'model.projectId': async function (to) {
        this.projectModel = await ProjectModel.get(to, true)
        const customerId = this.projectModel.customerId
        this.model.customerId = customerId
        this.customerModel = await CompanyModel.get(customerId, true)
      },
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      }
    },
    components: {
      AuditViewer,
      ItemSelector,
      ItemForm,
      QuotationBomRenderer
    }
  }
</script>
<style lang="stylus">
  .quotation-detailed-price
    font-size: 10px !important
    color: lightslategray
    opacity: 0.7
</style>
