<template>

  <q-page class="row" style="padding-bottom: 80px">

    <q-tabs class="col-12" inverted v-model="tab">
      <q-tab default slot="title" name="info" icon="info">견적 정보</q-tab>
      <q-tab :disable="creating" slot="title" name="item" icon="view_list">견적 품목</q-tab>
      <q-tab-pane name="info" class="column no-border" keep-alive>
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

            <q-field icon="error_outline" helper="만료 정책을 선택하세요"
                     class="col-xs-12 col-md-6 col-xl-4"
                     :error="!!model.$errors.expiryPolicy"
                     :error-label="model.$errors.expiryPolicy">
              <q-select float-label="만료 정책" v-model="model.expiryPolicy"
                        :options="expiryPolicyLabels"></q-select>
            </q-field>

            <q-field icon="check" helper="견적의 상태 입니다"
                     class="col-xs-12 col-md-6 col-xl-4">
              <q-select float-label="상태" v-model="model.status" readonly hide-underline
                        :options="statusLabels"></q-select>
            </q-field>

            <q-field icon="description" helper="내부에서 공유할 의견 및 설명을 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4"
                     :error="!!model.$errors.protectedDescription"
                     :error-label="model.$errors.protectedDescription"
                     :count="200">
              <q-input type="textarea" v-model="model.protectedDescription" float-label="내부 설명"
                       rows="5"
                       max-length="200"/>
            </q-field>

            <q-field icon="description" helper="외부에 공유할 의견 및 설명을 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4"
                     :error="!!model.$errors.publicDescription"
                     :error-label="model.$errors.publicDescription"
                     :count="200">
              <q-input type="textarea" v-model="model.publicDescription" float-label="외부 설명"
                       rows="5"
                       max-length="200"/>
            </q-field>

            <q-field icon="attachment" helper="견적 관련 첨부파일 입니다"
                     class="col-xs-12 col-md-12 col-xl-12">
              <c-attachment ref="attachment" v-model="model.attachmentId" category="quotation"
                            multiple :readonly="!isModifiable"></c-attachment>
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
          </q-card-title>

          <q-card-separator/>


          <q-card-main class="row gutter-md">

            <q-field icon="account_circle" helper="고객 담당자 이름을 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4">
              <q-input v-model="projectModel.customerManagerContact.name" float-label="고객 담당자 이름"
                       class="ime-mode-active" readonly hide-underline/>
            </q-field>

            <q-field icon="email" helper="고객 담당자 이메일을 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4">
              <q-input v-model="projectModel.customerManagerContact.email" type="email"
                       float-label="고객 담당자 이메일"
                       class="ime-mode-disabled" readonly hide-underline/>
            </q-field>

            <q-field icon="fa-mobile" helper="고객 담당자 핸드폰 번호를 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4">
              <c-phone-number-input v-model="projectModel.customerManagerContact.mobilePhoneNumber"
                                    float-label="고객 담당자 핸드폰 번호"
                                    class="ime-mode-disabled" readonly hide-underline/>
            </q-field>

            <q-field icon="phone" helper="고객 담당자 전화 번호를 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4">
              <c-phone-number-input v-model="projectModel.customerManagerContact.telephoneNumber"
                                    float-label="고객 담당자 전화번호"
                                    class="ime-mode-disabled" readonly hide-underline/>
            </q-field>

            <q-field icon="fa-fax" helper="고객 담당자 FAX 번호를 입력하세요"
                     class="col-xs-12 col-md-6 col-xl-4">
              <c-phone-number-input v-model="projectModel.customerManagerContact.faxNumber"
                                    float-label="고객 담당자 FAX 번호"
                                    class="ime-mode-disabled" readonly hide-underline/>
            </q-field>

          </q-card-main>

        </q-card>

        <q-card v-if="model.commentSubjectId" class="col-12" flat>

          <q-card-title>
            댓글
          </q-card-title>

          <q-card-separator/>

          <q-card-main class="row gutter-md">

            <comment-list class="col-xs-12 col-md-11 col-xl-11 no-border" :readonly="!isModifiable"
                          subject-type="quotation" :subject="model.commentSubjectId"></comment-list>

          </q-card-main>

        </q-card>

      </q-tab-pane>
      <q-tab-pane :disabled="creating" name="item" class="column no-border" keep-alive>
        <q-card class="col-12" flat :disabled="creating">

          <q-card-title>
            품목
            <div slot="right" class="row items-center">
              <q-btn-dropdown outline color="secondary" label="추가" flat icon="add"
                              v-show="isModifiable">
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
              <q-btn flat color="secondary" label="삭제" icon="remove" @click="removeItem"
                     :disabled="!selectedItem" v-show="isModifiable"/>
            </div>
          </q-card-title>

          <q-card-separator/>


          <q-card-main class="row">

            <ag-grid class="col"
                     dom-layout='autoHeight'
                     row-selection="single"
                     enable-col-resize
                     enable-sorting
                     suppress-no-rows-overlay
                     :is-full-width-cell="isFullWidthCell"
                     full-width-cell-renderer-framework="quotation-bom-renderer"
                     :full-width-cell-renderer-params="{detailed: detailedItemUnitPrice}"
                     :does-data-flower="doesDataFlower"
                     :get-row-height="getRowHeight"
                     :row-data="itemArray"
                     @selection-changed="onItemSelectionChanged"
                     @cell-value-changed="onItemCellValueChanged">
              <ag-grid-column field="name" header-name="이름" cellRenderer="agGroupCellRenderer"
                              :checkbox-selection="true"
                              :width="300"
                              :cell-renderer-params="{
                            suppressCount: true
                          }"/>
              <ag-grid-column field="bom.item.code" header-name="코드" :width="150"
                              cell-renderer-framework="ag-grid-router-link-renderer"
                              :cell-renderer-params="{path:'/item/show/${bom.item.id}', innerRenderer: createCellRenderer('item.externalCode')}"/>
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
                              :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice.directMaterial" header-name="직접 재료비"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :width="100" :cell-style="{textAlign: 'right'}"
                              :hide="!detailedItemUnitPrice"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice.indirectMaterial" header-name="간접 재료비"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :width="100" :cell-style="{textAlign: 'right'}"
                              :hide="!detailedItemUnitPrice"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice.directLabor" header-name="직접 노무비"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :width="100" :hide="!detailedItemUnitPrice"
                              :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice.indirectLabor" header-name="간접 노무비"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :hide="!detailedItemUnitPrice"
                              :width="100" :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice.indirectExpenses" header-name="간접경비"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :width="100" :cell-style="{textAlign: 'right'}"
                              :hide="!detailedItemUnitPrice"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice.discountRate" header-name="할인율" :width="100"
                              :cell-style="{textAlign: 'right'}" :editable="isModifiable"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ type: 'number', decimals: 2, prefix:'-', suffix:'%', align:'right', getValue: percentGetValue, setValue: percentSetValue  }"
                              :value-formatter="percentFormatter"/>
              <ag-grid-column field="originalAmount" header-name="금액(할인전)" :width="100"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"
                              :hide="!detailedItemUnitPrice"/>
              <ag-grid-column field="discountedAmount" header-name="금액(할인후)" :width="100"
                              header-class="quotation-detailed-price"
                              cell-class="quotation-detailed-price"
                              :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"
                              :hide="!detailedItemUnitPrice"/>
              <ag-grid-column field="finalizedAmount" header-name="금액" :width="100"
                              :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"/>


              <ag-grid-column field="remark" header-name="비고" :width="200"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ maxlength: 50 }"
                              :editable="isModifiable"/>

              <ag-grid-column field="@type" header-name="BOM" :width="80"
                              cell-renderer-framework="ag-grid-icon-renderer"
                              :cell-renderer-params="{ icon: 'fa-sitemap', link: true, handler: onOpenBomClicked}"/>


            </ag-grid>

          </q-card-main>

        </q-card>

        <q-card class="col-12" flat :disabled="creating">

          <q-card-title>
            품목 부가비
            <div slot="right" class="row items-center">
              <q-btn flat color="secondary" label="추가" icon="add" @click="addItemAddition"
                     v-show="isModifiable"/>
              <q-btn flat color="secondary" label="삭제" icon="remove" @click="removeItemAddition"
                     v-show="isModifiable" :disabled="!selectedItemAddition"/>
            </div>
          </q-card-title>

          <q-card-separator/>


          <q-card-main class="row">

            <ag-grid class="col"
                     dom-layout='autoHeight'
                     row-selection="single"
                     enable-col-resize
                     enable-sorting
                     suppress-no-rows-overlay
                     :row-data="itemAdditionArray"
                     @selection-changed="onItemAdditionSelectionChanged"
                     @cell-value-changed="onItemCellValueChanged">
              <ag-grid-column field="name" header-name="이름"
                              :checkbox-selection="true"
                              :width="300"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ maxlength: 200 }"
                              :editable="isModifiable"/>
              <ag-grid-column field="description" header-name="설명" :width="200"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ maxlength: 200 }"
                              :editable="isModifiable"/>
              <ag-grid-column field="value" header-name="추가 단가 비율(%)" :width="150"
                              :cell-style="{textAlign: 'right'}"
                              :value-formatter="percentFormatter"
                              :editable="isModifiable" cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ type: 'number',decimals: 2, prefix:'+', suffix:'%', align:'right', getValue: percentGetValue, setValue: percentSetValue }"/>

              <ag-grid-column field="remark" header-name="비고" :width="200"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ maxlength: 50 }"
                              :editable="isModifiable"/>
            </ag-grid>

          </q-card-main>

        </q-card>

        <q-card class="col-12" flat :disabled="creating">

          <q-card-title>
            부가비
            <div slot="right" class="row items-center">
              <q-btn color="secondary" outline label="추가" flat icon="add" @click="addAddition"
                     v-show="isModifiable"/>
              <q-btn flat color="secondary" label="삭제" icon="remove" @click="removeAddition"
                     v-show="isModifiable" :disabled="!selectedAddition"/>
            </div>
          </q-card-title>

          <q-card-separator/>


          <q-card-main class="row">

            <ag-grid class="col"
                     dom-layout='autoHeight'
                     row-selection="single"
                     enable-col-resize
                     enable-sorting
                     suppress-no-rows-overlay
                     :row-data="additionArray"
                     @selection-changed="onAdditionSelectionChanged"
                     @cell-value-changed="onItemCellValueChanged">
              <ag-grid-column field="name" header-name="이름"
                              :checkbox-selection="true"
                              :width="300" :editable="isModifiable"/>
              <ag-grid-column field="description" header-name="설명" :width="200"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ maxlength: 200 }"
                              :editable="isModifiable"/>
              <ag-grid-column field="quantity" header-name="수량" :width="100"
                              :cell-style="{textAlign: 'right'}"
                              :editable="isModifiable" cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ type: 'number', align:'right' }"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="unitPrice" header-name="단가" :width="100"
                              :editable="isModifiable"
                              :cell-style="{textAlign: 'right'}"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ type: 'number', decimals: 2, align:'right'}"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="amount" header-name="금액" :width="100"
                              :cell-style="{textAlign: 'right'}"
                              :tooltip="tooltipNumberToWords"/>
              <ag-grid-column field="description" header-name="비고" :width="200"
                              cell-editor-framework="ag-grid-input-editor"
                              :cell-editor-params="{ maxlength: 50 }"
                              :editable="isModifiable"/>
            </ag-grid>

          </q-card-main>

        </q-card>
      </q-tab-pane>
    </q-tabs>

    <q-page-sticky expand position="bottom">
      <q-toolbar>
        <q-btn flat icon="arrow_back" v-close-overlay v-if="closable" label="이전"></q-btn>
        <q-toolbar-title>
          <q-toggle v-model="detailedItemUnitPrice" label="상세 단가"/>
        </q-toolbar-title>
        <q-btn flat icon="send" @click="commit()" v-show="model.committable" label="제출"></q-btn>

        <q-btn flat icon="skip_next" @click="nextDraft()" v-show="model.nextDraftable"
               label="재견적"></q-btn>
        <q-btn flat icon="clear" @click="cancel()" v-show="model.cancelable" label="취소"></q-btn>
        <q-btn flat icon="file_download" @click="printSheet()" v-show="model.sheetPrintable"
               label="출력"></q-btn>
        <q-btn flat icon="save" v-if="isInfoTab" @click="onSaveClick()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

    <q-modal ref="itemFormModal">
      <item-form ref="itemForm" action="create" closable
                 :predefined="{customerId: model.customerId}"></item-form>
    </q-modal>

    <q-modal ref="itemSelectorModal" content-classes="column">
      <item-selector ref="itemSelector"></item-selector>
    </q-modal>

    <q-modal ref="bomFormModal" maximized>
      <bom-form ref="bomForm" closable></bom-form>
    </q-modal>


  </q-page>

