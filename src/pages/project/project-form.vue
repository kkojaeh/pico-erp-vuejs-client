<template>
  <q-page class="row layout-padding">

    <q-card class="col-12" flat>

      <q-card-title>
        프로젝트 정보
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="account_circle" helper="프로젝트 이름을 입력하세요"
                 class="col-xs-12 col-md-6 col-xl-8"
                 :error="!!model.$errors.name"
                 :error-label="model.$errors.name">
          <q-input v-model="model.name" float-label="이름" class="ime-mode-active"/>
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

        <q-field icon="fa-comment" helper="프로젝트 설명을 입력하세요"
                 class="col-xs-12 col-md-12 col-xl-12">
          <c-html-editor v-model="model.description"></c-html-editor>
        </q-field>

        <q-field icon="attachment" helper="프로젝트 관련 첨부파일 입니다"
                 class="col-xs-12 col-md-12 col-xl-12">
          <c-attachment ref="attachment" v-model="model.attachmentId" category="project"
                        multiple></c-attachment>
        </q-field>

      </q-card-main>

    </q-card>

    <q-card class="col-12" flat>

      <q-card-title>
        고객 정보
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="고객사 연락처 불러오기" icon="contacts" @click="selectCompanyContact"
           :disabled="!model.customerId" v-show="!companyContactSelecting"/>
          <q-field helper="담당자를 선택하세요"
                   v-show="companyContactSelecting">
            <c-autocomplete-select v-model="selectedCompanyContactId"
                                   class="col-xs-12 col-md-6 col-xl-6"
                                   ref="companyContactSelect"
                                   float-label="담당자 이름"
                                   :options="companyContactLabels"
                                   label-field="label" value-field="value"
                                   @search="onCompanyContactSearch"
                                  @blur="companyContactSelecting = false">
              <template slot="option" slot-scope="option">
                {{option.label}}<br>
                {{option.stamp}} - {{option.subLabel}}
              </template>
            </c-autocomplete-select>
          </q-field>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-field icon="fa-building" helper="고객사를 선택하세요"
                 class="col-xs-12 col-md-6 col-xl-4"
                 :error="!!model.$errors.customerId"
                 :error-label="model.$errors.customerId">
          <c-autocomplete-select float-label="고객사" v-model="model.customerId"
                                 :label="customerModel.name" :options="companyLabels"
                                 label-field="label" value-field="value"
                                 @search="onCustomerSearch">
            <template slot="option" slot-scope="option">
              {{option.label}}<br>
              {{option.stamp}} - {{option.subLabel}}
            </template>
          </c-autocomplete-select>
        </q-field>

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
        판매 품목
        <div slot="right" class="row items-center">
          <q-btn flat color="secondary" label="추가" icon="add" @click="addSaleItem"/>
          <q-btn flat color="secondary" label="삭제" icon="remove" :disabled="!creating"
                 @click="removeSaleItem"/>
        </div>
      </q-card-title>

      <q-card-separator/>


      <q-card-main class="row gutter-md">

        <q-card-main class="row">

          <ag-grid class="col"
                   ref="addressGrid"
                   dom-layout='autoHeight'
                   row-selection="single"
                   enable-col-resize
                   :editable="true"
                   suppress-no-rows-overlay
                   @selection-changed="onAddressSelectionChanged"
                   :row-data="[]"
          >

            <ag-grid-column header-name="선택" :checkbox-selection="true" :width="70"/>
            <ag-grid-column field="name" header-name="이름" :width="150" :editable="true"
                            cell-editor-framework="ag-grid-input-editor"
                            :cell-editor-params="{ maxlength: 50 }"/>

            <ag-grid-column field="mobilePhoneNumber" header-name="휴대폰 번호" :width="150"
                            :editable="true"
                            cell-renderer-framework="ag-grid-phone-number-renderer"
                            cell-editor-framework="ag-grid-phone-number-editor"/>

            <ag-grid-column field="telephoneNumber" header-name="전화번호" :width="150"
                            :editable="true"
                            cell-renderer-framework="ag-grid-phone-number-renderer"
                            cell-editor-framework="ag-grid-phone-number-editor"/>
            <ag-grid-column field="" header-name="" :width="40" suppress-sorting
                            cell-renderer-framework="ag-grid-icon-renderer"
                            :cell-renderer-params="{handler:onAddressSearch, icon:'search', link:true}"/>
            <ag-grid-column field="address.postalCode" header-name="우편번호" :width="90"
                            :cell-style="{textAlign: 'center'}"/>
            <ag-grid-column field="address.street" header-name="주소" :width="220"/>
            <ag-grid-column field="address.detail" header-name="상세주소" :width="180" :editable="true"
                            cell-editor-framework="ag-grid-input-editor"
                            :cell-editor-params="{ maxlength: 50 }"/>
            <ag-grid-column field="enabled" header-name="사용여부" :width="90" suppress-sorting
                            cell-renderer-framework="ag-grid-checkbox-renderer"
                            cell-editor-framework="ag-grid-checkbox-editor"
                            :editable="true"/>

          </ag-grid>

        </q-card-main>

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
        <q-btn flat color="negative" icon="delete" @click="save()" v-show="!creating" label="삭제"></q-btn>
        -->
        <q-btn flat color="tertiary" icon="fa-history" @click="$refs.auditModal.show()"
               v-show="!creating" label="이력">
          <q-modal ref="auditModal" @show="$refs.auditViewer.load()">
            <audit-viewer ref="auditViewer" :url="`/audit/project/${model.id}`"></audit-viewer>
          </q-modal>
        </q-btn>
        <q-btn flat icon="save" @click="onSaveClick()" label="저장"></q-btn>
      </q-toolbar>
    </q-page-sticky>

  </q-page>

