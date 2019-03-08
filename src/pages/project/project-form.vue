<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        프로젝트 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="프로젝트 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-6 col-xl-6"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
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

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        고객 정보
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="고객사 연락처 불러오기" icon="contacts"
                 @click="onCompanyContactLoad"
                 :disabled="!model.customerId"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fas fa-building" helper="고객사를 선택하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerId"
                 :error-label="model.$errors.customerId">
          <c-autocomplete-select float-label="고객사" v-model="model.customerId"
                                 :label="customerModel.name" :options="companyLabelArray"
                                 label-field="label" value-field="value"
                                 @search="onCustomerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

        <q-field icon="account_circle" helper="고객 담당자 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerManagerContact.name"
                 :error-label="model.$errors.customerManagerContact.name">
          <q-input v-model="model.customerManagerContact.name" float-label="고객 담당자 이름"
                   class="ime-mode-active"/>
        </q-field>

        <q-field icon="email" helper="고객 담당자 이메일을 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerManagerContact.email"
                 :error-label="model.$errors.customerManagerContact.email">
          <q-input v-model="model.customerManagerContact.email" type="email"
                   float-label="고객 담당자 이메일"
                   class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fas fa-mobile" helper="고객 담당자 핸드폰 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerManagerContact.mobilePhoneNumber"
                 :error-label="model.$errors.customerManagerContact.mobilePhoneNumber">
          <c-phone-number-input v-model="model.customerManagerContact.mobilePhoneNumber"
                                float-label="고객 담당자 핸드폰 번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="phone" helper="고객 담당자 전화 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerManagerContact.telephoneNumber"
                 :error-label="model.$errors.customerManagerContact.telephoneNumber">
          <c-phone-number-input v-model="model.customerManagerContact.telephoneNumber"
                                float-label="고객 담당자 전화번호"
                                class="ime-mode-disabled"/>
        </q-field>

        <q-field icon="fas fa-fax" helper="고객 담당자 FAX 번호를 입력하세요"
                 class="col-xs-12 col-md-6 col-lg-4 col-xl-3"
                 :error="!!model.$errors.customerManagerContact.faxNumber"
                 :error-label="model.$errors.customerManagerContact.faxNumber">
          <c-phone-number-input v-model="model.customerManagerContact.faxNumber"
                                float-label="고객 담당자 FAX 번호"
                                class="ime-mode-disabled"/>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        판매 품목
        <div slot="right" class="row items-center" v-show="false">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddSaleItem"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.saleItem"
                 @click="onRemoveSaleItem"/>
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
                 @selection-changed="onSaleItemSelectionChanged"
                 :row-data="saleItemArray"
        >

          <!--<ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>-->
          <ag-grid-column field="item.code" header-name="품목 코드" :width="200"/>
          <ag-grid-column field="item.name" header-name="품목 이름" :width="300"/>
          <ag-grid-column field="unitPrice" header-name="단가" :width="150"
                          :cell-style="{textAlign: 'right'}"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          <ag-grid-column field="createdDate" header-name="생성일" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          :cell-renderer-params="{ago:true}"/>
          <ag-grid-column field="expirationDate" header-name="만료예정" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          :cell-renderer-params="{ago:true}"/>
          <ag-grid-column field="expired" header-name="만료여부" :width="90" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"/>

        </ag-grid>

      </q-card-main>


    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        비용
        <!--
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="onAddCharge"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!selected.charge"
                 @click="onRemoveCharge"/>
        </div>
        -->
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row">

        <ag-grid class="col"
                 :grid-auto-height="true"
                 row-selection="single"
                 enable-col-resize
                 :editable="true"
                 suppress-no-rows-overlay
                 @selection-changed="onChargeSelectionChanged"
                 :row-data="chargeArray">

          <!--<ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>-->
          <ag-grid-column field="name" header-name="이름" :width="200"
                          :editable="isChargeEditable"/>
          <ag-grid-column field="unitPrice" header-name="단가" :width="150"
                          :cell-style="{textAlign: 'right'}" :editable="isChargeEditable"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          <ag-grid-column field="quantity" header-name="수량" :width="100"
                          :cell-style="{textAlign: 'right'}" :editable="isChargeEditable"
                          cell-renderer-framework="ag-grid-number-renderer"
                          :cell-renderer-params="{format:'#,##0.00', words:true}"/>
          <ag-grid-column field="createdDate" header-name="생성일" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          :cell-renderer-params="{ago:true}"/>
          <ag-grid-column field="charged" header-name="청구여부" :width="90" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"/>
          <ag-grid-column field="chargedDate" header-name="청구일" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          :cell-renderer-params="{ago:true}"/>
          <ag-grid-column field="paid" header-name="결제여부" :width="90" suppress-sorting
                          cell-renderer-framework="ag-grid-checkbox-renderer"/>
          <ag-grid-column field="paidDate" header-name="결제일" :width="200"
                          cell-renderer-framework="ag-grid-datetime-renderer"
                          :cell-renderer-params="{ago:true}"/>

        </ag-grid>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        내용 및 관련 파일
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">


        <q-field icon="fas fa-comment" helper="프로젝트 설명을 입력하세요"
                 class="col-xs-12 col-md-10 col-xl-8">
          <c-html-editor v-model="model.description"></c-html-editor>
        </q-field>

        <q-field icon="attachment" helper="프로젝트 관련 첨부파일 입니다"
                 class="col-xs-12 col-md-10 col-xl-8">
          <c-attachment ref="attachment" v-model="model.attachmentId" category="project"
                        multiple></c-attachment>
        </q-field>


      </q-card-main>

    </q-card>


    <q-card v-if="model.commentSubjectId" class="col-12" flat>

      <q-card-title>
        댓글
      </q-card-title>

      <q-card-separator/>

      <q-card-main class="row gutter-md">

        <comment-list class="col-xs-12 col-md-11 col-xl-11 no-border"
                      subjectType="project" :subject="model.commentSubjectId"></comment-list>

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
        <q-btn flat icon="save" @click="onSave()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {
    ProjectChargeArray,
    ProjectChargeModel,
    ProjectModel,
    ProjectSaleItemArray,
    ProjectSaleItemModel
  } from 'src/model/project'
  import {CompanyContactSelector, CompanyLabelArray, CompanyModel} from 'src/model/company'
  import {ItemSelector} from 'src/model/item'
  import {UserLabelArray, UserModel} from 'src/model/user'
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
        model: new ProjectModel(),
        companyLabelArray: new CompanyLabelArray(),
        userLabelArray: new UserLabelArray(),
        managerModel: new UserModel(),
        customerModel: new CompanyModel(),
        saleItemArray: new ProjectSaleItemArray(),
        chargeArray: new ProjectChargeArray(),
        enabled: true,
        selected: {
          saleItem: null,
          charge: null
        }
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.companyLabelArray.fetch()
      this.userLabelArray.fetch()
    },
    methods: {
      isChargeEditable(params) {
        return params.data.phantom;
      },
      async onCustomerSearch(keyword) {
        await this.companyLabelArray.fetch(keyword)
      },
      async onManagerSearch(keyword) {
        await this.userLabelArray.fetch(keyword)
      },
      onSaleItemSelectionChanged(event) {
        this.selected.saleItem = event.api.getSelectedRows()[0]
      },

      onChargeSelectionChanged(event) {
        this.selected.charge = event.api.getSelectedRows()[0]
      },

      async create() {
        this.model = new ProjectModel()
        this.saleItemArray = new ProjectSaleItemArray(this.model)
      },
      async show() {
        const model = await ProjectModel.get(this.id)
        const saleItemArray = new ProjectSaleItemArray(model)
        const chargeArray = new ProjectChargeArray(model)
        await Promise.all([saleItemArray.fetch(), chargeArray.fetch()])
        this.model = model
        this.saleItemArray = saleItemArray
        this.chargeArray = chargeArray
      },
      async onSave() {
        let valid = await this.model.validate()
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
        const attachment = this.$refs.attachment
        await attachment.save()
        await this.model.save()
      },

      async onCompanyContactLoad() {
        const selector = new CompanyContactSelector(this)
        selector.multiple = false
        selector.companyId = this.model.customerId
        const contacts = await selector.show()
        if (contacts && contacts.length) {
          const model = this.model
          const companyContact = contacts[0]
          model.customerManagerContact.name = companyContact.contact.name
          model.customerManagerContact.email = companyContact.contact.email
          model.customerManagerContact.faxNumber = companyContact.contact.faxNumber
          model.customerManagerContact.mobilePhoneNumber = companyContact.contact.mobilePhoneNumber
          model.customerManagerContact.telephoneNumber = companyContact.contact.telephoneNumber
        }
      },

      async onAddSaleItem() {
        const itemSelector = new ItemSelector(this)
        const itemModels = await itemSelector.show()
        if (!itemModels) {
          return
        }
        itemModels.map(async (itemModel) => {
          const itemId = itemModel.id
          const saleItem = new ProjectSaleItemModel({
            itemId: itemId
          })
          await saleItem.fetchReference()
          this.saleItemArray.push(saleItem)
        })
      },

      async onAddCharge() {
        this.chargeArray.push(new ProjectChargeModel())
      },

      async onRemoveSaleItem() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          this.saleItemArray.remove(this.selected.saleItem)
          this.selected.saleItem = null
        }
      },

      async onRemoveCharge() {
        const ok = await this.$alert.confirm('삭제 하시겠습니까?')
        if (ok) {
          this.chargeArray.remove(this.selected.charge)
          this.selected.charge = null
        }
      }
    },
    computed: {
      phantom() {
        return this.model.phantom
      }
    },
    watch: {
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      },
      'model.customerId': async function (to) {
        this.customerModel = await CompanyModel.get(to, true)
      }
    },
    components: {
      CommentList
    }
  }
</script>