</template>
<script>
  import { mapGetters } from 'vuex'
  import {
    QuotationExpiryPolicyArray,
    QuotationModel,
    QuotationPrintSheetOptions,
    QuotationStatusArray
  } from 'src/model/quotation'
  import { ProjectLabelArray, ProjectModel } from 'src/model/project'
  import { BomModel } from 'src/model/bom'
  import { CompanyModel } from 'src/model/company'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
  import { UserLabelArray, UserModel } from 'src/model/user'
  import ItemSelector from 'src/pages/item/item-selector.vue'
  import ItemForm from 'src/pages/item/item-form.vue'
  import BomForm from 'src/pages/bom/bom-form.vue'
  import QuotationBomRenderer from './quotation-bom-renderer.vue'
  import CommentList from 'src/pages/comment/comment-list.vue'
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
        tab: 'info',
        model: new QuotationModel(),
        projectModel: new ProjectModel(),
        customerModel: new CompanyModel(),
        managerModel: new UserModel(),
        projectLabels: new ProjectLabelArray(),
        statusLabels: new QuotationStatusArray(),
        userLabels: new UserLabelArray(),
        expiryPolicyLabels: new QuotationExpiryPolicyArray(),
        itemArray: [],
        itemAdditionArray: [],
        additionArray: [],
        creating: false,
        detailedItemUnitPrice: false,
        selectedItem: null,
        selectedItemAddition: null,
        selectedAddition: null
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
      onOpenBomClicked (data) {
        const modal = this.$refs.bomFormModal
        const form = this.$refs.bomForm
        modal.show()
        form.show(data.bomId)
        modal.$once('hide', () => {
          form.$off('saved')
          this.load()
        })
      },
      onItemSelectionChanged (event) {
        this.selectedItem = event.api.getSelectedRows()[0]
      },
      onItemAdditionSelectionChanged (event) {
        this.selectedItemAddition = event.api.getSelectedRows()[0]
      },
      onAdditionSelectionChanged (event) {
        this.selectedAddition = event.api.getSelectedRows()[0]
      },
      tooltipNumberToWords (params) {
        return this.$number.words(params.value)
      },
      createCellRenderer (additionalField) {
        return function (params) {
          const addition = _.get(params.data, additionalField)
          if (addition == null || addition == undefined) {
            return params.value
          }
          return `${params.value} (${addition})`
        }
      },
      async onItemCellValueChanged (e) {
        if (e.newValue == e.oldValue) {
          return
        }
        await e.data.save()
        this.load()
      },
      percentGetValue (value) {
        return Number(new Big(value).times(100).round(2))
      },
      percentSetValue (value) {
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
          return 70 + params.data.bom.count * 48
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
        this.itemAdditionArray = this.model.itemAdditions
        this.additionArray = this.model.additions
      },
      async onSaveClick () {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              if (this.creating) {
                const ok = await this.$alert.confirm('현재 화면을 닫으시겠습니까?')
                if (ok) {
                  this.$closeOverlay()
                } else {
                  this.$router.push({
                    path: `/quotation/show/${this.model.id}`, query: this.$route.query
                  })
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
        const attachment = this.$refs.attachment
        await attachment.save()
        await this.model.save()
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
        form.create()
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

      async removeItem () {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          await this.selectedItem.remove()
          await this.load()
        }
      },

      async addItemAddition () {
        await this.model.addUnitPriceRateItemAddition()
        this.load()
      },

      async removeItemAddition () {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          await this.selectedItemAddition.remove()
          await this.load()
        }
      },

      async addAddition () {
        await this.model.addAddition()
        this.load()
      },

      async removeAddition () {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          await this.selectedAddition.remove()
          await this.load()
        }
      },

      async commit () {
        let valid = await this.model.validateCommit()
        if (valid) {
          const ok = await this.$alert.confirm('제출 하시겠습니까?')
          if (ok) {
            await this.save()
            await this.model.commit()
            this.$alert.positive('제출 되었습니다')
            if (this.closable) {
              const ok = await this.$alert.confirm('출력 하시겠습니까?')
              if (ok) {
                await this.load()
                await this.printSheet()
              } else {
                this.$closeOverlay()
              }
            }
          }
        } else {
          this.$alert.warning('입력이 유효하지 않습니다')
        }
      },

      async cancel () {
        const ok = await this.$alert.confirm('취소 하시겠습니까?')
        if (ok) {
          await this.model.cancel()
          this.$alert.positive('취소 되었습니다')
          if (this.closable) {
            this.$closeOverlay()
          }
        }
      },

      async nextDraft () {
        const ok = await this.$alert.confirm('재견적 하시겠습니까?')
        if (ok) {
          await this.model.nextDraft()
          this.$alert.positive('재견적 되었습니다')
          this.$router.push({
            path: `/quotation/show/${this.model.id}`, query: this.$route.query
          })
        }
      },

      async printSheet () {
        const model = new QuotationPrintSheetOptions()
        let data = _.keys(model).filter(key => model[key])
        try {
          data = await this.$q.dialog({
            title: '견적서 출력',
            message: '출력 옵션을 선택하세요',
            options: {
              type: 'checkbox',
              model: data,
              items: [
                {label: '상세 단가 포함', value: 'detailedUnitPrice'},
                {label: 'BOM 포함', value: 'includedBom'}
              ]
            },
            cancel: true,
            preventClose: true,
            color: 'secondary'
          })
          _.keys(model).forEach(key => model[key] = data.includes(key))
          await this.model.printSheet(model)
        } catch (e) {
        }
      }

    },
    computed: {
      ...mapGetters({}),
      isModifiable () {
        return this.model.modifiable
      },
      isInfoTab () {
        return this.tab == 'info'
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
      CommentList,
      QuotationBomRenderer,
      BomForm
    }
  }
</script>
<style lang="stylus">
  .quotation-detailed-price
    font-size: 10px !important
    color: lightslategray
    opacity: 0.7
</style>