</template>
<script>
  import {mapGetters} from 'vuex'
  import {ProjectModel} from 'src/model/project'
  import {CompanyLabelArray, CompanyModel, CompanyContactLabelArray, CompanyContactModel} from 'src/model/company'
  import {UserLabelArray, UserModel} from 'src/model/user'
  import AuditViewer from 'src/pages/audit/audit-viewer.vue'
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
        companyLabels: new CompanyLabelArray(),
        userLabels: new UserLabelArray(),
        managerModel: new UserModel(),
        customerModel: new CompanyModel(),
        companyContactLabels: new CompanyContactLabelArray(),
        creating: false,
        enabled: true,
        selectedCompanyContactId: null,
        companyContactSelecting: false
      }
    },
    mounted() {
      if (this.action) {
        this.$nextTick(() => this[this.action]())
      }
      this.companyLabels.query()
      this.userLabels.query()
    },
    methods: {
      async onCustomerSearch(keyword, done) {
        await this.companyLabels.query(keyword)
        done()
      },
      async onManagerSearch(keyword, done) {
        await this.userLabels.query(keyword)
        done()
      },

      async onCompanyContactSearch(keyword, done) {
        await this.companyContactLabels.query(this.model.customerId, keyword)
        done()
      },
      async create() {
        this.creating = true
        this.model = new ProjectModel()
      },
      async show() {
        this.creating = false
        this.model = await ProjectModel.get(this.id)
      },
      async onSaveClick() {
        let valid = await this.model.validate()
        if (valid) {
          const ok = await this.$alert.confirm('저장 하시겠습니까?')
          if (ok) {
            await this.save()
            this.$alert.positive('저장 되었습니다')
            if (this.closable) {
              this.$closeOverlay()
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

      async selectCompanyContact() {
        await this.companyContactLabels.query(this.model.customerId)
        this.companyContactSelecting = true
        this.$nextTick(() => {
          this.$refs.companyContactSelect.focus()
        })
      },

      async addSaleItem(){

      },

      async removeSaleItem(){

      }
    },
    computed: {
      ...mapGetters([])
    },
    watch: {
      'model.managerId': async function (to) {
        this.managerModel = await UserModel.get(to, true)
      },
      'model.customerId': async function (to) {
        this.customerModel = await CompanyModel.get(to, true)
      },
      'selectedCompanyContactId': async function(to) {
        if(to){
          const model = this.model
          const companyContact = await CompanyContactModel.get(to, true)

          model.customerManagerContact.name = companyContact.contact.name
          model.customerManagerContact.email = companyContact.contact.email
          model.customerManagerContact.faxNumber = companyContact.contact.faxNumber
          model.customerManagerContact.mobilePhoneNumber = companyContact.contact.mobilePhoneNumber
          model.customerManagerContact.telephoneNumber = companyContact.contact.telephoneNumber
          this.selectedCompanyContactId = null
          this.companyContactSelecting = false
        }
      }
    },
    components: {
      AuditViewer,
      CommentList
    }
  }
</script>
